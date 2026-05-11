const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} = require("../controllers/report.controller");

router.get("/", auth, getReports);
router.get("/:id", auth, getReportById);
router.post("/", auth, createReport);
router.put("/:id", auth, updateReport);
router.delete("/:id", auth, deleteReport);

module.exports = router;
