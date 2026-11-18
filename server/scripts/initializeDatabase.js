const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const migrationsPath = path.join(__dirname, "..", "migrations");

async function initializeDatabase() {
    const connection = db.promise();
    const migrations = fs.readdirSync(migrationsPath)
        .filter((filename) => /^\d+_[\w-]+\.sql$/.test(filename))
        .sort();

    if (!migrations.length) {
        throw new Error(`No database migrations found: ${migrationsPath}`);
    }

    await connection.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            migration_name VARCHAR(190) NOT NULL PRIMARY KEY,
            applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const [appliedMigrations] = await connection.query("SELECT migration_name FROM schema_migrations");
    const appliedNames = new Set(appliedMigrations.map((migration) => migration.migration_name));

    for (const migrationName of migrations) {
        if (appliedNames.has(migrationName)) continue;

        const migrationPath = path.join(migrationsPath, migrationName);
        const schema = fs.readFileSync(migrationPath, "utf8");
        const statements = schema.split(";").map((statement) => statement.trim()).filter(Boolean);
        if (!statements.length) {
            throw new Error(`Database migration is empty: ${migrationPath}`);
        }

        for (const statement of statements) {
            await connection.query(statement);
        }
        await connection.query(
            "INSERT INTO schema_migrations (migration_name) VALUES (?)",
            [migrationName]
        );
    }

    const [stocks] = await connection.query("SELECT symbol FROM stocks");
    const stockSymbols = new Set(stocks.map((stock) => stock.symbol));
    const legacyDemoStocks = ["ALFA", "BETA", "GROW", "NOVA"];
    const needsSeedRefresh = stocks.length === 0 || legacyDemoStocks.some((symbol) => stockSymbols.has(symbol));

    if (needsSeedRefresh) {
        await connection.query(
            `DELETE FROM stocks WHERE symbol IN (?, ?, ?, ?)
             OR symbol IN ('RELIANCE', 'TCS', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'INFY', 'LTIM', 'BHARTIARTL', 'SUNPHARMA', 'TATAMOTORS', 'ITC', 'ASIANPAINT', 'AXISBANK', 'NTPC', 'POWERGRID', 'KOTAKBANK', 'ULTRACEMCO', 'INDUSINDBK', 'MARUTI', 'WIPRO')`
            , legacyDemoStocks
        );

        await connection.query(
            `INSERT INTO stocks
             (symbol, company_name, current_price, open_price, high_price, low_price, volume, market_cap, pe_ratio, previous_price, percentage_change)
             VALUES
             ('RELIANCE', 'Reliance Industries', 2980.50, 2960.00, 3010.00, 2945.00, 5200000, '₹19.4T', 24.50, 2968.40, 0.41),
             ('TCS', 'Tata Consultancy Services', 3998.80, 3980.00, 4028.00, 3964.00, 2100000, '₹14.6T', 30.75, 3985.20, 0.34),
             ('HDFCBANK', 'HDFC Bank', 1688.90, 1670.00, 1702.00, 1662.00, 4400000, '₹12.1T', 18.80, 1679.20, 0.58),
             ('ICICIBANK', 'ICICI Bank', 1286.20, 1275.00, 1302.00, 1268.00, 6900000, '₹9.3T', 18.25, 1280.00, 0.48),
             ('SBIN', 'State Bank of India', 893.40, 884.00, 901.00, 878.00, 8200000, '₹7.2T', 10.10, 888.95, 0.50),
             ('INFY', 'Infosys', 1528.60, 1512.00, 1542.00, 1501.00, 3500000, '₹8.7T', 29.10, 1519.30, 0.62),
             ('LTIM', 'LTIMindtree', 6580.00, 6500.00, 6645.00, 6475.00, 820000, '₹1.2T', 34.50, 6525.00, 0.84),
             ('BHARTIARTL', 'Bharti Airtel', 1494.25, 1478.00, 1505.00, 1465.00, 5700000, '₹10.5T', 27.80, 1481.00, 0.90),
             ('SUNPHARMA', 'Sun Pharmaceutical', 1640.75, 1628.00, 1662.00, 1615.00, 4200000, '₹4.2T', 34.40, 1635.20, 0.34),
             ('TATAMOTORS', 'Tata Motors', 1045.80, 1030.00, 1065.00, 1021.00, 9100000, '₹3.8T', 8.90, 1038.10, 0.74),
             ('ITC', 'ITC', 481.55, 476.00, 486.00, 472.00, 5100000, '₹6.6T', 28.20, 478.90, 0.55),
             ('ASIANPAINT', 'Asian Paints', 3195.70, 3168.00, 3228.00, 3149.00, 1100000, '₹3.1T', 52.80, 3178.40, 0.55),
             ('AXISBANK', 'Axis Bank', 1248.50, 1234.00, 1260.00, 1228.00, 6800000, '₹3.9T', 17.40, 1240.10, 0.68),
             ('NTPC', 'NTPC', 390.20, 385.00, 395.00, 382.00, 9300000, '₹3.7T', 13.60, 387.90, 0.59),
             ('POWERGRID', 'Power Grid', 318.85, 314.00, 321.00, 311.00, 5400000, '₹2.3T', 15.10, 316.40, 0.77),
             ('KOTAKBANK', 'Kotak Mahindra Bank', 1810.40, 1792.00, 1826.00, 1780.00, 2600000, '₹4.8T', 19.30, 1798.00, 0.69),
             ('ULTRACEMCO', 'UltraTech Cement', 11440.00, 11290.00, 11560.00, 11220.00, 760000, '₹3.8T', 33.10, 11385.00, 0.48),
             ('INDUSINDBK', 'IndusInd Bank', 1520.10, 1510.00, 1545.00, 1498.00, 3100000, '₹1.8T', 9.40, 1511.50, 0.57),
             ('MARUTI', 'Maruti Suzuki', 12460.00, 12380.00, 12540.00, 12320.00, 530000, '₹4.1T', 27.10, 12405.00, 0.44),
             ('WIPRO', 'Wipro', 558.30, 550.00, 564.00, 547.00, 2800000, '₹3.3T', 28.50, 552.20, 1.11)`
        );
    }
}

module.exports = initializeDatabase;
