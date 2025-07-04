import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
  Alert,
} from '@mui/material';
import axios from 'axios';
import TextInputSection from './TextInputSection';
import ResultsSection from './ResultsSection';

// Define interfaces for our data structures
interface TextItem {
  id: string;
  content: string;
}

interface SimilarityPair {
  id1: string;
  id2: string;
  similarity: number;
  is_potential_clone: boolean;
}

interface PlagiarismResponse {
  similarity_matrix: number[][];
  text_ids: string[];
  pairs: SimilarityPair[];
  model_used: string;
}

const PlagiarismDetector: React.FC = () => {
  // State for text inputs
  const [texts, setTexts] = useState<TextItem[]>([
    { id: 'text1', content: '' },
    { id: 'text2', content: '' },
  ]);

  // State for selected model and threshold
  const [selectedModel, setSelectedModel] = useState<string>('sentence-transformers/all-MiniLM-L6-v2');
  const [threshold, setThreshold] = useState<number>(0.8);
  
  // State for available models
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  
  // State for API interaction
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PlagiarismResponse | null>(null);

  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('http://localhost:8000/models');
        setAvailableModels(response.data.models);
      } catch (err) {
        console.error('Failed to fetch models:', err);
        setError('Failed to fetch available models. Please make sure the backend server is running.');
      }
    };

    fetchModels();
  }, []);

  // Handle adding a new text input
  const handleAddText = () => {
    setTexts([...texts, { id: `text${texts.length + 1}`, content: '' }]);
  };

  // Handle removing a text input
  const handleRemoveText = (id: string) => {
    if (texts.length <= 2) {
      setError('At least 2 texts are required for comparison.');
      return;
    }
    setTexts(texts.filter(text => text.id !== id));
  };

  // Handle text content change
  const handleTextChange = (id: string, content: string) => {
    setTexts(texts.map(text => (text.id === id ? { ...text, content } : text)));
  };

  // Handle model selection change
  const handleModelChange = (event: SelectChangeEvent) => {
    setSelectedModel(event.target.value);
  };

  // Handle threshold change
  const handleThresholdChange = (_event: Event, newValue: number | number[]) => {
    setThreshold(newValue as number);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate inputs
    const emptyTexts = texts.filter(text => !text.content.trim());
    if (emptyTexts.length > 0) {
      setError('All text fields must be filled.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<PlagiarismResponse>('http://localhost:8000/detect-plagiarism', {
        texts,
        model: selectedModel,
        threshold,
      });

      setResults(response.data);
    } catch (err) {
      console.error('Error detecting plagiarism:', err);
      setError('Failed to detect plagiarism. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="model-select-label">Embedding Model</InputLabel>
              <Select
                labelId="model-select-label"
                id="model-select"
                value={selectedModel}
                label="Embedding Model"
                onChange={handleModelChange}
              >
                {availableModels.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Plagiarism Threshold: {threshold}</Typography>
            <Slider
              value={threshold}
              onChange={handleThresholdChange}
              aria-labelledby="threshold-slider"
              step={0.05}
              marks
              min={0.5}
              max={1}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Paper>

      <TextInputSection
        texts={texts}
        onTextChange={handleTextChange}
        onAddText={handleAddText}
        onRemoveText={handleRemoveText}
      />

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ px: 4, py: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze for Plagiarism'}
        </Button>
      </Box>

      {results && <ResultsSection results={results} texts={texts} />}
    </Box>
  );
};

export default PlagiarismDetector; 