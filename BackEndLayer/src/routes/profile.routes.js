const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profile.controller");

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);
router.delete("/", auth, deleteProfile);

module.exports = router;
