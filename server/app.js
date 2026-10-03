const portfolioRoutes = require("./routes/portfolioRoutes");
const cors = require("cors");
const express = require("express");
const path = require("path");
const updatePrices = require("./utils/priceUpdater");

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
setInterval(updatePrices, 5000);
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

app.use("/api/ipo", ipoRoutes);

app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "TradeNova API is running" });
});

app.use(express.static(path.join(__dirname, "../clients")));

module.exports = app;