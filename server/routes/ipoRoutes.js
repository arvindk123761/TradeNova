const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    getIPOs,
    getApplications,
    applyIPO
} = require("../controllers/ipoController");

router.get("/", getIPOs);

router.get("/applications", auth, getApplications);

router.post("/apply", auth, applyIPO);

module.exports = router;