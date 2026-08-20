const db = require("../config/db");
const logActivity = require("../utils/activityLogger");
// Add stock to watchlist
const addWatchlist = (req, res) => {

   const user_id = req.user.id;
const { stock_id } = req.body;

    // Check if already exists
    db.query(
        "SELECT * FROM watchlist WHERE user_id=? AND stock_id=?",
        [user_id, stock_id],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (result.length > 0) {

                return res.json({
                    success: false,
                    message: "Already in Watchlist ⭐"
                });

            }

            db.query(
                "INSERT INTO watchlist(user_id,stock_id) VALUES(?,?)",
                [user_id, stock_id],
                (err) => {

                    if (err) {

                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });

                    }
                    logActivity(
    user_id,
    "⭐ Added a stock to Watchlist"
);

                    res.json({
                        success: true,
                        message: "Added to Watchlist ❤️"
                    });

                }
            );

        }
    );

};

// Get watchlist
const getWatchlist = (req, res) => {

   console.log("req.user =", req.user);

const user_id = req.user.id;

console.log("user_id =", user_id);

   const sql = `
SELECT
    watchlist.id AS watchlist_id,
    stocks.id AS stock_id,
    stocks.company_name,
    stocks.symbol,
    stocks.current_price,
    stocks.percentage_change AS change_percent

FROM watchlist

JOIN stocks
ON watchlist.stock_id = stocks.id

WHERE watchlist.user_id = ?
`;
    db.query(sql, [user_id], (err, result) => {
console.log(result);
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            watchlist: result
        });

    });

};


const removeWatchlist = (req, res) => {

  const user_id = req.user.id;
const { stock_id } = req.body;

    if (!stock_id) {
        return res.status(400).json({
            success: false,
            message: "Stock ID is required"
        });
    }

    db.query(
        "DELETE FROM watchlist WHERE user_id=? AND stock_id=?",
        [user_id, stock_id],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success:false,
                    message:err.message
                });

            }
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Stock is not in your Watchlist"
                });
            }

            logActivity(
    user_id,
    "⭐ Removed a stock from Watchlist"
);
            res.json({

                success:true,

                message:"Removed from Watchlist"

            });

        }
    );

};



module.exports = {

    addWatchlist,

    getWatchlist,

    removeWatchlist

};