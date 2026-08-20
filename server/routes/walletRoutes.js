const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const walletController = require("../controllers/walletController");

router.get("/", auth, walletController.getBalance);
router.post("/add", auth, walletController.addMoney);

module.exports = router;