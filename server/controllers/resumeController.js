const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { spawn } = require("child_process");
const path = require("path");
const Resume = require("../models/resume");
const User = require("../models/user");


// ================= UPLOAD RESUME =================
exports.uploadResume = async (req, res) => {
  console.log("UPLOAD START: File received:", req.file ? req.file.originalname : "NONE");
  console.log("File Mimetype:", req.file ? req.file.mimetype : "N/A");
  
  try {
    if (!req.file) {
      console.error("UPLOAD ERROR: No file in request");
      return res.status(400).json({ message: "No resume uploaded. Please select a file." });
    }

    const filePath = req.file.path.replace(/\\/g, "/");
    let resumeText = "";
    const fileBuffer = fs.readFileSync(req.file.path);

    // 1. EXTRACT TEXT
    if (req.file.mimetype === "application/pdf") {
      try {
        const data = await pdfParse(fileBuffer);
        resumeText = data.text;
      } catch (err) {
        console.error("PDF PARSE ERROR:", err);
        return res.status(400).json({ message: `Failed to parse PDF file: ${err.message}` });
      }
    } else if (
      req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      req.file.mimetype === "application/msword"
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        resumeText = result.value;
      } catch (err) {
        console.error("DOCX/DOC PARSE ERROR:", err);
        return res.status(400).json({ message: `Failed to parse Word file: ${err.message}` });
      }
    } else {
      console.error("UPLOAD ERROR: Unsupported mimetype:", req.file.mimetype);
      return res.status(400).json({ message: `Unsupported file type (${req.file.mimetype}). Please upload PDF or DOCX.` });
    }

    if (!resumeText || resumeText.trim() === "") {
      console.error("UPLOAD ERROR: Extracted text is empty");
      return res.status(400).json({ message: "Resume appears to be empty or unreadable (no text could be extracted)" });
    }

    // 2. CHECK FOR DUPLICATE CONTENT
    const lastResume = await Resume.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    if (lastResume && lastResume.resumeText === resumeText) {
      console.log("DUPLICATE DETECTED: Resume is identical to the previous one.");
      return res.status(200).json({
        message: "Resume verified! No changes detected from your previous upload.",
        resumeId: lastResume._id,
        analysis: {
          category: lastResume.category,
          skills: lastResume.skills,
          experience_years: lastResume.experienceYears,
          projects: lastResume.projects,
          education: lastResume.education,
          resume_score: lastResume.resumeScore,
          ats_feedback: lastResume.atsFeedback
        },
        verified: true
      });
    }

    console.log("TEXT EXTRACTED: Length =", resumeText.length);

    // 3. AI ANALYSIS
    const pythonPath = process.env.PYTHON_PATH || "python3";
    const scriptPath = path.join(__dirname, "../ml/resumeanalyzer.py");
    const pythonProcess = spawn(pythonPath, [scriptPath]);

    let result = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => { result += data.toString(); });
    pythonProcess.stderr.on("data", (data) => { errorOutput += data.toString(); });

    pythonProcess.on("error", (err) => {
      console.error("PYTHON SPAWN ERROR:", err);
      // We don't return here, we handle it in 'close'
    });

    pythonProcess.on("close", async (code) => {
      console.log("PYTHON CLOSED: Code =", code);
      
      let analysis = {
        category: "General",
        skills: [],
        experience_years: 0,
        projects: 0,
        education: "Not specified",
        resume_score: 0
      };

      if (code === 0) {
        try {
          const parsed = JSON.parse(result);
          analysis = { ...analysis, ...parsed };
          console.log("AI ANALYSIS SUCCESSFUL");
        } catch (parseErr) {
          console.error("FAILED TO PARSE AI RESULT:", result);
        }
      } else {
        console.error("AI ANALYSIS FAILED. ERROR:", errorOutput);
        // We continue with default analysis values instead of failing the whole request
      }

      // 3. SAVE TO DATABASE
      try {
        // Update user profile if info is missing or different
        const user = await User.findById(req.user.id);
        let userUpdated = false;

        if (user) {
          if (analysis.phone && (!user.phone || user.phone === "")) {
            user.phone = analysis.phone;
            userUpdated = true;
          }
          if (analysis.candidate_name && (!user.name || user.name === "")) {
            user.name = analysis.candidate_name;
            userUpdated = true;
          }
          if (userUpdated) {
            await user.save();
            console.log("USER PROFILE UPDATED WITH RESUME INFO");
          }
        }

        const resume = await Resume.create({
          filename: req.file.filename,
          originalname: req.file.originalname,
          path: filePath,
          mimetype: req.file.mimetype,
          size: req.file.size,
          userId: req.user.id,
          resumeText,
          category: analysis.category,
          candidateName: analysis.candidate_name || user?.name || "",
          email: analysis.email || "",
          phone: analysis.phone || "",
          skills: analysis.skills,
          experienceYears: analysis.experience_years,
          projects: analysis.projects,
          education: analysis.education,
          resumeScore: analysis.resume_score,
          atsFeedback: analysis.ats_feedback || []
        });

        console.log("RESUME SAVED TO DB:", resume._id);

        if (!res.headersSent) {
          res.status(201).json({
            message: "Resume uploaded and processed successfully",
            resumeId: resume._id,
            analysis,
            profileUpdated: userUpdated
          });
        }
      } catch (dbError) {
        console.error("DATABASE SAVE ERROR:", dbError);
        if (!res.headersSent) {
          res.status(500).json({ message: "Failed to save resume data", error: dbError.message });
        }
      }
    });

    // Send text to Python
    try {
      pythonProcess.stdin.write(resumeText);
      pythonProcess.stdin.end();
    } catch (stdinError) {
      console.error("STDIN WRITE ERROR:", stdinError);
      // pythonProcess.stdin.end() will trigger 'close'
    }

  } catch (error) {
    console.error("UPLOAD GLOBAL ERROR:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error during upload", error: error.message });
    }
  }
};


// ================= DASHBOARD COUNTS =================
exports.getDashboardCounts = async (req, res) => {
  try {

    const total = await Resume.countDocuments();
    const shortlisted = await Resume.countDocuments({ status: "shortlisted" });
    const rejected = await Resume.countDocuments({ status: "rejected" });

    res.json({
      total,
      shortlisted,
      rejected
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let query = {};
    
    // Candidates only see their own resumes
    if (user && user.role === "candidate") {
      query.userId = req.user.id;
    }

    const resumes = await Resume.find(query)
      .select("-resumeText")
      .sort({ createdAt: -1 })
      .limit(100);
      
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
};

exports.getResumeById = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  res.json(resume);
};

exports.downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Check if recruiter or the owner of the resume
    const user = await User.findById(req.user.id);
    if (user.role !== "recruiter" && resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to download this resume" });
    }

    const filePath = path.join(__dirname, "../", resume.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Resume file not found on server" });
    }

    res.download(filePath, resume.originalname);
  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);
    res.status(500).json({ message: "Failed to download resume" });
  }
};