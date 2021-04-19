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
    "/:movId",
    celebrate({
        params: Joi.object()
            .keys({
                movId: Joi.string().required(),
            })
            .unknown(true),
    }),
    removeMovie
);

module.exports = moviesRouter;
