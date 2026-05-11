const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { chat } = require("../controllers/chat.controller");

router.post("/", auth, chat);

module.exports = router;
