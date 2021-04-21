const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

const badRequestMessage = require('../errors/errorMessages');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
    owner,
  })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError(badRequestMessage);
      }
      res.send({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        movieId,
        nameRU,
        nameEN,
        thumbnail,
      });
    })
    .catch(next);
};

const removeMovie = (req, res, next) => {
  Movie.findOne({
    movieId: req.params.movieId,
    owner: req.user._id,
  })
    .select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError(badRequestMessage);
      }
      const deletedMovie = movie;
      movie.remove();
      res.send(deletedMovie);
    })
    .catch((err) => next(err));
};

module.exports = { getMovies, createMovie, removeMovie };
