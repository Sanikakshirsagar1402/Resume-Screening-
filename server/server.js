const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Created uploads directory");
}

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use("/uploads", express.static("uploads"));
app.use("/api/jobs", jobRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

// SERVE FRONTEND IN PRODUCTION
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/my-project/dist");
  app.use(express.static(clientBuildPath));
}

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", time: new Date() });
});

// Catch-all route handler (Fixes Express v5 wildcard error)
app.use((req, res) => {
  if (process.env.NODE_ENV === "production") {
    const clientBuildPath = path.join(__dirname, "../client/my-project/dist");
    res.sendFile(path.join(clientBuildPath, "index.html"));
  } else {
    res.status(404).json({
      message: "Route not found"
    });
  }
});

// app.use((req, res, next) => {
//   console.log("REQ URL:", req.url);
//   next();
// });


// console.log("SERVER FILE LOADED");

console.log("Starting server...");

//  CONNECT DATABASE AND START SERVER
console.log("Connecting to MongoDB at:", process.env.MONGO_URI ? "URI provided" : "URI MISSING");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  })
  .catch((err) => {
    console.error("CRITICAL: Database connection failed!");
    console.error("Error details:", err.message);
    // In production, we don't want the server to just hang if DB fails
    // process.exit(1) is used by Render to know the app crashed
    process.exit(1);
  });

//   app.get("/", (req, res) => {
//   res.send("Backend is running");
// });

// app.get("/test-log", (req, res) => {
//   console.log("TEST LOG HIT");
//   res.send("OK");
// });

// app.all("/api/jobs/create", (req, res) => {
//   res.send("Jobs route hit: " + req.method);
// });



// app.all("/api/auth/register", (req, res) => {
//   res.send("HIT " + req.method);
// });

