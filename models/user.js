const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Это обязательное поле"],
        validate: {
            validator: (v) => isEmail(v),
            message: (props) =>
                `${props.value} не является адресом электронной почты`,
        },
    },
    password: {
        type: String,
        required: [true, "Это обязательное поле"],
        minlength: [8, "Пароль должен содержать не менее 8 символов"],
        select: false,
    },
    name: {
        type: String,
        required: [true, "Это обязательное поле"],
        minlength: [2, "Поле не может содержать менее 2 символов"],
        maxlength: [30, "Поле не может содержать более 30 символов"],
    },
});

module.exports = mongoose.model("user", userSchema);
