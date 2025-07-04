# Plagiarism Detector - Semantic Similarity Analyzer

A web application that detects plagiarism and analyzes semantic similarity between multiple text inputs using various embedding models.

## Project Overview

This application uses natural language processing techniques to detect potential plagiarism between text samples. It compares texts using semantic embeddings, which capture the meaning of the text rather than just exact matches, making it effective at identifying paraphrased content.

## Features

- Web interface with multiple text input boxes
- Semantic similarity comparison using various embedding models
- Visualization of similarity percentages between all text pairs
- Identification of potential plagiarism based on configurable thresholds
- Comparison of different embedding models (sentence-transformers, OpenAI embeddings)

## Technical Implementation

- **Frontend**: React with Material-UI
- **Backend**: FastAPI
- **Core Components**:
  - Text preprocessing
  - Embedding generation using multiple models
  - Pairwise cosine similarity calculation
  - Results visualization showing similarity matrix
  - Clone detection based on similarity thresholds

## Project Structure

```
Plagiarism_Detector/
├── frontend/           # React frontend
│   ├── src/            # Source code
│   │   ├── components/ # React components
│   │   └── ...
│   └── ...
├── backend/            # FastAPI backend
│   ├── main.py         # Main API implementation
│   ├── requirements.txt # Python dependencies
│   └── ...
└── README.md           # This file
```

## Setup and Installation

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example` and add your OpenAI API key if you want to use OpenAI embeddings.

4. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## How It Works

1. **Text Input**: Users enter multiple text samples for comparison
2. **Embedding Generation**: The backend converts texts into embeddings using selected models
3. **Similarity Calculation**: The system calculates cosine similarity between all text pairs
4. **Visualization**: Results are displayed as a similarity matrix and chart
5. **Plagiarism Detection**: Texts with similarity above the threshold are flagged as potential plagiarism

## Embedding Models

The application supports multiple embedding models:
- sentence-transformers/all-MiniLM-L6-v2
- sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
- OpenAI's text-embedding-ada-002 (requires API key)

## License

MIT 