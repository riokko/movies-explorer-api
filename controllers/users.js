const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');
const {
  notFoundMessage,
  badRequestMessage,
  conflictMessage,
  notValidMessage,
} = require('../errors/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundMessage);
      }
      const { name, email } = user;
      res.status(200).send({ email, name });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(badRequestMessage);
      }
      next(err);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  if (!name || !email) {
    throw new BadRequestError(badRequestMessage);
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(conflictMessage);
      }
      return User.findByIdAndUpdate(
        req.user._id,
        { email, name },
        { new: true, runValidators: true, context: 'query' },
      )
        .then((currentUser) => {
          if (!currentUser) {
            throw new NotFoundError(notFoundMessage);
          }
          res.status(200).send({ email, name });
        })
        .catch((err) => {
          if (err.name === 'CastError' || err.name === 'ValidationError') {
            throw new BadRequestError(badRequestMessage);
          }
          next(err);
        });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(conflictMessage);
      }
      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, email, password: hash }));
    })
    .then((user) => {
      res.status(201).send({ email: user.email, id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(badRequestMessage);
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError(notValidMessage);
      }

      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError(notValidMessage);
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          res.status(201).send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getProfile, updateProfile, createUser, login,
};
