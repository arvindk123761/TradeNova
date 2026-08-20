
const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    addWatchlist,
    getWatchlist,
     removeWatchlist
} = require("../controllers/watchlistController");

router.post("/", auth, addWatchlist);

router.get("/", auth, getWatchlist);

router.delete("/", auth, removeWatchlist);

module.exports = router;