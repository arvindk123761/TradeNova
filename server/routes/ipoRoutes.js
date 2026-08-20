const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    getIPOs,
    applyIPO
} = require("../controllers/ipoController");

router.get("/", getIPOs);

router.post("/apply", auth, applyIPO);

module.exports = router;