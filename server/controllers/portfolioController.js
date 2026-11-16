const db = require("../config/db");

const getPortfolioSummary = (req, res) => {

    const user_id = req.user.id;
    const sql = `
        SELECT
            COALESCE(SUM(portfolio.quantity * portfolio.buy_price), 0) AS investment,
            COALESCE(SUM(portfolio.quantity * stocks.current_price), 0) AS currentValue,
            COALESCE(SUM(portfolio.quantity), 0) AS holdings
        FROM portfolio
        JOIN stocks ON portfolio.stock_id = stocks.id
        WHERE portfolio.user_id = ?
    `;

    db.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        const summary = result[0];
        res.json({
            success: true,
            investment: Number(summary.investment),
            currentValue: Number(summary.currentValue),
            profit: Number(summary.currentValue) - Number(summary.investment),
            holdings: Number(summary.holdings)
        });
    });
};

const getPortfolioChart = (req, res) => {
    getPortfolio(req, res);
};

const getPortfolioHistory = (req, res) => {

    const user_id = req.user.id;
    const rangeDays = {
        day: 1,
        week: 7,
        month: 30,
        year: 365
    };
    const range = req.query.range || "day";
    const days = rangeDays[range];

    if (!days) {
        return res.status(400).json({
            success: false,
            message: "Choose a valid history range: day, week, month, or year."
        });
    }

    db.query(
        `SELECT portfolio_value, created_at
         FROM portfolio_history
         WHERE user_id = ?
           AND created_at >= DATE_SUB(NOW(), INTERVAL ${days} DAY)
         ORDER BY created_at ASC`,
        [user_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            res.json({ success: true, range, history: result });
        }
    );
};

const getPortfolio = (req, res) => {

   const user_id = req.user.id;
const sql = `
    SELECT
    portfolio.id,
     portfolio.stock_id,
    stocks.company_name,
    stocks.symbol,
    portfolio.quantity,
    portfolio.buy_price,
    stocks.current_price,

    (portfolio.quantity * portfolio.buy_price) AS investment,

    (portfolio.quantity * stocks.current_price) AS current_value,

    ((stocks.current_price - portfolio.buy_price) * portfolio.quantity) AS profit

FROM portfolio

JOIN stocks
ON portfolio.stock_id = stocks.id

WHERE portfolio.user_id = ?
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
            portfolio:result
        });

    });

};

module.exports = {
    getPortfolio,
    getPortfolioSummary,
    getPortfolioChart,
    getPortfolioHistory,
    sellFromPortfolio: require("./tradeController").sellStock
};