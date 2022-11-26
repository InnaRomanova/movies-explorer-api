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
  Movie.findOne({ movieId: req.body.movieId, owner: req.user._id })
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
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundCode('Карточка с таким id не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Чужие карточки удалять нельзя');
      }
      return movie.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorCode('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};
