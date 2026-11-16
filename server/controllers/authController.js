const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register User
const registerUser = async (req, res) => {

    const { full_name, email, password, mobile } = req.body;

    try {

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users(full_name, email, password, mobile)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [full_name, email, hashedPassword, mobile],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                db.query(
                    "INSERT IGNORE INTO wallet(user_id, balance) VALUES (?, 0)",
                    [result.insertId],
                    (walletErr) => {
                        if (walletErr) {
                            return res.status(500).json({ success: false, message: walletErr.message });
                        }

                res.status(201).json({
                    success: true,
                    message: "User Registered Successfully"
                });

                    }
                );

            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Login User
const login = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Email not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            });
        }

     const token = jwt.sign(
{
    id: user.id,
    email: user.email
},
secret,
{
    expiresIn: "1d"
}
);

return res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        mobile: user.mobile
    }
});
    });

};

const isValidEmail = email =>
    typeof email === "string" &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const createResetMailer = () => {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM;
    const port = Number(process.env.SMTP_PORT || 587);
    const appUrl = process.env.PUBLIC_APP_URL;

    if (!host || !user || !password || !from || !appUrl || !Number.isInteger(port) || port < 1 || port > 65535) {
        return null;
    }

    let parsedAppUrl;
    try {
        parsedAppUrl = new URL(appUrl);
    } catch {
        return null;
    }

    if (!["http:", "https:"].includes(parsedAppUrl.protocol) ||
        (process.env.NODE_ENV === "production" && parsedAppUrl.protocol !== "https:")) {
        return null;
    }

    return {
        from,
        appUrl: parsedAppUrl.origin,
        transporter: nodemailer.createTransport({
            host,
            port,
            secure: process.env.SMTP_SECURE === "true",
            auth: { user, pass: password }
        })
    };
};

const requestPasswordReset = async (req, res) => {
    const email = req.body?.email;

    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Enter a valid email address."
        });
    }

    const mailer = createResetMailer();
    if (!mailer) {
        console.error("Password reset email configuration is incomplete.");
        return res.status(503).json({
            success: false,
            message: "Password reset email is not configured. Please contact support."
        });
    }

    try {
        const [users] = await db.promise().query(
            "SELECT id, email, password FROM users WHERE email = ? LIMIT 1",
            [email.trim()]
        );

        if (users.length > 0) {
            const user = users[0];
            const passwordVersion = crypto
                .createHash("sha256")
                .update(user.password)
                .digest("hex");
            const token = jwt.sign({
                purpose: "password-reset",
                id: user.id,
                email: user.email,
                passwordVersion
            }, secret, { expiresIn: "15m" });
            const resetUrl = new URL("/reset-password.html", mailer.appUrl);
            resetUrl.searchParams.set("token", token);

            await mailer.transporter.sendMail({
                from: mailer.from,
                to: user.email,
                subject: "Reset your TradeNova password",
                text: `We received a request to reset your TradeNova password. Use this link within 15 minutes:\n\n${resetUrl.href}\n\nIf you did not request this, you can ignore this email.`,
                html: `<p>We received a request to reset your TradeNova password.</p><p><a href="${resetUrl.href}">Set a new password</a></p><p>This link expires in 15 minutes. If you did not request this, you can ignore this email.</p>`
            });
        }

        return res.json({
            success: true,
            message: "If an account exists for that email, a password reset link has been sent."
        });
    } catch (error) {
        console.error("Password reset email could not be sent:", error.message);
        return res.status(503).json({
            success: false,
            message: "Password reset email could not be sent right now. Please try again later."
        });
    }
};

const resetPassword = async (req, res) => {
    const token = req.body?.token;
    const password = req.body?.password;

    if (typeof token !== "string" || token.length > 2048 ||
        typeof password !== "string" || password.length < 6 ||
        Buffer.byteLength(password, "utf8") > 72) {
        return res.status(400).json({
            success: false,
            message: "A valid reset link and a password of 6 to 72 bytes are required."
        });
    }

    try {
        const payload = jwt.verify(token, secret);
        if (payload.purpose !== "password-reset" ||
            !Number.isInteger(payload.id) ||
            typeof payload.email !== "string" ||
            typeof payload.passwordVersion !== "string") {
            throw Object.assign(new Error("Invalid password reset token"), {
                code: "INVALID_PASSWORD_RESET_LINK"
            });
        }

        const [users] = await db.promise().query(
            "SELECT id, email, password FROM users WHERE id = ? AND email = ? LIMIT 1",
            [payload.id, payload.email]
        );

        if (users.length === 0) {
            throw Object.assign(new Error("Invalid password reset token"), {
                code: "INVALID_PASSWORD_RESET_LINK"
            });
        }

        const currentPasswordVersion = crypto
            .createHash("sha256")
            .update(users[0].password)
            .digest("hex");
        const expectedVersion = Buffer.from(payload.passwordVersion, "hex");
        const actualVersion = Buffer.from(currentPasswordVersion, "hex");

        if (expectedVersion.length !== actualVersion.length ||
            !crypto.timingSafeEqual(expectedVersion, actualVersion)) {
            throw Object.assign(new Error("Password reset link has already been used"), {
                code: "INVALID_PASSWORD_RESET_LINK"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.promise().query(
            "UPDATE users SET password = ? WHERE id = ? AND email = ? AND password = ?",
            [hashedPassword, payload.id, payload.email, users[0].password]
        );

        if (result.affectedRows !== 1) {
            throw Object.assign(new Error("Password reset link has already been used"), {
                code: "INVALID_PASSWORD_RESET_LINK"
            });
        }

        return res.json({
            success: true,
            message: "Password updated. You can now sign in with your new password."
        });
    } catch (error) {
        if (["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(error.name) ||
            error.code === "INVALID_PASSWORD_RESET_LINK") {
            return res.status(400).json({
                success: false,
                message: "This password reset link is invalid, expired, or already used. Request a new link."
            });
        }

        console.error("Password reset failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to update your password right now. Please try again later."
        });
    }
};

// Export both functions
module.exports = {
    registerUser,
    login,
    requestPasswordReset,
    resetPassword
};