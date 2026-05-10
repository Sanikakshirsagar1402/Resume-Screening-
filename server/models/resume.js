const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true
    },

    originalname: {
      type: String,
      required: true
    },

    path: {
      type: String,
      required: true
    },

    mimetype: {
      type: String,
      required: true
    },

    size: {
      type: Number,
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Extracted text for AI matching
    resumeText: {
      type: String,
      default: ""
    },

    category: String,

    // Optional extracted fields (future AI features)
    candidateName: String,
    email: String,
    phone: String,
    skills: [String],
    experienceYears: {
      type: Number,
      default: 0
    },
    projects: {
      type: Number,
      default: 0
    },
    education: {
      type: String,
      default: "Not specified"
    },
    resumeScore: {
      type: Number,
      default: 0
    },
    atsFeedback: {
      type: [String],
      default: []
    },
    matchScore: {
      type: Number,
      default: 0
    },
    matchedSkills: {
      type: [String],
      default: []
    },
    missingSkills: {
      type: [String],
      default: []
    },

    // Recruiter decision
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected"],
      default: "pending"
    }

  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Resume ||
  mongoose.model("Resume", resumeSchema);
