const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const token = req.headers.authorization

    if (token) {
        const decode = jwt.verify(token, process.env.JWT_TOKEN);
        if (decode) {
            req.body.name = decode.name;
            next();
        } else {
            res.status(400).send({ "message": "Token expired please login again!" })
        }
    } else {
        res.status(400).send({ "message": "Please login to continue!" })
    }
}

module.exports = { auth }