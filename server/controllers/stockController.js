const db = require("../config/db");

/* ==========================================
   GET ALL STOCKS
========================================== */

exports.getAllStocks = async (req, res) => {

    try {

        const [stocks] = await db.promise().query(`

            SELECT
                id,
                company_name,
                symbol,
                current_price,
                previous_price AS previous_close,
                percentage_change AS change_percent,
                market_cap,
                volume
            FROM stocks
            ORDER BY company_name ASC

        `);

        res.json({
            success: true,
            stocks
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to fetch stocks"
        });

    }

};

/* ==========================================
   GET STOCK DETAILS
========================================== */

exports.getStockById = async (req, res) => {

    try {

        const stockId = req.params.id;

        const [stock] = await db.promise().query(

            `SELECT * FROM stocks WHERE id=?`,

            [stockId]

        );

        if(stock.length===0){

            return res.status(404).json({

                success:false,

                message:"Stock Not Found"

            });

        }

        res.json({

            success:true,

            stock:stock[0]

        });

    } catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Server Error"

        });

    }

};

/* ==========================================
   SEARCH STOCKS
========================================== */

exports.searchStocks = async (req,res)=>{

    try{

        const keyword = req.query.q || "";

        const [stocks] = await db.promise().query(

        `SELECT
            id,
            company_name,
            symbol,
            current_price,
            percentage_change AS change_percent
        FROM stocks
        WHERE company_name LIKE ?
        OR symbol LIKE ?
        ORDER BY company_name`,

        [

            `%${keyword}%`,
            `%${keyword}%`

        ]

        );

        res.json({

            success:true,

            stocks

        });

    }catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Search Error"

        });

    }

};

/* ==========================================
   TOP GAINERS
========================================== */

exports.getTopGainers = async(req,res)=>{

    try{

        const [stocks] = await db.promise().query(

        `SELECT
            id,
            company_name,
            symbol,
            current_price,
            percentage_change AS change_percent
        FROM stocks
        ORDER BY percentage_change DESC
        LIMIT 10`

        );

        res.json({

            success:true,

            gainers:stocks

        });

    }catch(err){

        console.log(err);

        res.status(500).json({

            success:false

        });

    }

};

/* ==========================================
   TOP LOSERS
========================================== */

exports.getTopLosers = async(req,res)=>{

    try{

        const [stocks] = await db.promise().query(

        `SELECT
            id,
            company_name,
            symbol,
            current_price,
            percentage_change AS change_percent
        FROM stocks
        ORDER BY percentage_change ASC
        LIMIT 10`

        );

        res.json({

            success:true,

            losers:stocks

        });

    }catch(err){

        console.log(err);

        res.status(500).json({

            success:false

        });

    }

};

/* ==========================================
   BUY STOCK
========================================== */

exports.buyStock = async (req, res) => {

    const connection = await db.promise().getConnection();

    try {

        await connection.beginTransaction();

        // Temporary user (replace with req.user.id after JWT)
        const userId = 1;

        const {
            stock_id,
            quantity
        } = req.body;

        if (!stock_id || !quantity || quantity <= 0) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Invalid quantity or stock."
            });

        }

        /* ==========================
           STOCK DETAILS
        ========================== */

        const [stock] = await connection.query(

            `SELECT
                id,
                company_name,
                symbol,
                current_price
            FROM stocks
            WHERE id=?`,

            [stock_id]

        );

        if (stock.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Stock not found."

            });

        }

        const currentPrice = Number(stock[0].current_price);

        const totalCost = currentPrice * Number(quantity);

        /* ==========================
           WALLET
        ========================== */

        const [wallet] = await connection.query(

            `SELECT balance
             FROM wallet
             WHERE user_id=?`,

            [userId]

        );

        if (wallet.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }

        const balance = Number(wallet[0].balance);

        if (balance < totalCost) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Insufficient Wallet Balance."

            });

        }

        /* ==========================
           UPDATE WALLET
        ========================== */

        await connection.query(

            `UPDATE wallet
             SET balance=balance-?
             WHERE user_id=?`,

            [

                totalCost,
                userId

            ]

        );

        /* ==========================
           CHECK PORTFOLIO
        ========================== */

        const [holding] = await connection.query(

            `SELECT *
             FROM portfolio
             WHERE user_id=?
             AND stock_id=?`,

            [

                userId,
                stock_id

            ]

        );

        if (holding.length > 0) {

            const oldQty = Number(holding[0].quantity);

            const oldPrice = Number(holding[0].buy_price);

            const newQty = oldQty + Number(quantity);

            const avgPrice =
                ((oldQty * oldPrice) + totalCost) / newQty;

            await connection.query(

                `UPDATE portfolio
                 SET quantity=?,
                     buy_price=?
                 WHERE id=?`,

                [

                    newQty,
                    avgPrice,
                    holding[0].id

                ]

            );

        } else {

            await connection.query(

                `INSERT INTO portfolio
                (
                    user_id,
                    stock_id,
                    quantity,
                    buy_price
                )
                VALUES
                (?,?,?,?)`,

                [

                    userId,
                    stock_id,
                    quantity,
                    currentPrice

                ]

            );

        }

        /* ==========================
           CREATE ORDER
        ========================== */

        await connection.query(

            `INSERT INTO orders
            (
                user_id,
                stock_id,
                order_type,
                quantity,
                price,
                total_amount,
                status
            )
            VALUES
            (?,?,?,?,?,?,?)`,

            [

                userId,
                stock_id,
                "BUY",
                quantity,
                currentPrice,
                totalCost,
                "COMPLETED"

            ]

        );

        await connection.commit();

        res.json({

            success: true,

            message: "Stock Purchased Successfully."

        });

    } catch (err) {

        await connection.rollback();

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Buy Order Failed."

        });

    } finally {

        connection.release();

    }

};

/* ==========================================
   SELL STOCK
========================================== */

exports.sellStock = async (req, res) => {

    const connection = await db.promise().getConnection();

    try {

        await connection.beginTransaction();

        // Temporary user
        const userId = 1;

        const {
            stock_id,
            quantity
        } = req.body;

        if (!stock_id || !quantity || quantity <= 0) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Invalid Request"
            });

        }

        /* ==========================
           CHECK HOLDING
        ========================== */

        const [holding] = await connection.query(

            `SELECT *
             FROM portfolio
             WHERE user_id=?
             AND stock_id=?`,

            [
                userId,
                stock_id
            ]

        );

        if (holding.length === 0) {

            await connection.rollback();

            return res.status(404).json({

                success: false,

                message: "Stock not found in portfolio."

            });

        }

        const ownedQty = Number(holding[0].quantity);

        if (quantity > ownedQty) {

            await connection.rollback();

            return res.status(400).json({

                success: false,

                message: "Not enough shares to sell."

            });

        }

        /* ==========================
           GET CURRENT PRICE
        ========================== */

        const [stock] = await connection.query(

            `SELECT
                company_name,
                symbol,
                current_price
             FROM stocks
             WHERE id=?`,

            [stock_id]

        );

        const currentPrice = Number(stock[0].current_price);

        const totalAmount = currentPrice * Number(quantity);

        /* ==========================
           CREDIT WALLET
        ========================== */

        await connection.query(

            `UPDATE wallet
             SET balance=balance+?
             WHERE user_id=?`,

            [
                totalAmount,
                userId
            ]

        );

        /* ==========================
           UPDATE PORTFOLIO
        ========================== */

        const remainingQty = ownedQty - Number(quantity);

        if (remainingQty === 0) {

            await connection.query(

                `DELETE FROM portfolio
                 WHERE id=?`,

                [holding[0].id]

            );

        } else {

            await connection.query(

                `UPDATE portfolio
                 SET quantity=?
                 WHERE id=?`,

                [
                    remainingQty,
                    holding[0].id
                ]

            );

        }

        /* ==========================
           CREATE ORDER
        ========================== */

        await connection.query(

            `INSERT INTO orders
            (
                user_id,
                stock_id,
                order_type,
                quantity,
                price,
                total_amount,
                status
            )
            VALUES
            (?,?,?,?,?,?,?)`,

            [
                userId,
                stock_id,
                "SELL",
                quantity,
                currentPrice,
                totalAmount,
                "COMPLETED"
            ]

        );

        await connection.commit();

        res.json({

            success: true,

            message: "Stock Sold Successfully.",

            data: {

                company_name: stock[0].company_name,
                symbol: stock[0].symbol,
                sold_quantity: quantity,
                sell_price: currentPrice,
                total_amount: totalAmount,
                remaining_quantity: remainingQty

            }

        });

    } catch (err) {

        await connection.rollback();

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Sell Order Failed."

        });

    } finally {

        connection.release();

    }

};