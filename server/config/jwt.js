const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured in production.");
}

const secret = process.env.JWT_SECRET || "local-development-only-secret";

module.exports = { secret };