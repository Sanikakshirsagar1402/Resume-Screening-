const express = require("express");
const router = express.Router();
const { createJob, getJobs, matchCandidates } = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// CREATE JOB
router.post("/create", authMiddleware, roleMiddleware(["recruiter"]), createJob);

// GET ALL JOBS
router.get("/", getJobs);

// MATCH ROUTE
router.post("/match", authMiddleware, roleMiddleware(["recruiter", "candidate"]), matchCandidates);

module.exports = router;
