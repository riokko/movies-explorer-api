const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  removeMovie,
} = require('../controllers/movies');

const regexp = /^(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\\/\w-]*)*\/?#?/;

moviesRouter.get('/', getMovies);
moviesRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().allow(null),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().trim().required(),
      description: Joi.string().required(),
      image: Joi.string().trim().regex(regexp).required(),
      trailer: Joi.string().trim().regex(regexp).required(),
      // thumbnail: Joi.string().trim().regex(regexp).required(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().allow(null),
    }),
  }),
  createMovie,
);
moviesRouter.delete(
  '/:id',
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string().required().hex().length(24),
      }),
  }),
  removeMovie,
);

module.exports = moviesRouter;
