const Application = require("../models/application");
const Job = require("../models/job");
const Resume = require("../models/resume");
const User = require("../models/user");
const { sendShortlistEmail } = require("../utils/emailService");
const { spawn } = require("child_process");

// APPLY FOR A JOB
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user.id;

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, candidateId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Get candidate's latest resume
    const resume = await Resume.findOne({ userId: candidateId }).sort({ createdAt: -1 });
    if (!resume) {
      return res.status(400).json({ message: "Please upload your resume before applying" });
    }

    // Get job description
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Run AI Matcher to get match score
    const pythonProcess = spawn(
      process.env.PYTHON_PATH || "python",
      [
        "ml/matcher.py",
        JSON.stringify({
          jobDescription: job.description,
          resumes: [{ name: "Candidate", text: resume.resumeText }]
        })
      ]
    );

    let result = "";
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.on("close", async () => {
      let matchScore = 0;
      try {
        const parsed = JSON.parse(result);
        if (parsed.length > 0) {
          matchScore = parsed[0].score;
        }
      } catch (err) {
        console.error("AI Matcher Error:", err);
      }

      const application = new Application({
        jobId,
        candidateId,
        resumeId: resume._id,
        matchScore
      });

      await application.save();

      res.status(201).json({
        message: "Application submitted successfully",
        application
      });
    });

  } catch (error) {
    console.error("APPLY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE APPLICATION STATUS
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, interviewDetails } = req.body; // interviewDetails: { date, time, location }

    const application = await Application.findById(applicationId)
      .populate("jobId")
      .populate("candidateId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if requester is the recruiter who posted the job
    if (application.jobId.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    if (interviewDetails) {
      application.interviewDetails = interviewDetails;
    }
    await application.save();

    // If shortlisted, send email
    if (status === "shortlisted" && interviewDetails) {
      const candidate = application.candidateId;
      const job = application.jobId;

      await sendShortlistEmail(
        candidate.email,
        candidate.name || "Candidate",
        { title: job.title, company: job.company },
        interviewDetails
      );
    }

    res.json({ message: `Application status updated to ${status}`, application });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET CANDIDATE APPLICATIONS
exports.getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.id })
      .populate("jobId")
      .populate("resumeId");
    res.json(applications);
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET JOB APPLICANTS (For Recruiters)
exports.getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Check if the recruiter owns the job
    const job = await Job.findById(jobId);
    if (!job || job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const applicants = await Application.find({ jobId })
      .populate("candidateId", "name email phone")
      .populate("resumeId")
      .sort({ matchScore: -1 });

    // Normalize paths before sending
    const formattedApplicants = applicants.map(app => {
      const appObj = app.toObject();
      if (appObj.resumeId && appObj.resumeId.path) {
        appObj.resumeId.path = appObj.resumeId.path.replace(/\\/g, "/");
      }
      return appObj;
    });

    res.json(formattedApplicants);
  } catch (error) {
    console.error("GET APPLICANTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
