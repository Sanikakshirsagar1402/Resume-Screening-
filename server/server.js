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

// SERVE FRONTEND IN PRODUCTION
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/my-project/dist");
  app.use(express.static(clientBuildPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", time: new Date() });
});
// app.use((req, res, next) => {
//   console.log("REQ URL:", req.url);
//   next();
// });


// console.log("SERVER FILE LOADED");

console.log("Starting server...");

//  CONNECT DATABASE AND START SERVER
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
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

