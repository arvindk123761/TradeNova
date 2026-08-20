const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

const {
    getDashboard,
    getMarketOverview,
    getTopGainers,
    getTopLosers,
    getLatestNews
} = require("../controllers/dashboardController");

router.get("/", auth, getDashboard);

router.get("/market-overview", getMarketOverview);

router.get("/top-gainers", getTopGainers);

router.get("/top-losers", getTopLosers);

router.get("/news", getLatestNews);

module.exports = router;