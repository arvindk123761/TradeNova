const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT || 5000);
const db = require("./config/db");
const initializeDatabase = require("./scripts/initializeDatabase");

async function startServer() {
    await db.promise().query("SELECT 1");
    await initializeDatabase();

    const app = require("./app");
    const updatePrices = require("./utils/priceUpdater");

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running on port ${PORT}`);
        setInterval(updatePrices, 5000);
    });
}

startServer().catch((error) => {
    console.error("Server startup failed; database initialization could not complete.", error);
    db.end((closeError) => {
        if (closeError) {
            console.error("Database connection cleanup failed after startup error.", closeError);
        }
        process.exit(1);
    });
});