const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    getOrders,
      getRecentOrders
} = require("../controllers/orderController");



router.get("/",auth, getOrders);
router.get("/recent", auth, getRecentOrders);

module.exports = router;