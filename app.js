require("dotenv").config();
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const { celebrate, Joi, errors } = require("celebrate");

const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");

const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { NotFoundError } = require("./errors/errors");

const options = {
    origin: ["http://localhost:3000"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "origin", "Authorization"],
    credentials: true,
};

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/bitfilmsdb", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

app.use("*", cors(options));
app.use(express.json());
app.use(requestLogger);

app.post(
    "/signup",
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().min(2).max(30),
            about: Joi.string().min(2).max(30),
            avatar: Joi.string().pattern(
                /^(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\\/\w-]*)*\/?#?/
            ),
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
        }),
    }),
    createUser
);
app.post(
    "/signin",
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(8),
        }),
    }),
    login
);

app.use(auth);
app.use("/users", usersRouter);
app.use("/movies", moviesRouter);

app.use("*", (req, res) => {
    new NotFoundError("Нет такой страницы");
});
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;

    res.status(statusCode).send({
        message: statusCode === 500 ? "На сервере произошла ошибка" : message,
    });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
