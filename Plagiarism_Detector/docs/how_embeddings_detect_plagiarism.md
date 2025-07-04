# How Embeddings Detect Plagiarism

## Introduction to Semantic Similarity

Traditional plagiarism detection often relies on exact string matching or simple lexical features, which can be easily circumvented by paraphrasing, word substitution, or sentence restructuring. Modern approaches use semantic embeddings to capture the meaning of text, not just its surface form.

## What are Text Embeddings?

Text embeddings are dense vector representations of text that capture semantic meaning. Unlike simple bag-of-words approaches, embeddings place semantically similar words or phrases closer together in a high-dimensional vector space. This means:

- Similar concepts are represented by vectors that are close to each other
- Different concepts are represented by vectors that are far apart
- The relationships between concepts are preserved in the vector space

## How Embeddings Work for Plagiarism Detection

1. **Text Preprocessing**: Each text is cleaned and normalized
2. **Embedding Generation**: Each text is converted into a vector representation using a pre-trained model
3. **Similarity Calculation**: Cosine similarity is calculated between vectors
4. **Threshold Application**: Pairs with similarity above a certain threshold are flagged as potential plagiarism

## Advantages of Embedding-Based Detection

- **Paraphrase Detection**: Can detect plagiarism even when words are changed but meaning remains similar
- **Language Agnostic**: Some models work across multiple languages
- **Robust to Minor Edits**: Small changes to text won't significantly alter the embedding
- **Context Awareness**: Considers the context in which words appear, not just the words themselves

## Embedding Models Used in This Application

### Sentence Transformers

Sentence Transformers are neural network models specifically designed to generate embeddings for sentences or paragraphs. They're fine-tuned on tasks like natural language inference and semantic similarity.

Benefits:
- Open-source and locally deployable
- Multiple model sizes available (speed vs. accuracy tradeoff)
- Support for 50+ languages in multilingual models

### OpenAI Embeddings

OpenAI's embedding models (like text-embedding-ada-002) are trained on vast amounts of text data and provide high-quality semantic representations.

Benefits:
- State-of-the-art performance
- Regularly updated with new knowledge
- Robust to various text formats and domains

## Cosine Similarity

Cosine similarity measures the cosine of the angle between two vectors, producing a value between -1 and 1 (though with text embeddings, values are typically between 0 and 1):

- 1 means identical semantic meaning
- 0 means completely unrelated
- Values close to 1 indicate potential plagiarism

The formula for cosine similarity is:

```
cosine_similarity(A, B) = (A · B) / (||A|| * ||B||)
```

Where:
- A · B is the dot product of vectors A and B
- ||A|| and ||B|| are the magnitudes (Euclidean norms) of vectors A and B

## Limitations

- **Conceptual Similarity vs. Plagiarism**: High similarity might indicate similar topics, not necessarily plagiarism
- **Short Text Challenges**: Very short texts may not provide enough context for reliable embeddings
- **Domain Specificity**: General-purpose embeddings may miss nuances in specialized domains
- **Threshold Selection**: Choosing the right similarity threshold requires balancing precision and recall

## Practical Considerations

When using this plagiarism detector:

1. **Threshold Tuning**: Adjust the similarity threshold based on your specific needs
2. **Model Selection**: Different embedding models have different strengths
3. **Text Length**: Provide sufficient text for reliable analysis
4. **Human Verification**: Always have a human expert verify potential plagiarism cases 