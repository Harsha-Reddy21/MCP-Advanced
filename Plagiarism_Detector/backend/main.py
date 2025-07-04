import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import openai

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Plagiarism Detector API",
    description="API for detecting plagiarism using semantic similarity analysis",
    version="1.0.0"
)

# Configure CORS - update to allow specific frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add any other frontend URLs as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set OpenAI API key if available
openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key:
    openai.api_key = openai_api_key

# Load models
models = {
    "sentence-transformers/all-MiniLM-L6-v2": None,
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2": None
}

# Similarity threshold from environment or default
SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", 0.8))

# Request and response models
class TextComparisonRequest(BaseModel):
    texts: List[str]
    model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    use_openai: bool = False

class SimilarityResult(BaseModel):
    similarity_matrix: List[List[float]]
    potential_plagiarism: List[Dict[str, Any]]
    model_used: str

def load_model(model_name: str):
    """Load and cache the specified model"""
    if model_name not in models or models[model_name] is None:
        try:
            models[model_name] = SentenceTransformer(model_name)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to load model: {str(e)}")
    return models[model_name]

def preprocess_text(text: str) -> str:
    """Basic text preprocessing"""
    # Remove extra whitespace
    text = ' '.join(text.split())
    return text

def get_embeddings_sentence_transformers(texts: List[str], model_name: str) -> np.ndarray:
    """Generate embeddings using sentence-transformers"""
    model = load_model(model_name)
    processed_texts = [preprocess_text(text) for text in texts]
    embeddings = model.encode(processed_texts)
    return embeddings

def get_embeddings_openai(texts: List[str]) -> np.ndarray:
    """Generate embeddings using OpenAI's API"""
    if not openai_api_key:
        raise HTTPException(status_code=400, detail="OpenAI API key not configured")
    
    processed_texts = [preprocess_text(text) for text in texts]
    try:
        response = openai.embeddings.create(
            input=processed_texts,
            model="text-embedding-ada-002"
        )
        embeddings = np.array([item.embedding for item in response.data])
        return embeddings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

def calculate_similarity_matrix(embeddings: np.ndarray) -> List[List[float]]:
    """Calculate pairwise cosine similarity between embeddings"""
    similarity = cosine_similarity(embeddings)
    # Convert to Python list for JSON serialization
    return similarity.tolist()

def detect_plagiarism(similarity_matrix: List[List[float]], threshold: float = SIMILARITY_THRESHOLD) -> List[Dict[str, Any]]:
    """Detect potential plagiarism based on similarity threshold"""
    potential_plagiarism = []
    
    for i in range(len(similarity_matrix)):
        for j in range(i+1, len(similarity_matrix)):  # Only check upper triangle to avoid duplicates
            similarity = similarity_matrix[i][j]
            if similarity >= threshold:
                potential_plagiarism.append({
                    "text1_index": i,
                    "text2_index": j,
                    "similarity": similarity
                })
    
    return potential_plagiarism

@app.get("/")
def read_root():
    return {"message": "Welcome to the Plagiarism Detector API"}

@app.get("/models")
def get_available_models():
    """Get list of available embedding models"""
    return {
        "sentence_transformers": list(models.keys()),
        "openai": ["text-embedding-ada-002"] if openai_api_key else []
    }

@app.post("/analyze", response_model=SimilarityResult)
def analyze_texts(request: TextComparisonRequest):
    """Analyze texts for similarity and detect potential plagiarism"""
    if not request.texts or len(request.texts) < 2:
        raise HTTPException(status_code=400, detail="At least two texts are required for comparison")
    
    try:
        # Generate embeddings
        if request.use_openai:
            embeddings = get_embeddings_openai(request.texts)
            model_used = "OpenAI: text-embedding-ada-002"
        else:
            embeddings = get_embeddings_sentence_transformers(request.texts, request.model_name)
            model_used = f"Sentence-Transformers: {request.model_name}"
        
        # Calculate similarity matrix
        similarity_matrix = calculate_similarity_matrix(embeddings)
        
        # Detect potential plagiarism
        plagiarism_results = detect_plagiarism(similarity_matrix)
        
        return {
            "similarity_matrix": similarity_matrix,
            "potential_plagiarism": plagiarism_results,
            "model_used": model_used
        }
    
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Error during analysis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True) 