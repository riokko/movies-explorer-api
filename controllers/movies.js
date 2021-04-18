const Movie = require("../models/movie");

const {
    NotFoundError,
    BadRequestError,
    AuthError,
} = require("../errors/errors");

const getMovies = (req, res, next) => {
    Movie.find({})
        .then((movies) => res.status(200).send(movies))
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
        nameRU,
        nameEN,
        thumbnail,
        movieId,
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
        nameRU,
        nameEN,
        thumbnail,
        movieId,
        owner,
    })
        .then((movie) => {
            if (!movie) {
                throw new BadRequestError("Ошибка создания фильма");
            }
            res.send(movie);
        })
        .catch(next);
};

const removeMovie = (req, res, next) => {
    Movie.findByIdAndRemove(req.params.movieId)
        .then((movie) => {
            if (!movie) {
                throw new NotFoundError("Фильм с таким ID не найден");
            } else if (
                JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)
            ) {
                return Promise.reject(
                    new AuthError("Вы не являетесь автором фильма")
                );
            } else {
                return res.send(movie);
            }
        })
        .catch((err) => {
            if (err.name === "CastError") {
                throw new BadRequestError("Что-то не так с данными карточки");
            } else {
                next();
            }
        });
};

module.exports = { getMovies, createMovie, removeMovie };
