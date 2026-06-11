const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
    sendMessage,
    getConversations,
    getConversation,
    deleteConversation,
} = require("../controllers/chat.controller");

router.post("/", auth, sendMessage);
router.get("/conversations", auth, getConversations);
router.get("/conversations/:id", auth, getConversation);
router.delete("/conversations/:id", auth, deleteConversation);

module.exports = router;