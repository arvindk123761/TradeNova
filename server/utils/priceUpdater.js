const db = require("../config/db");
const PORTFOLIO_HISTORY_INTERVAL_MS = 5 * 60 * 1000;
let lastPortfolioHistoryAt = Date.now();

function updatePrices() {
    const now = Date.now();
    if (now - lastPortfolioHistoryAt >= PORTFOLIO_HISTORY_INTERVAL_MS) {
        lastPortfolioHistoryAt = now;
        savePortfolioHistory();
    }

    db.query("SELECT id, current_price FROM stocks", (err, stocks) => {

        if (err) {
            console.log(err);
            return;
        }

        stocks.forEach(stock => {

            const previousPrice = Number(stock.current_price || 0);
            const change = (Math.random() * 10 - 5).toFixed(2);
            let newPrice = previousPrice + Number(change);

            if (newPrice < 1) {
                newPrice = 1;
            }

            const percentageChange = previousPrice > 0
                ? Number((((newPrice - previousPrice) / previousPrice) * 100).toFixed(2))
                : 0;

            db.query(
                `UPDATE stocks
                 SET previous_price=?, current_price=?, percentage_change=?
                 WHERE id=?`,
                [previousPrice.toFixed(2), newPrice.toFixed(2), percentageChange, stock.id]
            );

        });

    });

}

savePortfolioHistory();




function savePortfolioHistory() {

    const sql = `
        INSERT INTO portfolio_history (user_id, portfolio_value)

        SELECT
            portfolio.user_id,
            SUM(portfolio.quantity * stocks.current_price)

        FROM portfolio

        JOIN stocks
        ON portfolio.stock_id = stocks.id

        GROUP BY portfolio.user_id
    `;

    db.query(sql, (err) => {

        if (err) {

            console.log("Portfolio History Error:", err);

        }

    });

}


module.exports = updatePrices;
