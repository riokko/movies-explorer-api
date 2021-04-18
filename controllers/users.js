const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
    NotFoundError,
    BadRequestError,
    AuthError,
    ConflictError,
} = require("../errors/errors");
const { NODE_ENV, JWT_SECRET } = process.env;

const getProfile = (req, res, next) => {
    User.findById(req.user._id)
        .then((user) => {
            if (user) {
                res.status(200).send(user.email, user.name);
            }
        })
        .catch((err) => {
            if (err.name === "CastError") {
                throw new NotFoundError("Нет пользователя с таким id");
            } else {
                next(new NotFoundError("Такого пользователя не существует"));
            }
        });
};

const updateProfile = (req, res, next) => {
    const { email, name } = req.body;
    User.findByIdAndUpdate(
        req.user._id,
        { email, name },
        { new: true, runValidators: true }
    )
        .then((user) => {
            if (!user) {
                throw new NotFoundError("Нет пользователя с таким id");
            } else {
                res.status(200).send(user.email, user.name);
            }
        })
        .catch((err) => {
            if (err.name === "CastError") {
                throw new NotFoundError("Нет пользователя с таким id");
            } else if (err.name === "ValidationError") {
                throw new BadRequestError(
                    "Что-то не так с данными пользователя"
                );
            } else {
                next();
            }
        });
};

const createUser = (req, res, next) => {
    const { name, email, password } = req.body;

    bcrypt
        .hash(password, 10)
        .then((hash) => {
            User.create({ name, email, password: hash })
                .then((user) => {
                    if (!user) {
                        throw new AuthError("Ошибка авторизации");
                    }
                    res.status(201).send({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                    });
                })
                .catch((e) => {
                    next(new ConflictError(e));
                });
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                throw new BadRequestError(
                    "Что-то не так с данными пользователя"
                );
            } else {
                next();
            }
        });
};

const login = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .select("+password")
        .then((user) => {
            if (!user) {
                throw new AuthError("Неправильные почта или пароль");
            }

            return bcrypt
                .compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        throw new AuthError("Неправильные почта или пароль");
                    }
                    const token = jwt.sign(
                        { _id: user._id },
                        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
                        { expiresIn: "7d" }
                    );
                    res.status(201).send({ token });
                })
                .catch(() => {
                    next(new AuthError("Ошибка авторизации"));
                });
        })
        .catch(() => {
            next(new AuthError("Ошибка авторизации"));
        });
};

module.exports = { getProfile, updateProfile, createUser, login };
