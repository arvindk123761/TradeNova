
const db = require("../config/db");
const logActivity = require("../utils/activityLogger");

exports.getBalance = (req, res) => {

    const user_id = req.user.id;

    const walletSql = `
        SELECT balance
        FROM wallet
        WHERE user_id = ?
    `;

    db.query(walletSql, [user_id], (err, walletResult) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        const balance = walletResult.length ? walletResult[0].balance : 0;

        const portfolioSql = `
           SELECT
    SUM(quantity * buy_price) AS investment,
    COUNT(DISTINCT stock_id) AS totalHoldings
FROM portfolio
WHERE user_id = ?
        `;

        db.query(portfolioSql, [user_id], (err2, portfolioResult) => {

            if (err2) {
                return res.status(500).json({
                    success: false,
                    message: err2.message
                });
            }

        res.json({
    success: true,
    balance,
    investment: portfolioResult[0].investment || 0,
    totalHoldings: portfolioResult[0].totalHoldings || 0
});
        });

    });

};

exports.addMoney = (req, res) => {

    const user_id = req.user.id;

    const { amount } = req.body;

    const sql = `
        UPDATE wallet
        SET balance = balance + ?
        WHERE user_id = ?
    `;

   db.query(sql, [amount, user_id], (err) => {

    if (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

    const transactionSql = `
        INSERT INTO transactions(user_id, type, amount, description)
        VALUES (?, 'DEPOSIT', ?, ?)
    `;

    db.query(
        transactionSql,
        [user_id, amount, `Added ₹${amount} to wallet`],
        (err2) => {

            if (err2) {
                return res.status(500).json({
                    success: false,
                    message: err2.message
                });
            }
logActivity(
    user_id,
    `💰 Added ₹${amount} to Wallet`
);

res.json({
    success: true,
    message: "Money Added Successfully"
});

        }
    );

});
};