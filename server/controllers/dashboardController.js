const db = require("../config/db");

/* ==========================================
   DASHBOARD SUMMARY
========================================== */

exports.getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        // Wallet
        const [wallet] = await db.promise().query(
            "SELECT balance FROM wallet WHERE user_id=?",
            [userId]
        );

        // Portfolio
        const [portfolio] = await db.promise().query(
            `SELECT
                p.stock_id,
                p.quantity,
                p.buy_price,
                s.current_price
            FROM portfolio p
            JOIN stocks s
            ON p.stock_id=s.id
            WHERE p.user_id=?`,
            [userId]
        );

        let investment = 0;
        let currentValue = 0;

        portfolio.forEach(stock => {

            investment += stock.quantity * stock.buy_price;

            currentValue += stock.quantity * stock.current_price;

        });

        const profit = currentValue - investment;

        res.json({

            success: true,

            summary: {

                wallet:

                    wallet.length
                        ? wallet[0].balance
                        : 0,

                investment,

                currentValue,

                profit,

                holdings: new Set(portfolio.map(stock => stock.stock_id)).size

            }

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Dashboard Error"

        });

    }

};

/* ==========================================
   MARKET OVERVIEW
========================================== */

exports.getMarketOverview = async (req, res) => {

    try {

        const [stocks] = await db.promise().query(

            `SELECT
                COUNT(*) AS totalStocks,
                AVG(current_price) AS averagePrice,
                MAX(current_price) AS highestPrice,
                MIN(current_price) AS lowestPrice
            FROM stocks`

        );

        res.json({

            success: true,

            overview: stocks[0]

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Market Overview Error"

        });

    }

};

/* ==========================================
   TOP GAINERS
========================================== */

exports.getTopGainers = async (req, res) => {

    try {

        const [stocks] = await db.promise().query(

            `SELECT
                id,
                symbol,
                company_name,
                current_price,
                percentage_change AS change_percent
            FROM stocks
            ORDER BY percentage_change DESC
            LIMIT 5`

        );

        res.json({

            success: true,

            gainers: stocks

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Top Gainers Error"

        });

    }

};

/* ==========================================
   TOP LOSERS
========================================== */

exports.getTopLosers = async (req, res) => {

    try {

        const [stocks] = await db.promise().query(

            `SELECT
                id,
                symbol,
                company_name,
                current_price,
                percentage_change AS change_percent
            FROM stocks
            ORDER BY percentage_change ASC
            LIMIT 5`

        );

        res.json({

            success: true,

            losers: stocks

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Top Losers Error"

        });

    }

};

/* ==========================================
   MARKET NEWS
========================================== */

exports.getLatestNews = async (req, res) => {

    try {

        // Dummy data for now.
        // Later we can connect NewsAPI.

        res.json({

            success: true,

            news: [

                {
                    title:
                        "Nifty closes higher on strong banking stocks.",
                    source:
                        "TradeNova News"
                },

                {
                    title:
                        "Reliance Industries announces expansion plans.",
                    source:
                        "TradeNova News"
                },

                {
                    title:
                        "TCS reports strong quarterly earnings.",
                    source:
                        "TradeNova News"
                },

                {
                    title:
                        "FIIs continue buying Indian equities.",
                    source:
                        "TradeNova News"
                }

            ]

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "News Error"

        });

    }

};