const portfolioRoutes = require("./routes/portfolioRoutes");
const cors = require("cors");
const express = require("express");
const path = require("path");

const db = require("./config/db");
const walletRoutes = require("./routes/walletRoutes");
const authRoutes = require("./routes/authRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const stockRoutes = require("./routes/stockRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes=require("./routes/dashboardRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const app = express();
const profileRoutes = require("./routes/profileRoutes");
const ipoRoutes = require("./routes/ipoRoutes");
const activityRoutes = require("./routes/activityRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const learningRoutes = require("./routes/learningRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
app.use(cors());
app.use(express.json());



app.use("/api/auth", authRoutes);

app.use("/api/trade", tradeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/wallet",walletRoutes);
app.use("/api/stocks", stockRoutes);
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/assistant", assistantRoutes);

app.use("/api/ipo", ipoRoutes);

app.get("/api/health", async (req, res) => {
    try {
        await db.promise().query("SELECT 1");
        res.json({ success: true, message: "TradeNova API is running" });
    } catch (error) {
        console.error("Health check database query failed", error);
        res.status(503).json({ success: false, message: "Database is unavailable" });
    }
});

// Serve the frontend from the repository and prevent stale deployed assets.
app.use(express.static(path.join(__dirname, "../clients"), {
    setHeaders: (res) => res.setHeader("Cache-Control", "no-store")
}));

module.exports = app;