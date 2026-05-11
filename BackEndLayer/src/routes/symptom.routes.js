const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
  getSymptoms,
  addSymptom,
  updateSymptom,
  deleteSymptom,
  bulkUpdateSymptoms,
} = require("../controllers/symptom.controller");

router.get("/", auth, getSymptoms);
router.post("/", auth, addSymptom);
router.put("/", auth, updateSymptom);
router.delete("/", auth, deleteSymptom);
router.put("/bulk", auth, bulkUpdateSymptoms);

module.exports = router;
