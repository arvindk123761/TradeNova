const db = require("../config/db");
const logActivity = require("../utils/activityLogger");

const catalogs = {
    mutualfunds: [
        { name: "TradeNova Balanced Growth", type: "Hybrid Fund", risk: "Moderate", minimum: 500, returnRate: "12.4%" },
        { name: "India Large Cap Index", type: "Equity Fund", risk: "High", minimum: 1000, returnRate: "15.1%" },
        { name: "Short Term Debt Plus", type: "Debt Fund", risk: "Low", minimum: 500, returnRate: "7.8%" }
    ]
};

const ensureTables = db.promise().query(`
    CREATE TABLE IF NOT EXISTS investment_holdings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category VARCHAR(30) NOT NULL,
        product_name VARCHAR(150) NOT NULL,
        amount DECIMAL(14,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(user_id)
    )
`).catch(err => console.error("Investment table setup error:", err.message));

const getInvestments = (req, res) => {
    const category = req.params.category.toLowerCase();
    const items = catalogs[category];

    if (!items) {
        return res.status(404).json({ success: false, message: "Investment category not found" });
    }

    res.json({ success: true, category, investments: items });
};

const buyInvestment = async (req, res) => {
    const { category, product_name, amount } = req.body;
    const value = Number(amount);
    const products = catalogs[category];
    const product = products && products.find(item => item.name === product_name);

    if (!product || !Number.isFinite(value) || value < product.minimum) {
        return res.status(400).json({ success: false, message: "Choose a valid product and invest at least its minimum amount" });
    }

    try {
        await ensureTables;
        const [wallet] = await db.promise().query("SELECT balance FROM wallet WHERE user_id = ?", [req.user.id]);
        if (!wallet.length || Number(wallet[0].balance) < value) {
            return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
        }

        await db.promise().query("UPDATE wallet SET balance = balance - ? WHERE user_id = ?", [value, req.user.id]);
        await db.promise().query(
            "INSERT INTO investment_holdings(user_id, category, product_name, amount) VALUES (?, ?, ?, ?)",
            [req.user.id, category, product_name, value]
        );
        await db.promise().query(
            "INSERT INTO transactions(user_id, type, amount, description) VALUES (?, 'BUY', ?, ?)",
            [req.user.id, value, `Invested ₹${value} in ${product_name}`]
        );
        logActivity(req.user.id, `Invested ₹${value} in ${product_name}`);

        res.json({ success: true, message: "Investment placed successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getHoldings = async (req, res) => {
    try {
        await ensureTables;
        const [holdings] = await db.promise().query(
            "SELECT id, category, product_name, amount, created_at FROM investment_holdings WHERE user_id = ? ORDER BY created_at DESC",
            [req.user.id]
        );
        res.json({ success: true, holdings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getInvestments, buyInvestment, getHoldings };
