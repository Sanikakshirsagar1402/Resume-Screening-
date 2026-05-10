import json
import sys
import os
import re
import collections

# NOTE: Transformers/Sentence-Transformers require significant disk space.
# If you have enough space, you can uncomment the following and use the semantic matching logic.
try:
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False

def clean_text(text):
    """Clean text for matching."""
    text = text.lower()
    # Remove special characters
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def get_tokens(text):
    """Tokenize and remove common stop words."""
    stop_words = {'and', 'the', 'is', 'in', 'at', 'of', 'for', 'with', 'a', 'an', 'to', 'on', 'our', 'your'}
    tokens = text.split()
    return [t for t in tokens if t not in stop_words and len(t) > 1]

def match_resumes_pseudo_semantic(job_description, resumes):
    """
    Advanced matching using Jaccard Similarity and Keyword Weighting.
    This works without heavy ML libraries like Transformers.
    """
    if not resumes:
        return []
        
    jd_clean = clean_text(job_description)
    jd_tokens = set(get_tokens(jd_clean))
    
    # Weight certain tokens (e.g., technical skills)
    # In a real app, this could be a dynamic list
    tech_keywords = {
        'python', 'javascript', 'react', 'node', 'express', 'mongodb', 'sql', 'java', 
        'spring', 'docker', 'aws', 'cloud', 'ml', 'ai', 'devops', 'backend', 'frontend'
    }
    
    results = []
    for resume in resumes:
        res_data = resume.copy()
        resume_text = clean_text(res_data.get("text", ""))
        res_tokens = set(get_tokens(resume_text))
        
        if not jd_tokens or not res_tokens:
            score = 0
        else:
            # Intersection / Union (Jaccard)
            intersection = jd_tokens.intersection(res_tokens)
            
            # Weighted intersection
            weighted_score = 0
            for token in intersection:
                if token in tech_keywords:
                    weighted_score += 2.0 # Tech skills count double
                else:
                    weighted_score += 1.0
            
            # Weighted total possible score (from JD)
            total_possible = 0
            for token in jd_tokens:
                if token in tech_keywords:
                    total_possible += 2.0
                else:
                    total_possible += 1.0
            
            # Normalize to 0-100
            score = round((weighted_score / total_possible) * 100, 2) if total_possible > 0 else 0
            
        res_data["score"] = score
        if "text" in res_data: del res_data["text"]
        if "name" not in res_data: res_data["name"] = "Candidate"
        if "category" not in res_data: res_data["category"] = "General"
        results.append(res_data)
        
    return sorted(results, key=lambda x: x["score"], reverse=True)

# SEMANTIC VERSION (UNCOMMENT IF LIBRARIES INSTALLED)
# def match_resumes_transformer(job_description, resumes):
#     model = SentenceTransformer('all-MiniLM-L6-v2')
#     resume_texts = [r.get("text", "") for r in resumes]
#     all_texts = [job_description] + resume_texts
#     embeddings = model.encode(all_texts)
#     similarities = cosine_similarity([embeddings[0]], embeddings[1:])[0]
#     ...

if __name__ == "__main__":
    try:
        input_text = sys.stdin.read()
        if not input_text:
            print(json.dumps([]))
            sys.exit(0)
            
        input_data = json.loads(input_text)
        jd = input_data.get("jobDescription", "")
        resumes = input_data.get("resumes", [])
        
        if not jd or not resumes:
            print(json.dumps([]))
        else:
            # Using pseudo-semantic matching for environment compatibility
            ranked = match_resumes_pseudo_semantic(jd, resumes)
            print(json.dumps(ranked))
            
    except Exception as e:
        sys.stderr.write(f"ERROR: {str(e)}\n")
        print(json.dumps([]))
