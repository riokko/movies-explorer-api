require("dotenv").config();
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const { celebrate, Joi, errors } = require("celebrate");

const router = require("./routes/index");

const { createUser, login } = require("./controllers/users");

const { requestLogger, errorLogger } = require("./middlewares/logger");

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

app.use(router);

app.use(errorLogger);
app.use(errors());

app.use((req, res, next, err) => {
    const { statusCode = 500, message } = err;

    res.status(statusCode).send({
        message: statusCode === 500 ? "На сервере произошла ошибка" : message,
    });
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${PORT}`);
});
