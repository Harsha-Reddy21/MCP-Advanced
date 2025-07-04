# How Embeddings Detect Plagiarism

This document explains the technical approach behind using embeddings for plagiarism detection in our application.

## Understanding Text Embeddings

Text embeddings are vector representations of text that capture semantic meaning. Unlike traditional string-matching approaches that look for exact matches, embeddings represent the meaning and context of text in a high-dimensional vector space.

### Key Properties of Embeddings

1. **Semantic Understanding**: Embeddings capture the meaning of words and phrases, not just their literal form.
2. **Contextual Awareness**: Modern embedding models understand words in context.
3. **Language Agnostic**: Many embedding models work across multiple languages.
4. **Dimensionality Reduction**: Complex language is reduced to fixed-length vectors (typically 384-1536 dimensions).

## How Our Plagiarism Detection Works

### 1. Text Preprocessing

Before generating embeddings, we perform basic preprocessing:
- Converting text to lowercase
- Removing excessive whitespace
- (Optional) Removing punctuation and special characters

### 2. Embedding Generation

We support multiple embedding models:

- **Sentence Transformers**: Open-source models like `all-MiniLM-L6-v2` that generate fixed-size embeddings (384 dimensions)
- **Multilingual Models**: Models like `paraphrase-multilingual-MiniLM-L12-v2` that work across languages
- **OpenAI Embeddings**: Commercial embeddings like `text-embedding-ada-002` (1536 dimensions)

Each model has different strengths:
- Some are better at capturing subtle paraphrasing
- Others excel at cross-lingual plagiarism detection
- Some balance performance and computational efficiency

### 3. Similarity Calculation

Once we have embeddings for each text, we calculate similarity using **cosine similarity**:

```
similarity = (A · B) / (||A|| * ||B||)
```

Where:
- A and B are embedding vectors
- A · B is the dot product
- ||A|| and ||B|| are the magnitudes of the vectors

Cosine similarity measures the cosine of the angle between vectors, resulting in values between -1 and 1:
- 1 means identical semantic meaning
- 0 means unrelated content
- -1 means opposite meaning (rare in practice)

### 4. Plagiarism Detection

We use a configurable threshold (default: 0.8 or 80%) to identify potential plagiarism:

- **High Similarity (>80%)**: Likely plagiarism or very similar content
- **Medium Similarity (50-80%)**: Possible paraphrasing or shared concepts
- **Low Similarity (<50%)**: Likely different content

## Advantages Over Traditional Methods

1. **Paraphrase Detection**: Catches rewording that would evade exact-match detection
2. **Cross-language Detection**: Can identify translated plagiarism
3. **Concept Matching**: Identifies when the same ideas are presented differently
4. **Robustness**: Less affected by minor edits, word reordering, or synonym substitution

## Limitations

1. **Short Text**: Less reliable with very short texts (few sentences)
2. **Highly Technical Content**: May struggle with specialized terminology
3. **False Positives**: Common phrases or standard definitions may trigger high similarity
4. **Model Biases**: Embedding models inherit biases from their training data

## Practical Example

Consider these two texts:

**Text 1**: "The quick brown fox jumps over the lazy dog."
**Text 2**: "A fast auburn fox leaps above the inactive canine."

Traditional string matching would find little similarity, but embedding-based detection would identify these as highly similar because they express the same concept with different words.

## Conclusion

Embedding-based plagiarism detection represents a significant advancement over traditional methods by focusing on meaning rather than exact matches. By using multiple models and configurable thresholds, our application provides a powerful and flexible tool for identifying potential plagiarism across various contexts and languages. 