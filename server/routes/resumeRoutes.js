const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  uploadResume,
  getResumes,
  getResumeById,
  getDashboardCounts,
  downloadResume
} = require("../controllers/resumeController");

const authMiddleware = require("../middleware/authMiddleware");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);

router.get("/dashboard/stats", authMiddleware, getDashboardCounts);

router.get("/", authMiddleware, getResumes);

router.get("/:id", authMiddleware, getResumeById);

router.get("/download/:id", authMiddleware, downloadResume);

module.exports = router;