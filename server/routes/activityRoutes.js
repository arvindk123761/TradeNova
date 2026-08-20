const express = require("express");
const auth = require("../middleware/auth");
const { getActivities } = require("../controllers/activityController");

const router = express.Router();
router.get("/", auth, getActivities);

module.exports = router;
