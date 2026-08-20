const express = require("express");

const router = express.Router();

const {
    getAllStocks,
    getStockById,
    searchStocks,
    getTopGainers,
    getTopLosers
} = require("../controllers/stockController");

/* ==========================================
   STOCKS
========================================== */

router.get("/", getAllStocks);

router.get("/search", searchStocks);

router.get("/top-gainers", getTopGainers);

router.get("/top-losers", getTopLosers);

router.get("/:id", getStockById);

/* ==========================================
   BUY / SELL
========================================== */

module.exports = router;