const Movie = require("../models/movie");

const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

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
                throw new BadRequestError("Ошибка создания фильма");
            }
            res.send(movie);
        })
        .catch(next);
};

const removeMovie = (req, res, next) => {
    console.log("movie");
    Movie.findByIdAndRemove(req.params.movId)
        .then((movie) => {
            console.log(movie);
            if (!movie) {
                throw new NotFoundError("Фильм с таким ID не найден");
            } else if (
                JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)
            ) {
                return Promise.reject(
                    new ForbiddenError("Вы не являетесь автором фильма")
                );
            } else {
                return res.status(200).send(movie);
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
