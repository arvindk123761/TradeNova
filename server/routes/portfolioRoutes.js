const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

const {

    getPortfolio,

    getPortfolioSummary,

    getPortfolioChart,

    getPortfolioHistory,

    sellFromPortfolio

} = require("../controllers/portfolioController");

/* ==========================================
   PORTFOLIO
========================================== */

router.get("/", getPortfolio);

router.get("/summary", getPortfolioSummary);

router.get("/chart", getPortfolioChart);

router.get("/history", getPortfolioHistory);

/* ==========================================
   SELL
========================================== */

router.post("/sell", sellFromPortfolio);

module.exports = router;