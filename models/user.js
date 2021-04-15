const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {},
    password: {},
    name: {}
});

module.exports = mongoose.model("user", userSchema);
