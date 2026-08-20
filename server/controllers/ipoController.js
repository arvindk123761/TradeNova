const db = require("../config/db");

// Get all IPOs
const getIPOs = (req, res) => {

    const sql = "SELECT * FROM ipo ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            ipos: result
        });

    });

};

// Apply for IPO
const applyIPO = (req, res) => {

    const user_id = req.user.id;

    const { ipo_id, lots } = req.body;

    if (!ipo_id || !lots) {
        return res.status(400).json({
            success: false,
            message: "IPO ID and lots are required"
        });
    }

    // Get IPO details
    db.query(
        "SELECT * FROM ipo WHERE id=?",
        [ipo_id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "IPO not found"
                });
            }

            const ipo = result[0];

            const amount =
                Number(ipo.price) *
                Number(ipo.lot_size) *
                Number(lots);

            db.query(
                `INSERT INTO ipo_applications
                (user_id, ipo_id, lots, amount)
                VALUES (?, ?, ?, ?)`,
                [
                    user_id,
                    ipo_id,
                    lots,
                    amount
                ],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.json({
                        success: true,
                        message: "IPO Applied Successfully"
                    });

                }
            );

        }
    );

};

module.exports = {
    getIPOs,
    applyIPO
};