const SKILL_LIBRARY = [
  "react",
  "node.js",
  "node",
  "express",
  "mongodb",
  "mongoose",
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "html",
  "css",
  "tailwind",
  "bootstrap",
  "redux",
  "next.js",
  "mysql",
  "postgresql",
  "sql",
  "aws",
  "azure",
  "docker",
  "kubernetes",
  "git",
  "github",
  "rest api",
  "api",
  "machine learning",
  "data analysis",
  "nlp",
  "figma",
  "firebase",
  "postman",
  "jira",
  "agile",
  "testing",
  "jest",
  "ci/cd"
];

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "into", "have", "has",
  "will", "your", "you", "our", "are", "job", "role", "work", "using", "use",
  "years", "year", "plus", "must", "should", "able", "experience", "skills",
  "knowledge", "team", "candidate", "strong", "good", "required"
]);

function normalizeText(text = "") {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function tokenize(text = "") {
  return normalizeText(text)
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function extractSkills(text = "") {
  const normalized = normalizeText(text);

  return SKILL_LIBRARY.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|\\W)${escaped}(\\W|$)`, "i").test(normalized);
  });
}

function extractExperienceYears(text = "") {
  const matches = [...normalizeText(text).matchAll(/(\d{1,2})\+?\s*(?:years|year|yrs|yr)/g)];

  if (!matches.length) {
    return 0;
  }

  return Math.max(...matches.map((match) => Number(match[1]) || 0));
}

function extractEducation(text = "") {
  const normalized = normalizeText(text);
  const educationLevels = [
    "phd",
    "master",
    "bachelor",
    "b.tech",
    "m.tech",
    "mba",
    "b.e",
    "bsc",
    "msc",
    "diploma"
  ];

  return educationLevels.find((level) => normalized.includes(level)) || "Not specified";
}

function estimateProjects(text = "") {
  const projectMatches = normalizeText(text).match(/\bproject[s]?\b/g);
  return projectMatches ? projectMatches.length : 0;
}

function analyzeResumeText(text = "") {
  const normalized = normalizeText(text);
  const skills = extractSkills(normalized);
  const experienceYears = extractExperienceYears(normalized);
  const projects = estimateProjects(normalized);
  const education = extractEducation(normalized);

  let score = 30;

  if (normalized.includes("@")) score += 10;
  if (skills.length >= 3) score += 20;
  if (experienceYears > 0) score += 15;
  if (projects > 0) score += 10;
  if (education !== "Not specified") score += 15;

  return {
    skills,
    experienceYears,
    projects,
    education,
    resumeScore: Math.min(score, 100)
  };
}

function extractJobRequirements(jobDescription = "") {
  const normalized = normalizeText(jobDescription);

  return {
    skills: extractSkills(normalized),
    experienceYears: extractExperienceYears(normalized),
    keywords: [...new Set(tokenize(normalized))]
  };
}

function calculateResumeMatch(resume, jobDescription = "") {
  const requirements = extractJobRequirements(jobDescription);
  const resumeSkills = resume.skills?.length ? resume.skills : extractSkills(resume.resumeText || "");
  const matchedSkills = requirements.skills.filter((skill) => resumeSkills.includes(skill));
  const missingSkills = requirements.skills.filter((skill) => !resumeSkills.includes(skill));

  const resumeKeywords = new Set(tokenize(resume.resumeText || ""));
  const overlappingKeywords = requirements.keywords.filter((keyword) => resumeKeywords.has(keyword));

  const skillScore = requirements.skills.length
    ? (matchedSkills.length / requirements.skills.length) * 60
    : 30;
  const keywordScore = requirements.keywords.length
    ? Math.min((overlappingKeywords.length / requirements.keywords.length) * 25, 25)
    : 10;
  const experienceScore = requirements.experienceYears
    ? Math.min(((resume.experienceYears || 0) / requirements.experienceYears) * 15, 15)
    : Math.min((resume.experienceYears || 0) * 3, 15);
  const qualityScore = Math.min((resume.resumeScore || 0) * 0.1, 10);

  const matchScore = Math.round(skillScore + keywordScore + experienceScore + qualityScore);

  let status = "rejected";
  if (matchScore >= 70) {
    status = "shortlisted";
  } else if (matchScore >= 45) {
    status = "pending";
  }

  return {
    matchScore,
    status,
    matchedSkills,
    missingSkills,
    requirementSkills: requirements.skills,
    keywordHits: overlappingKeywords.length
  };
}

function rankResumes(resumes = [], jobDescription = "") {
  return resumes
    .map((resume) => {
      const match = calculateResumeMatch(resume, jobDescription);

      return {
        _id: resume._id,
        name: resume.candidateName || resume.originalname,
        originalname: resume.originalname,
        path: resume.path,
        skills: resume.skills || [],
        experienceYears: resume.experienceYears || 0,
        education: resume.education || "Not specified",
        resumeScore: resume.resumeScore || 0,
        ...match
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  analyzeResumeText,
  calculateResumeMatch,
  extractJobRequirements,
  extractSkills,
  rankResumes
};
