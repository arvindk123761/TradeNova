const db = require("../config/db");

function updatePrices() {

    db.query("SELECT id, current_price FROM stocks", (err, stocks) => {

        if (err) {
            console.log(err);
            return;
        }

        stocks.forEach(stock => {

            // Random change between -5 and +5
            const change = (Math.random() * 10 - 5).toFixed(2);

            let newPrice = Number(stock.current_price) + Number(change);

            // Prevent price going below ₹1
            if (newPrice < 1) {
                newPrice = 1;
            }

            const percentageChange = Number(
                (((newPrice - Number(stock.current_price)) / Number(stock.current_price)) * 100).toFixed(2)
            );

            db.query(
                `UPDATE stocks
                 SET previous_price=?, current_price=?, percentage_change=?
                 WHERE id=?`,
                [stock.current_price, newPrice.toFixed(2), percentageChange, stock.id]
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

