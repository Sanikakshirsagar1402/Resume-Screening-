import json
import sys
import re

# Skill dictionary
SKILLS = [
    "python","java","c++","c","javascript","react","node","mongodb",
    "machine learning","deep learning","tensorflow","pytorch",
    "sql","html","css","flask","django","data science",
    "nlp","computer vision","aws","docker","kubernetes"
]


# Category keywords
CATEGORIES = {
    "Data Science": ["data science", "machine learning", "deep learning", "nlp", "python", "r", "statistics"],
    "Web Designing": ["html", "css", "javascript", "figma", "ui", "ux", "photoshop", "adobe"],
    "Java Developer": ["java", "spring", "hibernate", "maven", "jsp", "servlets"],
    "Business Analyst": ["business analyst", "requirements", "agile", "scrum", "stakeholder", "process improvement"],
    "HR": ["hr", "recruitment", "payroll", "employee relations", "hiring", "onboarding"],
    "Software Testing": ["testing", "qa", "selenium", "manual testing", "automation", "test case"],
    "Python Developer": ["python", "django", "flask", "pandas", "numpy", "fastapi"],
    "Advocate": ["legal", "lawyer", "court", "litigation", "advocate", "legal research", "drafting"],
    "Health and Fitness": ["health", "fitness", "nutrition", "workout", "trainer", "wellness", "diet"],
    "Agricultural": ["agriculture", "farming", "crop", "soil", "harvest", "agronomy", "livestock"],
    "BPO": ["bpo", "customer service", "call center", "telecalling", "inbound", "outbound", "voice process"],
    "Sales": ["sales", "business development", "marketing", "client acquisition", "revenue", "lead generation"],
    "Arts": ["art", "design", "painting", "illustration", "creative", "graphics", "fine arts"],
    "Digital Media": ["digital marketing", "social media", "content creation", "seo", "sem", "branding"]
}


def extract_skills(text):
    text = text.lower()
    found_skills = []

    for skill in SKILLS:
        if skill in text:
            found_skills.append(skill)

    return list(set(found_skills))


def detect_category(text):
    text = text.lower()
    best_category = "General"
    max_count = 0

    for category, keywords in CATEGORIES.items():
        count = sum(1 for keyword in keywords if keyword in text)
        if count > max_count:
            max_count = count
            best_category = category

    return best_category


def extract_experience(text):
    pattern = r'(\d+)\+?\s*(years|year)'
    matches = re.findall(pattern, text.lower())

    years = [int(m[0]) for m in matches]

    return max(years) if years else 0


def count_projects(text):
    project_keywords = ["project","projects","developed","built","implemented"]

    count = 0
    text = text.lower()

    for word in project_keywords:
        count += text.count(word)

    return count


def detect_education(text):
    education_keywords = [
        "bachelor","b.tech","bsc","msc","master","phd","engineering"
    ]

    text = text.lower()

    for word in education_keywords:
        if word in text:
            return word

    return "Not Found"


def extract_name(text):
    # Simple heuristic: first line of text is often the name
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    if lines:
        # Check if the first line looks like a name (no special characters, not too long)
        first_line = lines[0]
        if len(first_line) < 50 and not re.search(r'[:@/]', first_line):
            return first_line
    return ""


def calculate_ats_score(text, skills, experience, projects, education):
    score = 0
    feedback = []

    # 1. Contact Info Check (Email, Phone)
    has_email = re.search(r'[\w\.-]+@[\w\.-]+', text)
    has_phone = re.search(r'\+?\d[\d\s\-\(\)]{8,}\d', text)
    
    if has_email:
        score += 10
    else:
        feedback.append("Missing email address")
        
    if has_phone:
        score += 10
    else:
        feedback.append("Missing phone number")

    # 2. Section Headers Check
    headers = ["experience", "education", "skills", "projects", "summary", "objective"]
    text_lower = text.lower()
    found_headers = sum(1 for h in headers if h in text_lower)
    
    header_score = min(found_headers * 5, 20)
    score += header_score
    if found_headers < 3:
        feedback.append("Missing standard section headers (Experience, Education, Skills)")

    # 3. Skills Score (Keyword density)
    skill_score = min(len(skills) * 4, 20)
    score += skill_score
    if len(skills) < 5:
        feedback.append("Low skill count. Add more relevant keywords.")

    # 4. Experience & Projects
    exp_score = min(experience * 5, 20)
    score += exp_score
    
    proj_score = min(projects * 2, 10)
    score += proj_score

    # 5. Education
    if education != "Not Found":
        score += 10
    else:
        feedback.append("Education section not clearly identified")

    # 6. Length Check
    word_count = len(text.split())
    if 200 <= word_count <= 1000:
        score += 10
    elif word_count > 1000:
        feedback.append("Resume is too long. Aim for 1-2 pages.")
    else:
        feedback.append("Resume is too short. Add more detail.")

    return min(score, 100), feedback


def analyze_resume(resume_text):
    skills = extract_skills(resume_text)
    category = detect_category(resume_text)
    experience = extract_experience(resume_text)
    projects = count_projects(resume_text)
    education = detect_education(resume_text)
    candidate_name = extract_name(resume_text)

    # Extract email and phone
    email_match = re.search(r'[\w\.-]+@[\w\.-]+', resume_text)
    phone_match = re.search(r'\+?\d[\d\s\-\(\)]{8,}\d', resume_text)
    
    email = email_match.group(0) if email_match else ""
    phone = phone_match.group(0) if phone_match else ""

    score, feedback = calculate_ats_score(resume_text, skills, experience, projects, education)

    return {
        "candidate_name": candidate_name,
        "skills": skills,
        "category": category,
        "experience_years": experience,
        "projects": projects,
        "education": education,
        "email": email,
        "phone": phone,
        "resume_score": score,
        "ats_feedback": feedback
    }


if __name__ == "__main__":
    # Read from stdin
    resume_text = sys.stdin.read()

    if not resume_text:
        print(json.dumps({}))
        sys.exit(0)

    result = analyze_resume(resume_text)

    print(json.dumps(result))