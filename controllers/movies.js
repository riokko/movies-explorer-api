const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  badRequestMessage,
  conflictMessage,
  notFoundMessage,
  forbiddenMessage,
} = require('../errors/errorMessages');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

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
  } = req.body;
  const owner = req.user._id;
  Movie.findOne({ owner: req.user._id, movieId })
    .then((data) => {
      if (data) {
        throw new ConflictError(conflictMessage);
      }
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
        owner,
      })
        .then((movie) => {
          res.send(movie);
        })
        .catch((err) => {
          if (
            err.name === 'CastError' || err.name === 'ValidationError'
          ) {
            throw new BadRequestError(badRequestMessage);
          }
          next(err);
        })
        .catch(next);
    })
    .catch(next);
};

const removeMovie = (req, res, next) => {
  Movie.findOne({
    _id: req.params.id,
  })
    .select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(notFoundMessage);
      } else if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(req.params.id)
          .then((movieForRemoving) => {
            if (!movieForRemoving) {
              throw new NotFoundError(notFoundMessage);
            }
            res.status(200).send(movieForRemoving);
          })
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenMessage);
      }
    })
    .catch(next);
};

module.exports = { getMovies, createMovie, removeMovie };
