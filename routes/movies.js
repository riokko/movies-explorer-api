const moviesRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
    getMovies,
    createMovie,
    removeMovie,
} = require("../controllers/movies");

moviesRouter.get("/", getMovies);
moviesRouter.post("/", createMovie);
moviesRouter.delete(
    "/movieId",
    celebrate({
        params: Joi.object()
            .keys({
                cardId: Joi.string().required().length(24).hex(),
            })
            .unknown(true),
    }),
    removeMovie
);

module.exports = moviesRouter;
