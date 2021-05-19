const rateLimit = require('express-rate-limit');

const DB_ADDRESS = 'mongodb://localhost:27017/bitfilmsdb';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
const options = {
  origin: ['http://localhost:3000', 'https://movie.nomoredomains.icu'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = {
  DB_ADDRESS,
  limiter,
  options,
};
