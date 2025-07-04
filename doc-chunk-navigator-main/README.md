# Document Chunking Strategy Visualizer

A React application that visualizes different document chunking strategies for Retrieval Augmented Generation (RAG) systems.

## Overview

This tool allows users to:
- Upload PDF documents (simulation only in demo version)
- Visualize different document chunking strategies
- Compare chunking approaches side-by-side
- Understand the pros and cons of each strategy

## Chunking Strategies Implemented

1. **Fixed Size Chunking**: Divides text into chunks of predetermined size
2. **Semantic Chunking**: Preserves meaning by breaking text at natural boundaries
3. **Sentence-based Chunking**: Splits text at sentence boundaries
4. **Paragraph-based Chunking**: Divides text based on paragraph boundaries
5. **Sliding Window**: Creates overlapping chunks to preserve context
6. **Recursive Character Splitting**: Hierarchically splits text using multiple separators

## Features

- Interactive PDF uploader (simulated in demo)
- Customizable chunk size and overlap parameters
- Visual comparison of different chunking strategies
- Detailed chunk visualization and statistics
- Comprehensive explanation of each strategy's pros, cons, and use cases

## Technology Stack

- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn UI component library
- React Router for navigation
- React Query for data fetching

## Getting Started

### Prerequisites

- Node.js 16+ or Bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/doc-chunk-navigator.git
cd doc-chunk-navigator

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The application will be available at http://localhost:5173

## Usage

1. Upload a PDF document using the uploader component
2. Adjust the global chunk settings (size and overlap)
3. Compare different chunking strategies in the visualization section
4. Select individual chunks to view their details
5. Read about the pros and cons of each strategy in the explanation section

## Why Document Chunking Matters

Effective document chunking is crucial for RAG systems as it directly impacts:
- Retrieval accuracy
- Context preservation
- Processing efficiency
- Memory usage

This tool helps developers understand and experiment with different chunking approaches to optimize their RAG pipelines.

## License

[MIT License](LICENSE)
