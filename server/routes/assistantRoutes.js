const express = require("express");
const auth = require("../middleware/auth");
const { chatWithAssistant } = require("../controllers/assistantController");

const router = express.Router();

router.post("/chat", auth, chatWithAssistant);

module.exports = router;
