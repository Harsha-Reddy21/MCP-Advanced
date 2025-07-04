import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box } from '@mui/material';
import PlagiarismDetector from './components/PlagiarismDetector';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Plagiarism Detector
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center" color="textSecondary">
            Semantic Similarity Analyzer
          </Typography>
          <PlagiarismDetector />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
