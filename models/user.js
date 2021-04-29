const mongoose = require('mongoose');
const { isEmail } = require('validator');

const {
  emailErrorMessage,
  requiredFieldMessage,
  minTwoSymbolMessage,
  maxThirtySymbolMessage,
} = require('../errors/errorMessages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, requiredFieldMessage],
    validate: {
      validator: (v) => isEmail(v),
      message: emailErrorMessage,
    },
  },
  password: {
    type: String,
    required: [true, requiredFieldMessage],
    select: false,
  },
  name: {
    type: String,
    required: [true, requiredFieldMessage],
    minlength: [2, minTwoSymbolMessage],
    maxlength: [30, maxThirtySymbolMessage],
  },
});

module.exports = mongoose.model('user', userSchema);
