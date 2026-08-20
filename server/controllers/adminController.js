const db = require("../config/db");

// ============================
// Get All Stocks
// ============================

const getAllStocks = (req, res) => {

    db.query("SELECT * FROM stocks ORDER BY id DESC", (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            stocks: result
        });

    });

};

// ============================
// Add Stock
// ============================

const addStock = (req, res) => {

    const {
        company_name,
        symbol,
        current_price
    } = req.body;

    const sql = `
        INSERT INTO stocks(company_name, symbol, current_price)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [company_name, symbol, current_price],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Stock Added Successfully"
            });

        }
    );

};

// ============================
// Delete Stock
// ============================

const deleteStock = (req, res) => {

    const id = req.params.id;

    // Step 1: Delete orders
    db.query(
        "DELETE FROM orders WHERE stock_id=?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            // Step 2: Delete portfolio entries
            db.query(
                "DELETE FROM portfolio WHERE stock_id=?",
                [id],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    // Step 3: Delete the stock
                    db.query(
                        "DELETE FROM stocks WHERE id=?",
                        [id],
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            res.json({
                                success: true,
                                message: "Stock Deleted Successfully"
                            });

                        }
                    );

                }
            );

        }
    );

};

// ============================
// Update Price
// ============================

const updatePrice = (req, res) => {

    const id = req.params.id;

    const { current_price } = req.body;

    db.query(

        "SELECT current_price FROM stocks WHERE id=?",

        [id],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    success:false,

                    message:err.message

                });

            }
            const previous_price = result[0].current_price;
            let percentage_change = 0;

if(previous_price > 0){

percentage_change =
((current_price - previous_price) / previous_price) * 100;

percentage_change =
Number(percentage_change.toFixed(2));

}

          db.query(

    `UPDATE stocks
     SET
        previous_price = ?,
        current_price = ?,
        percentage_change = ?
     WHERE id = ?`,

    [
        previous_price,
        current_price,
        percentage_change,
        id
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
            message: "Price Updated Successfully",

            previous_price,
            current_price,
            percentage_change

        });

    }

);

        }

    );

};

module.exports = {
    getAllStocks,
    addStock,
    deleteStock,
    updatePrice
};