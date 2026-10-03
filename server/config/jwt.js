require("dotenv").config();

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured in production.");
}

const secret = process.env.JWT_SECRET || "local-development-only-secret";

module.exports = { secret };