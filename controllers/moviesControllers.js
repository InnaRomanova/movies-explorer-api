const Movie = require('../models/movie');
const ErrorCode = require('../errors/errorCode');
const NotFoundCode = require('../errors/notFoundCode');
const ServerCode = require('../errors/serverCode');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getMovie = (req, res, next) => {
  Movie.find({ owner: req.user._id }).then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorCode('Ошибка валидации'));
      } else {
        next(new ServerCode('Ошибка на сервере'));
      }
    });
};

module.exports.removeMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    // .orFail(() => {
    //   throw new NotFoundCode('Фильм с таким id не найден');
    // })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundCode('Фильм с таким id не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Чужие фильмы удалять нельзя');
      }
      return movie.delete()
        .then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorCode('Некорректный id фильма'));
      } else {
        next(err);
      }
    });
};
