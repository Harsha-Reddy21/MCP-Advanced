# Plagiarism Detector Frontend

This is the frontend application for the Plagiarism Detector. It provides a user interface for comparing texts and visualizing similarity results.

## Features

- Dynamic text input boxes for multiple text samples
- Embedding model selection
- Similarity matrix visualization
- Potential plagiarism highlighting
- Responsive design

## Technologies Used

- React
- TypeScript
- Material-UI
- Axios for API communication
- React-Toastify for notifications

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory (optional):
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will be available at http://localhost:3000.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Component Structure

- **App**: Main application component with theme configuration
- **PlagiarismDetector**: Main container component that manages state and API calls
- **TextInputSection**: Handles text input fields and submission
- **ResultsSection**: Displays similarity matrix and potential plagiarism results

## API Integration

The frontend communicates with the backend API to:

1. Fetch available embedding models
2. Submit texts for analysis
3. Display similarity results and potential plagiarism

## Environment Variables

- `REACT_APP_API_URL`: URL of the backend API (defaults to http://localhost:8000) 