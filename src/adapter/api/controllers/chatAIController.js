const express = require("express");
const router = express.Router();

const {chatHandler,
    healthHandler
} = require("../../../application/chat/chatHttpHandler");

router.post("/chat", chatHandler);
router.get("/health", healthHandler);

module.exports = router;
