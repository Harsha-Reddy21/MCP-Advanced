import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, FormControl, InputLabel, Select, MenuItem, Paper, CircularProgress, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TextInputSection from './TextInputSection';
import ResultsSection from './ResultsSection';

interface Model {
  name: string;
  display_name: string;
  type: 'sentence_transformers' | 'openai';
}

interface AnalysisResult {
  similarity_matrix: number[][];
  potential_plagiarism: {
    text1_index: number;
    text2_index: number;
    similarity: number;
  }[];
  model_used: string;
}

const PlagiarismDetector: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('sentence-transformers/all-MiniLM-L6-v2');
  const [useOpenAI, setUseOpenAI] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [texts, setTexts] = useState<string[]>([]);
  
  // API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get(`${API_URL}/models`);
        const modelsList: Model[] = [];
        
        // Process sentence transformers models
        response.data.sentence_transformers.forEach((model: string) => {
          modelsList.push({
            name: model,
            display_name: model.split('/').pop() || model,
            type: 'sentence_transformers'
          });
        });
        
        // Process OpenAI models
        response.data.openai.forEach((model: string) => {
          modelsList.push({
            name: model,
            display_name: `OpenAI: ${model}`,
            type: 'openai'
          });
        });
        
        setModels(modelsList);
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error('Failed to fetch available models. Using default models.');
      }
    };

    fetchModels();
  }, [API_URL]);

  const handleModelChange = (event: SelectChangeEvent) => {
    const modelName = event.target.value;
    setSelectedModel(modelName);
    
    // Check if it's an OpenAI model
    const model = models.find(m => m.name === modelName);
    setUseOpenAI(model?.type === 'openai');
  };

  const handleAnalyze = async (textInputs: string[]) => {
    setIsLoading(true);
    setTexts(textInputs);
    
    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        texts: textInputs,
        model_name: selectedModel,
        use_openai: useOpenAI
      });
      
      setAnalysisResult(response.data);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Error during analysis:', error);
      toast.error('Failed to analyze texts. Please try again.');
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <Box className="header" sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Plagiarism Detector
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Semantic Similarity Analyzer
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Model Selection
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="model-select-label">Embedding Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={selectedModel}
            label="Embedding Model"
            onChange={handleModelChange}
            disabled={isLoading}
          >
            {models.map((model) => (
              <MenuItem key={model.name} value={model.name}>
                {model.display_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
      
      <TextInputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {analysisResult && (
        <ResultsSection 
          similarityMatrix={analysisResult.similarity_matrix}
          potentialPlagiarism={analysisResult.potential_plagiarism}
          modelUsed={analysisResult.model_used}
          texts={texts}
        />
      )}
    </Container>
  );
};

export default PlagiarismDetector; 