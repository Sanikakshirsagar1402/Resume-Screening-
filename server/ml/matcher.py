import json
import sys
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Try to import sentence_transformers for semantic matching
try:
    from sentence_transformers import SentenceTransformer
    SBERT_AVAILABLE = True
except ImportError:
    SBERT_AVAILABLE = False

def match_resumes_sbert(job_description, resumes):
    try:
        # Load a lightweight, fast model
        model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Extract text from all resumes
        resume_texts = [r.get("text", "") for r in resumes]
        
        # Encode JD and resumes into embeddings
        all_texts = [job_description] + resume_texts
        embeddings = model.encode(all_texts)
        
        jd_embedding = embeddings[0:1]
        resume_embeddings = embeddings[1:]
        
        # Compute cosine similarity
        similarities = cosine_similarity(jd_embedding, resume_embeddings)[0]
        
        return similarities
    except Exception as e:
        print(f"S-BERT Error: {str(e)}", file=sys.stderr)
        return None

def match_resumes_tfidf(job_description, resumes):
    # Extract text from all resumes
    resume_texts = [r.get("text", "") for r in resumes]
    
    vectorizer = TfidfVectorizer(stop_words='english')
    all_texts = [job_description] + resume_texts
    tfidf_matrix = vectorizer.fit_transform(all_texts)
    
    jd_vector = tfidf_matrix[0:1]
    resume_vectors = tfidf_matrix[1:]
    
    similarities = cosine_similarity(jd_vector, resume_vectors)[0]
    return similarities

def process_matching(job_description, resumes):
    if not resumes:
        return []

    similarities = None
    
    # 1. Try Semantic Matching (S-BERT)
    if SBERT_AVAILABLE:
        similarities = match_resumes_sbert(job_description, resumes)
    
    # 2. Fallback to TF-IDF if S-BERT is unavailable or fails
    if similarities is None:
        similarities = match_resumes_tfidf(job_description, resumes)
    
    results = []
    for i, resume in enumerate(resumes):
        res_data = resume.copy()
        if "text" in res_data:
            del res_data["text"]
            
        # Add the match score (0-100)
        res_data["score"] = round(float(similarities[i] * 100), 2)
        
        # Ensure name and category are present
        if "name" not in res_data:
            res_data["name"] = "Candidate"
        if "category" not in res_data:
            res_data["category"] = "General"
            
        results.append(res_data)

    # Sort by score descending
    ranked = sorted(results, key=lambda x: x["score"], reverse=True)
    return ranked

if __name__ == "__main__":
    # Set environment variable to suppress model download warnings
    os.environ['TOKENIZERS_PARALLELISM'] = 'false'
    os.environ['TRANSFORMERS_VERBOSITY'] = 'error'
    
    try:
        input_text = sys.stdin.read()
        if not input_text:
            sys.stdout.write(json.dumps([]))
            sys.exit(0)
        input_data = json.loads(input_text)
    except Exception:
        sys.stdout.write(json.dumps([]))
        sys.exit(0)

    job_description = input_data.get("jobDescription", "")
    resumes = input_data.get("resumes", [])

    if not job_description or not resumes:
        sys.stdout.write(json.dumps([]))
        sys.exit(0)

    ranked = process_matching(job_description, resumes)
    sys.stdout.write(json.dumps(ranked))
    sys.stdout.flush()
