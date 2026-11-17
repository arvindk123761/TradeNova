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

    const [stocks] = await connection.query("SELECT COUNT(*) AS count FROM stocks");
    if (Number(stocks[0].count) === 0) {
        await connection.query(
            `INSERT INTO stocks
             (symbol, company_name, current_price, open_price, high_price, low_price, volume, market_cap, pe_ratio, previous_price, percentage_change)
             VALUES
             ('ALFA', 'Alpha Learning Co. (Demo)', 250.00, 248.00, 255.00, 245.00, 1200000, 'Demo', 18.00, 248.00, 0.81),
             ('BETA', 'Beta Industries (Demo)', 480.00, 475.00, 490.00, 468.00, 850000, 'Demo', 22.00, 475.00, 1.05),
             ('GROW', 'Growth Works (Demo)', 125.00, 124.00, 129.00, 122.00, 2100000, 'Demo', 24.00, 124.00, 0.81),
             ('NOVA', 'Nova Ventures (Demo)', 760.00, 755.00, 772.00, 748.00, 640000, 'Demo', 21.00, 755.00, 0.66)`
        );
    }
}

module.exports = initializeDatabase;
