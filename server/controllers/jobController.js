const path = require("path");
const Job = require("../models/job");
const Resume = require("../models/resume");
const { spawn } = require("child_process");

// CREATE JOB DESCRIPTION
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: "All job fields are required" });
    }

    const job = new Job({
      title,
      company,
      location,
      description,
      recruiterId: req.user.id
    });

    await job.save();

    res.status(201).json({
      message: "Job description saved",
      job
    });

  } catch (error) {
    console.error("JOB CREATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL JOBS
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    console.error("GET JOBS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// AI MATCH CANDIDATES
exports.matchCandidates = async (req, res) => {
  try {

    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description required"
      });
    }

    // Fetch resumes from DB and populate user info
    // Limit to 100 most recent resumes for performance
    const resumes = await Resume.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    if (!resumes.length) {
      return res.status(404).json({
        message: "No resumes found"
      });
    }

    // Format resume data for Python
    const resumeData = resumes.map(r => ({
      id: r._id,
      name: r.candidateName || r.userId?.name || r.originalname || "Candidate",
      text: r.resumeText,
      category: r.category,
      skills: r.skills || [],
      experienceYears: r.experienceYears || 0,
      path: r.path ? r.path.replace(/\\/g, "/") : "",
      email: r.email || "N/A"
    }));


    // Run Python matcher
    const pythonPath = process.env.PYTHON_PATH || "python3";
    const scriptPath = path.join(__dirname, "../ml/matcher_fast.py");
    const pythonProcess = spawn(pythonPath, [scriptPath]);

    let result = "";
    let errorOutput = "";
    let responseSent = false;

    pythonProcess.on("error", (err) => {
      console.error("FAILED TO START PYTHON PROCESS:", err);
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ message: "AI engine failed to start", error: err.message });
      }
    });

    // Write input data to Python's stdin
    try {
      pythonProcess.stdin.write(JSON.stringify({
        jobDescription,
        resumes: resumeData
      }));
      pythonProcess.stdin.end();
    } catch (writeErr) {
      console.error("STDIN WRITE ERROR:", writeErr);
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ message: "Failed to send data to AI engine" });
      }
    }

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error("PYTHON ERROR:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (responseSent) return;
      responseSent = true;

      if (code !== 0) {
        console.error(`PYTHON PROCESS EXITED WITH CODE ${code}. ERROR: ${errorOutput}`);
        return res.status(500).json({
          message: "AI processing failed",
          error: errorOutput
        });
      }

      try {
        if (!result.trim()) {
          if (!res.headersSent) return res.json({ candidates: [] });
          return;
        }
        const parsed = JSON.parse(result);
        
        // Filter out candidates with very low match scores (e.g. < 10%)
        const filteredCandidates = parsed.filter(c => c.score >= 10);

        if (!res.headersSent) {
          res.json({
            candidates: filteredCandidates
          });
        }
      } catch (error) {
        console.error("JSON PARSE ERROR:", error);
        console.error("RAW RESULT:", result);
        if (!res.headersSent) {
          res.status(500).json({
            message: "Failed to parse AI results"
          });
        }
      }
    });

  } catch (error) {
    console.error("MATCH ERROR:", error);
    res.status(500).json({
      message: "Matching failed"
    });
  }
};
