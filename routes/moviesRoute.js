const movieRouter = require('express').Router();
const movieController = require('../controllers/moviesControllers');
const { validateMovieId, validateMovieData } = require('../utils/validators/movieValidators');

// возвращает все сохраненные текущим пользователем фильмы
movieRouter.get('/', movieController.getMovie);

// создает фильм с переданными в теле полями(свойствами)
movieRouter.post('/', validateMovieData, movieController.createMovie);

// удалаяет сохранный фильм по id
movieRouter.delete('/:id', validateMovieId, movieController.removeMovie);

module.exports = movieRouter;
