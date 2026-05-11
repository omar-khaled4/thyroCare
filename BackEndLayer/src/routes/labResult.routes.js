const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
  getLabResults,
  addLabResult,
  updateLabResult,
  deleteLabResult,
  bulkUpdateLabResults,
} = require("../controllers/labResult.controller");

router.get("/:type", auth, getLabResults);
router.post("/:type", auth, addLabResult);
router.put("/:type", auth, updateLabResult);
router.delete("/:type", auth, deleteLabResult);
router.put("/:type/bulk", auth, bulkUpdateLabResults);

module.exports = router;
