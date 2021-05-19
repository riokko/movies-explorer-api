require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');

const express = require('express');
const { connect } = require('mongoose');
const { errors } = require('celebrate');

const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { DB_ADDRESS, limiter, options } = require('./utils/config');

const app = express();
const { PORT = 3001, DB = DB_ADDRESS } = process.env;

app.use('*', cors(options));

connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(helmet());
app.use(express.json());

app.use(requestLogger);
app.use(limiter);

app.use(router);

app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
