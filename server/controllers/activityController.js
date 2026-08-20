const db = require("../config/db");

const getActivities = (req, res) => {
    db.query(
        `SELECT activity, created_at
         FROM activities
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 100`,
        [req.user.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            res.json({ success: true, activities: result });
        }
    );
};

module.exports = { getActivities };
