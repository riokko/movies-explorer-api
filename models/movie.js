const mongoose = require('mongoose');
const { isURL } = require('validator');

const { urlErrorMessage } = require('../errors/errorMessages');

const movieSchema = new mongoose.Schema({
  country: { type: String || null }, // страна создания фильма
  director: { type: String, required: true }, // режиссёр фильма
  duration: { type: Number, required: true }, // длительность фильма
  year: { type: String, required: true }, // год выпуска фильма
  description: { type: String, required: true }, // описание фильма
  image: {
    // ссылка на постер к фильму
    type: String,
    required: true,
    validate: {
      validator: (value) => isURL(value),
      message: (props) => `${props.value} ${urlErrorMessage}`,
    },
  },
  trailer: {
    // ссылка на трейлер к фильму
    type: String,
    required: true,
    validate: {
      validator: (value) => isURL(value),
      message: (props) => `${props.value} ${urlErrorMessage}`,
    },
  },
  owner: {
    // _id пользователя, который сохранил фильм
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
  // _id фильма, кот. содержится в ответе сервиса MoviesExplorer
  movieId: { type: Number, required: true },
  nameRU: { type: String, required: true }, // название фильма на русском языке
  nameEN: { type: String || null }, // название фильма на английском языке
});

module.exports = mongoose.model('movie', movieSchema);
