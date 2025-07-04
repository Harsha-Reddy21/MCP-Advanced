# Embedding Model Comparison

This document provides a comparison of different embedding models used in the Plagiarism Detector application.

## Models Overview

| Model | Type | Size | Languages | Speed | Accuracy |
|-------|------|------|-----------|-------|----------|
| all-MiniLM-L6-v2 | Sentence Transformers | 80MB | English | Fast | Good |
| paraphrase-multilingual-MiniLM-L12-v2 | Sentence Transformers | 420MB | 50+ languages | Medium | Good |
| text-embedding-ada-002 | OpenAI API | Cloud-based | Multilingual | Fast (API dependent) | Excellent |

## Detailed Comparison

### 1. all-MiniLM-L6-v2 (Sentence Transformers)

**Description**: A lightweight model that creates sentence embeddings optimized for semantic similarity tasks.

**Strengths**:
- Very fast inference time
- Small model size (80MB)
- Good performance for English text
- Runs locally without API dependencies

**Weaknesses**:
- Less accurate than larger models
- Limited to English language
- May miss nuanced semantic relationships

**Best for**:
- Quick analysis of English text
- Environments with limited computational resources
- Applications requiring low latency

### 2. paraphrase-multilingual-MiniLM-L12-v2 (Sentence Transformers)

**Description**: A medium-sized multilingual model that supports 50+ languages.

**Strengths**:
- Good balance of speed and accuracy
- Supports multiple languages
- Runs locally without API dependencies
- Better at capturing semantic nuances than smaller models

**Weaknesses**:
- Slower than the smaller L6 model
- Larger model size (420MB)
- Not as accurate as the largest models or OpenAI's models

**Best for**:
- Multilingual plagiarism detection
- Applications requiring good accuracy across languages
- Production environments with moderate computational resources

### 3. text-embedding-ada-002 (OpenAI)

**Description**: OpenAI's embedding model, accessible through their API.

**Strengths**:
- State-of-the-art accuracy
- Excellent at capturing semantic relationships
- Handles various text formats well
- No local computational requirements

**Weaknesses**:
- Requires API key and internet connection
- Usage costs (pay per token)
- API rate limits
- Dependency on third-party service

**Best for**:
- High-stakes plagiarism detection
- Applications where accuracy is critical
- Scenarios where computational resources are limited but budget is available

## Performance Metrics

### Semantic Similarity Task Performance

| Model | Spearman Correlation (STS Benchmark) | Accuracy on Paraphrase Detection |
|-------|--------------------------------------|----------------------------------|
| all-MiniLM-L6-v2 | 0.77 | 83% |
| paraphrase-multilingual-MiniLM-L12-v2 | 0.80 | 86% |
| text-embedding-ada-002 | 0.86 | 92% |

### Resource Usage

| Model | Inference Time (1000 sentences) | Memory Usage | Disk Space |
|-------|--------------------------------|--------------|-----------|
| all-MiniLM-L6-v2 | 2 seconds | ~200MB | 80MB |
| paraphrase-multilingual-MiniLM-L12-v2 | 5 seconds | ~500MB | 420MB |
| text-embedding-ada-002 | API dependent | Minimal (client only) | N/A (cloud) |

## Recommended Use Cases

- **Quick Analysis**: all-MiniLM-L6-v2
- **Multilingual Documents**: paraphrase-multilingual-MiniLM-L12-v2
- **High-Stakes Plagiarism Detection**: text-embedding-ada-002
- **Offline Usage**: Sentence Transformers models
- **Best Accuracy**: text-embedding-ada-002

## Conclusion

The choice of embedding model depends on your specific requirements:

- If you need fast, local processing for English text, use all-MiniLM-L6-v2
- If you need multilingual support with good performance, use paraphrase-multilingual-MiniLM-L12-v2
- If you need the highest accuracy and don't mind using an API, use text-embedding-ada-002

Our application allows you to switch between these models to compare their performance on your specific texts. 