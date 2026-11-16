const express = require("express");
const auth = require("../middleware/auth");
const { getInvestments, buyInvestment, getHoldings, sellInvestment } = require("../controllers/investmentController");

const router = express.Router();
router.post("/order", auth, buyInvestment);
router.post("/sell", auth, sellInvestment);
router.get("/holdings", auth, getHoldings);
router.get("/:category", getInvestments);

module.exports = router;
