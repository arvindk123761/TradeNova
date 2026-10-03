const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");

const auth = (req, res, next) => {

    const authorization = req.headers.authorization;
    const token = authorization && authorization.startsWith("Bearer ")
        ? authorization.slice(7)
        : authorization;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access Denied"
        });
    }

    try {

        const decoded = jwt.verify(token, secret);
        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

};

module.exports = auth;