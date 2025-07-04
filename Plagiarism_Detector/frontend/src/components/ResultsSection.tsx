import React from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Box,
  Alert,
  Divider,
  Chip
} from '@mui/material';

interface PlagiarismResult {
  text1_index: number;
  text2_index: number;
  similarity: number;
}

interface ResultsSectionProps {
  similarityMatrix: number[][] | null;
  potentialPlagiarism: PlagiarismResult[] | null;
  modelUsed: string | null;
  texts: string[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  similarityMatrix, 
  potentialPlagiarism, 
  modelUsed,
  texts
}) => {
  if (!similarityMatrix || !potentialPlagiarism) {
    return null;
  }

  // Format percentage for display
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  // Get color based on similarity value
  const getSimilarityColor = (value: number): string => {
    if (value >= 0.8) return '#f44336'; // Red for high similarity
    if (value >= 0.5) return '#ff9800'; // Orange for medium similarity
    return '#4caf50'; // Green for low similarity
  };

  // Get background color with opacity for cells
  const getBackgroundColor = (value: number): string => {
    const color = getSimilarityColor(value);
    return `${color}33`; // Add 20% opacity
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Analysis Results
      </Typography>
      
      {modelUsed && (
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Model Used: <Chip label={modelUsed} color="primary" size="small" />
          </Typography>
        </Box>
      )}

      {/* Similarity Matrix */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
        Similarity Matrix
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ marginBottom: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Text</TableCell>
              {texts.map((_, index) => (
                <TableCell key={index} align="center">Text {index + 1}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {similarityMatrix.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell component="th" scope="row">Text {rowIndex + 1}</TableCell>
                {row.map((cell, cellIndex) => (
                  <TableCell 
                    key={cellIndex} 
                    align="center"
                    sx={{
                      backgroundColor: rowIndex !== cellIndex ? getBackgroundColor(cell) : '#f5f5f5',
                      fontWeight: rowIndex !== cellIndex && cell >= 0.8 ? 'bold' : 'normal',
                    }}
                  >
                    {rowIndex === cellIndex ? '-' : formatPercentage(cell)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Potential Plagiarism Results */}
      <Typography variant="h6" gutterBottom>
        Potential Plagiarism Detected
      </Typography>
      
      {potentialPlagiarism.length > 0 ? (
        <Box>
          {potentialPlagiarism.map((result, index) => (
            <Alert 
              key={index} 
              severity="warning" 
              sx={{ marginBottom: 2 }}
            >
              <Typography variant="body1">
                <strong>Text {result.text1_index + 1}</strong> and <strong>Text {result.text2_index + 1}</strong> have a similarity of <strong>{formatPercentage(result.similarity)}</strong>
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="textSecondary">Text {result.text1_index + 1}:</Typography>
                  <Typography variant="body2" sx={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: 1, 
                    borderRadius: 1,
                    maxHeight: '100px',
                    overflow: 'auto'
                  }}>
                    {texts[result.text1_index]}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="textSecondary">Text {result.text2_index + 1}:</Typography>
                  <Typography variant="body2" sx={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: 1, 
                    borderRadius: 1,
                    maxHeight: '100px',
                    overflow: 'auto'
                  }}>
                    {texts[result.text2_index]}
                  </Typography>
                </Box>
              </Box>
            </Alert>
          ))}
        </Box>
      ) : (
        <Alert severity="success">No potential plagiarism detected.</Alert>
      )}
      
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="body2" color="textSecondary">
          Note: Similarity scores above 80% may indicate potential plagiarism. However, always review the results manually as context matters.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ResultsSection; 