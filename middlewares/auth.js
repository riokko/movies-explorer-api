const jwt = require("jsonwebtoken");
const { AuthError } = require("../errors/errors");
require("dotenv").config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new AuthError("Необходима авторизация");
    }
    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
        payload = jwt.verify(
            token,
            NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
        );
    } catch (err) {
        return res.status(401).send({ message: "Необходима авторизация" });
    }

    req.user = payload;
    next();
};
