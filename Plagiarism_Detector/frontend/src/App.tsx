import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import PlagiarismDetector from './components/PlagiarismDetector';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlagiarismDetector />
    </ThemeProvider>
  );
}

export default App; 