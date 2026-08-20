const db = require("../config/db");
const logActivity = require("../utils/activityLogger");

// ==============================
// BUY STOCK
// ==============================

const buyStock = (req, res) => {

    const user_id = req.user.id;

    const { stock_id, quantity, buy_price } = req.body;

    if (!stock_id || !Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
        return res.status(400).json({
            success: false,
            message: "A valid stock and quantity are required"
        });
    }

    db.query(
        "SELECT current_price FROM stocks WHERE id = ?",
        [stock_id],
        (stockErr, stockResult) => {
            if (stockErr) {
                return res.status(500).json({ success: false, message: stockErr.message });
            }

            if (stockResult.length === 0) {
                return res.status(404).json({ success: false, message: "Stock not found" });
            }

            const price = Number(buy_price) > 0
                ? Number(buy_price)
                : Number(stockResult[0].current_price);
            const requestedQuantity = Number(quantity);
            const totalCost = requestedQuantity * price;

    db.query(
        "SELECT balance FROM wallet WHERE user_id = ?",
        [user_id],
        (err, walletResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (walletResult.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Wallet not found"
                });
            }

            const balance = Number(walletResult[0].balance);

            if (balance < totalCost) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient balance"
                });
            }

            db.query(
                "UPDATE wallet SET balance = balance - ? WHERE user_id = ?",
                    [totalCost, user_id],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    const portfolioSql =
                    `
                    SELECT *
                    FROM portfolio
                    WHERE user_id = ?
                    AND stock_id = ?
                    `;

                    db.query(
                        portfolioSql,
                        [user_id, stock_id],
                        (err, portfolioResult) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            if (portfolioResult.length > 0) {

                                const oldQty = Number(portfolioResult[0].quantity);
                                const newQty = oldQty + requestedQuantity;
                                const averagePrice = (
                                    oldQty * Number(portfolioResult[0].buy_price) +
                                    requestedQuantity * price
                                ) / newQty;

                                db.query(
                                    "UPDATE portfolio SET quantity=?, buy_price=? WHERE id=?",
                                    [newQty, averagePrice.toFixed(2), portfolioResult[0].id],
                                    afterPortfolio
                                );

                            } else {

                                db.query(
                                    `INSERT INTO portfolio(user_id,stock_id,quantity,buy_price)
                                     VALUES(?,?,?,?)`,
                                    [user_id, stock_id, requestedQuantity, price],
                                    afterPortfolio
                                );

                            }

                            function afterPortfolio(err){

                                if(err){
                                    return res.status(500).json({
                                        success:false,
                                        message:err.message
                                    });
                                }

                                db.query(
                                    `INSERT INTO orders(user_id,stock_id,order_type,quantity,price)
                                     VALUES(?,?, 'BUY', ?, ?)`,
                                    [user_id, stock_id, requestedQuantity, price],
                                    (err)=>{

                                        if(err){
                                            return res.status(500).json({
                                                success:false,
                                                message:err.message
                                            });
                                        }

                                        db.query(
                                            `INSERT INTO transactions(user_id,type,amount,description)
                                             VALUES(?, 'BUY', ?, ?)`,
                                            [
                                                user_id,
                                                totalCost,
                                                `Bought ${requestedQuantity} shares`
                                            ],
                                            (err)=>{

                                                if(err){
                                                    return res.status(500).json({
                                                        success:false,
                                                        message:err.message
                                                    });
                                                }
logActivity(
    user_id,
    `🟢 Bought ${requestedQuantity} shares`
);
                                                res.json({
                                                    success:true,
                                                    message:"Stock purchased successfully!"
                                                });

                                            }
                                        );

                                    }
                                );

                            }

                        }
                    );

                }
            );

        }
    );
        }
    );

};

// ==============================
// SELL STOCK
// ==============================

const sellStock = (req, res) => {

    const user_id = req.user.id;
    const { portfolio_id, quantity } = req.body;

    if (!portfolio_id || !quantity) {
        return res.status(400).json({
            success: false,
            message: "Portfolio ID and quantity are required"
        });
    }

    db.query(
        "SELECT * FROM portfolio WHERE id=? AND user_id=?",
        [portfolio_id, user_id],
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
                    message: "Stock not found in portfolio"
                });
            }

            const portfolio = result[0];

            const stock_id = portfolio.stock_id;
            const ownedQty = Number(portfolio.quantity);
            const sellQty = Number(quantity);
            const buyPrice = Number(portfolio.buy_price);
            db.query(
    "SELECT current_price FROM stocks WHERE id = ?",
    [stock_id],
    (err, stockResult) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (stockResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Stock not found"
            });
        }

        const currentPrice = Number(stockResult[0].current_price);
        const refund = sellQty * currentPrice;

            if (sellQty <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quantity"
                });
            }

            if (sellQty > ownedQty) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough shares"
                });
            }

          
            const remaining = ownedQty - sellQty;

            const updatePortfolio = (callback) => {

                if (remaining === 0) {

                    db.query(
                        "DELETE FROM portfolio WHERE id=?",
                        [portfolio_id],
                        callback
                    );

                } else {

                    db.query(
                        "UPDATE portfolio SET quantity=? WHERE id=?",
                        [remaining, portfolio_id],
                        callback
                    );

                }

            };

            updatePortfolio((err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                db.query(
                    "UPDATE wallet SET balance = balance + ? WHERE user_id=?",
                    [refund, user_id],
                    (err) => {

                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message
                            });
                        }

                        db.query(
                            `INSERT INTO orders(user_id, stock_id, order_type, quantity, price)
                             VALUES (?, ?, 'SELL', ?, ?)`,
                            [user_id, stock_id, sellQty, currentPrice],
                            (err) => {

                                if (err) {
                                    return res.status(500).json({
                                        success: false,
                                        message: err.message
                                    });
                                }

                                db.query(
                                    `INSERT INTO transactions(user_id, type, amount, description)
                                     VALUES (?, 'SELL', ?, ?)`,
                                    [
                                        user_id,
                                        refund,
                                        `Sold ${sellQty} shares`
                                    ],
                                    (err) => {

                                        if (err) {
                                            return res.status(500).json({
                                                success: false,
                                                message: err.message
                                            });
                                        }

logActivity(
    user_id,
    `🔴 Sold ${quantity} shares`
);
                                        res.json({
                                            success: true,
                                            message: "Stock sold successfully!"
                                        });

                                    }
                                );

                            }
                        );

                    }
                );
            });

        });

    });

};
module.exports = {
    buyStock,
    sellStock
};