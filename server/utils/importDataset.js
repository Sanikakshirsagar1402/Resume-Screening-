const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Resume = require("../models/resume");
const User = require("../models/user");

dotenv.config();

/**
 * A robust CSV parser that handles multiline fields enclosed in quotes.
 */
function parseCSV(content) {
  const results = [];
  let currentField = "";
  let currentRow = [];
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          // End of quote
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (char === "\n" || (char === "\r" && nextChar === "\n")) {
        if (char === "\r") i++;
        currentRow.push(currentField.trim());
        if (currentRow.length > 0) results.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }
  
  // Push last field/row if any
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    results.push(currentRow);
  }

  return results;
}

const importData = async () => {
  console.log("Starting robust import script...");
  try {
    if (!process.env.MONGO_URI) {
      console.error("ERROR: MONGO_URI is not defined in .env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");

    // 1. Create a dummy user if not exists
    let sampleUser = await User.findOne({ email: "sample_candidate@example.com" });
    if (!sampleUser) {
      console.log("Creating sample user...");
      sampleUser = await User.create({
        name: "Kaggle Sample Candidate",
        email: "sample_candidate@example.com",
        password: "sample_password_123",
        role: "candidate"
      });
      console.log("Sample user created.");
    }

    // Check for path in arguments
    let filePath = process.argv[2] || path.join(__dirname, "../datsets/resume_dataset.csv");
    
    // If it's a directory (from kagglehub), look for the csv file inside
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
      const files = fs.readdirSync(filePath);
      const csvFile = files.find(f => f.endsWith(".csv"));
      if (csvFile) {
        filePath = path.join(filePath, csvFile);
      }
    }

    if (!fs.existsSync(filePath)) {
      console.error(`ERROR: File not found at ${filePath}`);
      process.exit(1);
    }

    console.log("Reading file from:", filePath);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    console.log("Parsing CSV data...");
    const allRows = parseCSV(fileContent);
    
    // The first row is the header [Category, Resume]
    const dataRows = allRows.slice(1);
    console.log(`Parsed ${dataRows.length} data rows.`);

    // Group rows by category
    const categoryGroups = {};
    dataRows.forEach(row => {
      const [category] = row;
      if (category) {
        if (!categoryGroups[category]) categoryGroups[category] = [];
        categoryGroups[category].push(row);
      }
    });

    const SKILLS = [
      "python", "java", "c++", "c", "javascript", "react", "node", "mongodb",
      "machine learning", "deep learning", "tensorflow", "pytorch",
      "sql", "html", "css", "flask", "django", "data science",
      "nlp", "computer vision", "aws", "docker", "kubernetes", "php", "angular",
      "vue", "express", "postgresql", "redis", "azure", "gcp", "spark", "hadoop",
      "tableau", "power bi", "excel", "git", "scrum", "agile"
    ];

    function extractSkills(text) {
      const lowerText = text.toLowerCase();
      return SKILLS.filter(skill => lowerText.includes(skill.toLowerCase()));
    }

    const sampleNames = [
      "Aarav Sharma", "Aditi Rao", "Akash Gupta", "Ananya Singh", "Arjun Verma",
      "Ishani Deshmukh", "Kabir Malhotra", "Meera Iyer", "Nikhil Kulkarni", "Pooja Patil",
      "Rohan Joshi", "Sana Khan", "Vikram Mehra", "Zara Ahmed", "Amit Trivedi",
      "Deepika Padukone", "Ranbir Kapoor", "Alia Bhatt", "Varun Dhawan", "Sara Ali Khan",
      "Kartik Aaryan", "Kiara Advani", "Ayushmann Khurrana", "Bhumi Pednekar", "Rajkummar Rao",
      "Taapsee Pannu", "Vicky Kaushal", "Janhvi Kapoor", "Ishaan Khatter", "Ananya Panday"
    ];

    // Take all resumes
    const finalSampleRows = dataRows;

    console.log(`Importing all ${finalSampleRows.length} resumes across ${Object.keys(categoryGroups).length} categories...`);

    for (let i = 0; i < finalSampleRows.length; i++) {
      const [category, resumeText] = finalSampleRows[i];
      if (!category || !resumeText) continue;

      const randomName = sampleNames[i % sampleNames.length];
      const extractedSkills = extractSkills(resumeText);
      const randomPhone = `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`;

      await Resume.create({
        filename: "kaggle_sample.pdf",
        originalname: `Sample_${category.replace(/\s+/g, '_')}_${i}.pdf`,
        path: "uploads/sample.pdf",
        mimetype: "application/pdf",
        size: 1024,
        userId: sampleUser._id,
        resumeText: resumeText,
        candidateName: randomName,
        email: `candidate_${i}@example.com`,
        phone: randomPhone,
        category: category,
        skills: extractedSkills,
        resumeScore: Math.floor(Math.random() * 40) + 50
      });
      process.stdout.write(".");
    }

    console.log("\nImport completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("\nCRITICAL IMPORT ERROR:", error);
    process.exit(1);
  }
};

importData();
