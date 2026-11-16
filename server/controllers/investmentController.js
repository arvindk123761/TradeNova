const db = require("../config/db");
const logActivity = require("../utils/activityLogger");

const mutualFundCatalog = [
    { name: "TradeNova Balanced Growth", type: "Hybrid Fund", risk: "Moderate", minimum: 500, navBase: 25, annualGrowth: 0.085 },
    { name: "India Large Cap Index", type: "Equity Fund", risk: "High", minimum: 1000, navBase: 100, annualGrowth: 0.11 },
    { name: "Short Term Debt Plus", type: "Debt Fund", risk: "Low", minimum: 500, navBase: 10, annualGrowth: 0.055 }
];

const catalogByCategory = { mutualfunds: mutualFundCatalog };
const navReferenceDate = Date.UTC(2026, 0, 1);
let ensureTablesPromise;
let transactionQueue = Promise.resolve();

const ensureTables = () => {
    if (!ensureTablesPromise) {
        ensureTablesPromise = db.promise().query(`
            CREATE TABLE IF NOT EXISTS investment_holdings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                category VARCHAR(30) NOT NULL,
                product_name VARCHAR(150) NOT NULL,
                amount DECIMAL(14,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX(user_id)
            )
        `).then(() => db.promise().query(`
            CREATE TABLE IF NOT EXISTS mutual_fund_positions (
                holding_id INT PRIMARY KEY,
                user_id INT NOT NULL,
                units_remaining DECIMAL(18,6) NOT NULL,
                invested_amount DECIMAL(14,2) NOT NULL,
                purchase_nav DECIMAL(14,4) NOT NULL,
                INDEX(user_id)
            )
        `)).catch((error) => {
            ensureTablesPromise = null;
            throw error;
        });
    }

    return ensureTablesPromise;
};

const withTransaction = async (callback) => {
    let release;
    const previousTransaction = transactionQueue;
    transactionQueue = new Promise((resolve) => { release = resolve; });
    await previousTransaction;

    const connection = db.promise();
    let started = false;
    try {
        await connection.beginTransaction();
        started = true;
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        if (started) await connection.rollback();
        throw error;
    } finally {
        release();
    }
};

const asDate = (value) => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    const text = String(value || "");
    const mysqlTimestamp = text.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/);
    const date = new Date(mysqlTimestamp ? `${mysqlTimestamp[1]}T${mysqlTimestamp[2]}Z` : text);
    return Number.isNaN(date.getTime()) ? new Date() : date;
};

const navAt = (product, date, includeIntraday = true) => {
    const timestamp = date.getTime();
    const days = (timestamp - navReferenceDate) / 86400000;
    const dailyTrend = Math.exp(product.annualGrowth * days / 365);
    const seasonalMovement = 1 + 0.012 * Math.sin(days / 9) + 0.006 * Math.sin(days / 3.2);
    const minute = timestamp / 60000;
    const intradayMovement = includeIntraday
        ? 1 + 0.0014 * Math.sin(minute / 4) + 0.0007 * Math.sin(minute / 1.15)
        : 1;
    return Number((product.navBase * dailyTrend * seasonalMovement * intradayMovement).toFixed(4));
};

const getProduct = (name) => mutualFundCatalog.find((product) => product.name === name);

const getInvestments = (req, res) => {
    const category = String(req.params.category || "").toLowerCase();
    const products = catalogByCategory[category];

    if (!products) {
        return res.status(404).json({ success: false, message: "Investment category not found" });
    }

    const now = new Date();
    const previousDay = new Date(now.getTime() - 86400000);
    const investments = products.map((product) => {
        const nav = navAt(product, now);
        const previousNav = navAt(product, previousDay);
        return {
            name: product.name,
            type: product.type,
            risk: product.risk,
            minimum: product.minimum,
            nav,
            dailyChange: Number(((nav - previousNav) / previousNav * 100).toFixed(2)),
            simulation: true
        };
    });

    res.json({
        success: true,
        category,
        simulation: true,
        message: "Simulated NAVs for demonstration only; not live market data.",
        investments
    });
};

const buyInvestment = async (req, res) => {
    const category = String(req.body.category || "").toLowerCase();
    const productName = String(req.body.product_name || "");
    const amount = Number(Number(req.body.amount).toFixed(2));
    const product = getProduct(productName);

    if (category !== "mutualfunds" || !product || !Number.isFinite(amount) || amount < product.minimum) {
        return res.status(400).json({
            success: false,
            message: "Choose a valid Mutual Fund and invest at least its minimum amount"
        });
    }

    if (amount > 1000000000) {
        return res.status(400).json({ success: false, message: "Investment amount is too large" });
    }

    try {
        await ensureTables();
        const now = new Date();
        const nav = navAt(product, now);
        const units = Number((amount / nav).toFixed(6));

        await withTransaction(async (connection) => {
            const [wallet] = await connection.query(
                "SELECT balance FROM wallet WHERE user_id = ? FOR UPDATE",
                [req.user.id]
            );
            if (!wallet.length || Number(wallet[0].balance) < amount) {
                const error = new Error("Insufficient wallet balance");
                error.statusCode = 400;
                throw error;
            }

            await connection.query("UPDATE wallet SET balance = balance - ? WHERE user_id = ?", [amount, req.user.id]);
            const [holding] = await connection.query(
                "INSERT INTO investment_holdings(user_id, category, product_name, amount) VALUES (?, ?, ?, ?)",
                [req.user.id, category, productName, amount]
            );
            await connection.query(
                `INSERT INTO mutual_fund_positions
                 (holding_id, user_id, units_remaining, invested_amount, purchase_nav)
                 VALUES (?, ?, ?, ?, ?)`,
                [holding.insertId, req.user.id, units, amount, nav]
            );
            await connection.query(
                "INSERT INTO transactions(user_id, type, amount, description) VALUES (?, 'BUY', ?, ?)",
                [req.user.id, amount, `Invested ₹${amount} in ${productName}`]
            );
        });

        logActivity(req.user.id, `Invested ₹${amount} in ${productName}`);
        res.json({
            success: true,
            message: "Mutual Fund purchase successful",
            holding: { product_name: productName, amount, units, nav }
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
};

const createPositionForLegacyHolding = async (holding, connection = db.promise()) => {
    const product = getProduct(holding.product_name);
    if (!product) return;

    const amount = Number(holding.amount);
    const purchaseNav = navAt(product, asDate(holding.created_at), false);
    const units = Number((amount / purchaseNav).toFixed(6));
    await connection.query(
        `INSERT IGNORE INTO mutual_fund_positions
         (holding_id, user_id, units_remaining, invested_amount, purchase_nav)
         VALUES (?, ?, ?, ?, ?)`,
        [holding.id, holding.user_id, units, amount, purchaseNav]
    );
};

const getHoldings = async (req, res) => {
    try {
        await ensureTables();
        const rows = await withTransaction(async (connection) => {
            const [legacyHoldings] = await connection.query(
                `SELECT id, user_id, product_name, amount, created_at
                 FROM investment_holdings
                 WHERE user_id = ? AND category = 'mutualfunds'`,
                [req.user.id]
            );

            for (const holding of legacyHoldings) {
                await createPositionForLegacyHolding(holding, connection);
            }

            const [result] = await connection.query(
                `SELECT holdings.id, holdings.category, holdings.product_name, holdings.amount, holdings.created_at,
                        positions.units_remaining, positions.invested_amount, positions.purchase_nav
                 FROM investment_holdings AS holdings
                 INNER JOIN mutual_fund_positions AS positions ON positions.holding_id = holdings.id
                 WHERE holdings.user_id = ? AND holdings.category = 'mutualfunds'
                 ORDER BY holdings.created_at DESC, holdings.id DESC`,
                [req.user.id]
            );
            return result;
        });

        const holdings = rows.map((row) => {
            const product = getProduct(row.product_name);
            if (!product) return null;

            const units = Number(row.units_remaining);
            const currentNav = navAt(product, new Date());
            const currentValue = Number((units * currentNav).toFixed(2));
            const investedAmount = Number(row.invested_amount);

            return {
                ...row,
                units,
                amount: investedAmount,
                current_nav: currentNav,
                current_value: currentValue,
                profit_loss: Number((currentValue - investedAmount).toFixed(2)),
                return_percent: investedAmount > 0
                    ? Number(((currentValue - investedAmount) / investedAmount * 100).toFixed(2))
                    : 0
            };
        }).filter(Boolean);

        res.json({ success: true, holdings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const sellInvestment = async (req, res) => {
    const holdingId = Number(req.body.holding_id);
    const unitsToSell = Number(Number(req.body.units).toFixed(6));
    if (!Number.isInteger(holdingId) || holdingId < 1 || !Number.isFinite(unitsToSell) || unitsToSell <= 0) {
        return res.status(400).json({ success: false, message: "Choose a holding and enter a valid number of units" });
    }

    try {
        await ensureTables();
        const result = await withTransaction(async (connection) => {
            const [holdings] = await connection.query(
                `SELECT id, user_id, product_name, amount, created_at
                 FROM investment_holdings
                 WHERE id = ? AND user_id = ? AND category = 'mutualfunds'
                 FOR UPDATE`,
                [holdingId, req.user.id]
            );
            if (!holdings.length) {
                const error = new Error("Mutual Fund holding not found");
                error.statusCode = 404;
                throw error;
            }

            const holding = holdings[0];
            const product = getProduct(holding.product_name);
            if (!product) {
                const error = new Error("Mutual Fund is no longer available for trading");
                error.statusCode = 400;
                throw error;
            }

            await createPositionForLegacyHolding(holding);
            const [positions] = await connection.query(
                "SELECT units_remaining, invested_amount FROM mutual_fund_positions WHERE holding_id = ? AND user_id = ? FOR UPDATE",
                [holdingId, req.user.id]
            );
            if (!positions.length) throw new Error("Unable to load the Mutual Fund position");

            const position = positions[0];
            const availableUnits = Number(position.units_remaining);
            if (unitsToSell > availableUnits + 0.000001) {
                const error = new Error(`You can sell up to ${availableUnits.toFixed(6)} units`);
                error.statusCode = 400;
                throw error;
            }

            const soldUnits = Math.min(unitsToSell, availableUnits);
            const remainingUnits = Number(Math.max(0, availableUnits - soldUnits).toFixed(6));
            const remainingInvested = remainingUnits === 0
                ? 0
                : Number((Number(position.invested_amount) * remainingUnits / availableUnits).toFixed(2));
            const nav = navAt(product, new Date());
            const proceeds = Number((soldUnits * nav).toFixed(2));
            if (remainingUnits === 0) {
                await connection.query(
                    "UPDATE mutual_fund_positions SET units_remaining = 0, invested_amount = 0 WHERE holding_id = ? AND user_id = ?",
                    [holdingId, req.user.id]
                );
            } else {
                await connection.query(
                    "UPDATE mutual_fund_positions SET units_remaining = ?, invested_amount = ? WHERE holding_id = ? AND user_id = ?",
                    [remainingUnits, remainingInvested, holdingId, req.user.id]
                );
            }
            const [walletUpdate] = await connection.query(
                "UPDATE wallet SET balance = balance + ? WHERE user_id = ?",
                [proceeds, req.user.id]
            );
            if (!walletUpdate.affectedRows) throw new Error("Unable to credit sale proceeds to your wallet");

            await connection.query(
                "INSERT INTO transactions(user_id, type, amount, description) VALUES (?, 'SELL', ?, ?)",
                [req.user.id, proceeds, `Sold ${soldUnits.toFixed(6)} units of ${product.name}`]
            );

            return { productName: product.name, soldUnits, nav, proceeds, remainingUnits };
        });

        logActivity(req.user.id, `Sold ${result.soldUnits.toFixed(6)} units of ${result.productName} for ₹${result.proceeds}`);
        res.json({
            success: true,
            message: "Mutual Fund units sold successfully",
            sale: {
                product_name: result.productName,
                units: result.soldUnits,
                nav: result.nav,
                proceeds: result.proceeds,
                remaining_units: result.remainingUnits
            }
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
};

module.exports = { getInvestments, buyInvestment, getHoldings, sellInvestment };
