const db = require("../config/db");
const logActivity = require("../utils/activityLogger");
const bcrypt = require("bcrypt");

const getProfile = (req, res) => {

    const user_id = req.user.id;

    const sql = `
        SELECT
            users.full_name,
            users.email,
            users.mobile,
            users.created_at,
            wallet.balance
        FROM users

        LEFT JOIN wallet
        ON users.id = wallet.user_id

        WHERE users.id = ?
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
res.json({
    success: true,
    user: result[0]
});

    });

};

const updateProfile = (req, res) => {

    const user_id = req.user.id;

    const { full_name, mobile } = req.body;

    const sql = `
        UPDATE users
        SET full_name = ?, mobile = ?
        WHERE id = ?
    `;

    db.query(sql, [full_name, mobile, user_id], (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        logActivity(
    user_id,
    "👤 Updated Profile"
);

        res.json({
            success: true,
            message: "Profile Updated Successfully"
        });

    });

};

const changePassword = async (req, res) => {

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Current password and a new password of at least 6 characters are required"
        });
    }

    try {
        const [users] = await db.promise().query(
            "SELECT password FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const matches = await bcrypt.compare(currentPassword, users[0].password);

        if (!matches) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.promise().query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, req.user.id]
        );

        res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword
};