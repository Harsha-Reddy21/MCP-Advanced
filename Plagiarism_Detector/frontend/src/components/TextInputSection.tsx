import React, { useState } from 'react';
import { Button, TextField, IconButton, Box, Typography, Paper } from '@mui/material';

interface TextInputSectionProps {
  onAnalyze: (texts: string[]) => void;
  isLoading: boolean;
}

const TextInputSection: React.FC<TextInputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [texts, setTexts] = useState<string[]>(['', '']);

  const handleTextChange = (index: number, value: string) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const addTextInput = () => {
    setTexts([...texts, '']);
  };

  const removeTextInput = (index: number) => {
    if (texts.length <= 2) {
      return; // Keep at least 2 text inputs
    }
    const newTexts = texts.filter((_, i) => i !== index);
    setTexts(newTexts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredTexts = texts.filter(text => text.trim() !== '');
    if (filteredTexts.length < 2) {
      alert('Please provide at least two texts to compare.');
      return;
    }
    onAnalyze(filteredTexts);
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Text Inputs
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Enter at least two texts to compare for plagiarism detection.
      </Typography>
      
      <form onSubmit={handleSubmit}>
        {texts.map((text, index) => (
          <Box key={index} sx={{ display: 'flex', marginBottom: 2, alignItems: 'flex-start' }}>
            <TextField
              label={`Text ${index + 1}`}
              multiline
              rows={4}
              value={text}
              onChange={(e) => handleTextChange(index, e.target.value)}
              fullWidth
              variant="outlined"
              placeholder={`Enter text sample ${index + 1} here...`}
              sx={{ marginRight: 1 }}
            />
            <Button 
              onClick={() => removeTextInput(index)}
              disabled={texts.length <= 2}
              color="error"
              variant="outlined"
              sx={{ mt: 1, minWidth: '30px', height: '40px' }}
            >
              X
            </Button>
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button 
            variant="outlined" 
            onClick={addTextInput}
            sx={{ marginRight: 1 }}
          >
            Add Text Input
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Texts'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TextInputSection; 