const express = require("express");
const auth = require("../middleware/auth");
const {
    getLearningState,
    saveLearningState
} = require("../controllers/learningController");
const { getMarketHistory } = require("../controllers/marketHistoryController");

const router = express.Router();

router.get("/state", auth, getLearningState);
router.put("/state", auth, saveLearningState);
router.get("/market-history", getMarketHistory);

module.exports = router;
