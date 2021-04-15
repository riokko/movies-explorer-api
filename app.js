const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;

// noinspection JSIgnoredPromiseFromCall
mongoose.connect("mongodb://localhost:27017/bitfilmsdb", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

app.use(express.json());

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
