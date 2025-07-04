from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os
import dotenv
from sentence_transformers import SentenceTransformer
import torch

# Load environment variables
dotenv.load_dotenv()

app = FastAPI(title="Plagiarism Detector API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize models
models = {
    "sentence-transformers/all-MiniLM-L6-v2": None,
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2": None,
}

# Load models on demand to save memory
def get_model(model_name):
    if model_name not in models:
        raise HTTPException(status_code=400, detail=f"Model {model_name} not supported")
    
    if models[model_name] is None:
        try:
            models[model_name] = SentenceTransformer(model_name)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")
    
    return models[model_name]

# OpenAI embedding function
async def get_openai_embedding(text):
    try:
        import openai
        openai.api_key = os.getenv("OPENAI_API_KEY")
        
        response = await openai.embeddings.create(
            model="text-embedding-ada-002",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

# Request models
class TextItem(BaseModel):
    id: str
    content: str

class PlagiarismRequest(BaseModel):
    texts: List[TextItem]
    model: str = "sentence-transformers/all-MiniLM-L6-v2"
    threshold: float = 0.8

# Response models
class SimilarityPair(BaseModel):
    id1: str
    id2: str
    similarity: float
    is_potential_clone: bool

class PlagiarismResponse(BaseModel):
    similarity_matrix: List[List[float]]
    text_ids: List[str]
    pairs: List[SimilarityPair]
    model_used: str

# Preprocess text
def preprocess_text(text):
    # Simple preprocessing: lowercase and strip
    return text.lower().strip()

@app.get("/")
def read_root():
    return {"message": "Plagiarism Detector API"}

@app.get("/models")
def get_available_models():
    return {
        "models": list(models.keys()) + ["openai/text-embedding-ada-002"]
    }

@app.post("/detect-plagiarism", response_model=PlagiarismResponse)
async def detect_plagiarism(request: PlagiarismRequest):
    if not request.texts or len(request.texts) < 2:
        raise HTTPException(status_code=400, detail="At least 2 texts are required")
    
    # Preprocess texts
    texts = [preprocess_text(item.content) for item in request.texts]
    text_ids = [item.id for item in request.texts]
    
    # Generate embeddings
    embeddings = []
    
    if request.model == "openai/text-embedding-ada-002":
        # Use OpenAI embeddings
        for text in texts:
            embedding = await get_openai_embedding(text)
            embeddings.append(embedding)
    else:
        # Use sentence-transformers
        model = get_model(request.model)
        embeddings = model.encode(texts)
    
    # Convert to numpy arrays
    embeddings = np.array(embeddings)
    
    # Calculate cosine similarity
    similarity_matrix = cosine_similarity(embeddings)
    
    # Convert to list for JSON serialization
    similarity_list = similarity_matrix.tolist()
    
    # Find potential clones
    pairs = []
    n = len(texts)
    for i in range(n):
        for j in range(i+1, n):
            similarity = similarity_matrix[i][j]
            pairs.append(SimilarityPair(
                id1=text_ids[i],
                id2=text_ids[j],
                similarity=float(similarity),
                is_potential_clone=similarity >= request.threshold
            ))
    
    return PlagiarismResponse(
        similarity_matrix=similarity_list,
        text_ids=text_ids,
        pairs=pairs,
        model_used=request.model
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 