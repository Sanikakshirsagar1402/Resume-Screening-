const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true
    },
    status: {
      type: String,
      enum: ["applied", "reviewed", "shortlisted", "rejected"],
      default: "applied"
    },
    matchScore: {
      type: Number,
      default: 0
    },
    interviewDetails: {
      date: String,
      time: String,
      location: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
