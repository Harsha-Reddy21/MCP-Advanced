# Plagiarism Detector Backend

This is the FastAPI backend for the Plagiarism Detector application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file based on `.env.example` and add your OpenAI API key if you want to use OpenAI embeddings.

3. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## API Endpoints

- `GET /`: Root endpoint
- `GET /models`: Get available embedding models
- `POST /detect-plagiarism`: Detect plagiarism between multiple texts

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc 