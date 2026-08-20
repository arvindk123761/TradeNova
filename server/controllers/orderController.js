const db = require("../config/db");

const getOrders = (req, res) => {

   const user_id = req.user.id;

    const sql = `
       SELECT
    orders.id,
    stocks.company_name,
    stocks.symbol,
    orders.order_type,
    orders.quantity,
    orders.price,
    'COMPLETED' AS status,

    (orders.quantity * orders.price) AS total,

    orders.created_at

FROM orders

JOIN stocks
ON orders.stock_id = stocks.id

WHERE orders.user_id = ?

ORDER BY orders.created_at DESC
    `;

    db.query(sql, [user_id], (err, result) => {

        if(err){

            return res.status(500).json({
                success:false,
                message:err.message
            });

        }

        res.json({
            success:true,
            orders:result
        });

    });

};
const getRecentOrders = (req, res) => {

    const user_id = req.user.id;

    const sql = `
        SELECT
            stocks.company_name,
            orders.order_type,
            orders.quantity,
            orders.price

        FROM orders

        JOIN stocks
        ON stocks.id = orders.stock_id

        WHERE orders.user_id = ?

        ORDER BY orders.created_at DESC

        LIMIT 5
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.json({

            success: true,

            orders: result

        });

    });

};

module.exports = {

    getOrders,

    getRecentOrders

};