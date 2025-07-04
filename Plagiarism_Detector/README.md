# Plagiarism Detector - Semantic Similarity Analyzer

A web application that detects potential plagiarism between multiple text samples using semantic similarity analysis with various embedding models.

## Features

- Web interface with dynamic input text boxes for multiple text samples
- Semantic similarity comparison using advanced embedding models
- Similarity matrix visualization showing percentages between all text pairs
- Identification of potential plagiarism (configurable similarity threshold)
- Support for multiple embedding models:
  - Sentence Transformers (local processing)
  - OpenAI Embeddings (API-based)
- Detailed documentation on embedding models and plagiarism detection

## Architecture

- **Frontend**: React.js
- **Backend**: FastAPI (Python)
- **Embedding Models**: Sentence Transformers, OpenAI API

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
   
6. Edit the `.env` file and add your OpenAI API key if you want to use OpenAI embeddings.

7. Start the backend server:
   ```
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter text samples in the input boxes (minimum 2 texts required)
2. Select the embedding model you want to use
3. Click "Analyze" to process the texts
4. View the similarity matrix and potential plagiarism results
5. Try different models to compare their performance

## Documentation

- [How Embeddings Detect Plagiarism](docs/how_embeddings_detect_plagiarism.md)
- [Embedding Model Comparison](docs/embedding_model_comparison.md)

## License

MIT

## Acknowledgments

- [Sentence Transformers](https://www.sbert.net/)
- [OpenAI](https://openai.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/) 