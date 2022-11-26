const mongoose = require('mongoose');
const validator = require('validator');

const urlValidator = {
  validator: (v) => validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true }),
  message: ({ value }) => `${value} - некоректный адрес URL. Ожидается адрес в формате: http(s)://(www).site.com`,
};

const movieSchema = new mongoose.Schema({
  country: {
    require: true,
    type: String,
  },
  director: {
    require: true,
    type: String,
  },
  duration: {
    require: true,
    type: Number,
  },
  year: {
    require: true,
    type: Number,
  },
  description: {
    require: true,
    type: String,
  },
  image: {
    require: true,
    type: String,
    validate: urlValidator,
  },
  trailerLink: {
    require: true,
    type: String,
    validate: urlValidator,
  },
  thumbnail: {
    require: true,
    type: String,
    validate: urlValidator,
  },
  owner: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  movieId: {
    require: true,
    type: Number,
  },
  nameRU: {
    require: true,
    type: String,
  },
  nameEN: {
    require: true,
    type: String,
  },
});

module.exports = mongoose.model('movie', movieSchema);
