# Plagiarism Detector Backend

This is the backend API for the Plagiarism Detector application. It provides endpoints for analyzing text similarity using various embedding models.

## Features

- Text preprocessing and embedding generation
- Multiple embedding models support:
  - Sentence Transformers (local processing)
  - OpenAI Embeddings (API-based)
- Cosine similarity calculation
- Plagiarism detection based on similarity thresholds
- RESTful API with FastAPI

## API Endpoints

### GET /

Returns a welcome message.

### GET /models

Returns a list of available embedding models.

**Response:**
```json
{
  "sentence_transformers": [
    "sentence-transformers/all-MiniLM-L6-v2",
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
  ],
  "openai": [
    "text-embedding-ada-002"
  ]
}
```

### POST /analyze

Analyzes texts for similarity and detects potential plagiarism.

**Request:**
```json
{
  "texts": ["text1", "text2", "..."],
  "model_name": "sentence-transformers/all-MiniLM-L6-v2",
  "use_openai": false
}
```

**Response:**
```json
{
  "similarity_matrix": [[1.0, 0.8], [0.8, 1.0]],
  "potential_plagiarism": [
    {
      "text1_index": 0,
      "text2_index": 1,
      "similarity": 0.8
    }
  ],
  "model_used": "Sentence-Transformers: all-MiniLM-L6-v2"
}
```

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

5. Edit the `.env` file and add your OpenAI API key if you want to use OpenAI embeddings.

## Running the Server

```
uvicorn main:app --reload
```

The API will be available at http://localhost:8000.

API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc 