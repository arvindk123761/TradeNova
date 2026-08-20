const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

const adminController = require("../controllers/adminController");

router.use(auth);

router.get("/", adminController.getAllStocks);

router.post("/add", adminController.addStock);

router.delete("/delete/:id", adminController.deleteStock);

router.put("/update/:id", adminController.updatePrice);

module.exports = router;