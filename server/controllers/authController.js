const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const db = require("../config/db");
const bcrypt = require("bcrypt");

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
// Export both functions
module.exports = {
    registerUser,
    login
};