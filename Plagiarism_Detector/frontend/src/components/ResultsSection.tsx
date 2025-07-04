import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, Colors } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Colors);

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

interface ResultsSectionProps {
  results: PlagiarismResponse;
  texts: TextItem[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results, texts }) => {
  // Format similarity as percentage
  const formatSimilarity = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  // Get text content by ID
  const getTextContent = (id: string): string => {
    const text = texts.find(t => t.id === id);
    if (!text) return '';
    
    // Truncate long texts for display
    const maxLength = 50;
    return text.content.length > maxLength
      ? `${text.content.substring(0, maxLength)}...`
      : text.content;
  };

  // Prepare chart data
  const chartData = {
    labels: results.pairs.map(pair => `${pair.id1.replace('text', '#')} & ${pair.id2.replace('text', '#')}`),
    datasets: [
      {
        label: 'Similarity Score',
        data: results.pairs.map(pair => parseFloat((pair.similarity * 100).toFixed(2))),
        backgroundColor: results.pairs.map(pair => 
          pair.is_potential_clone ? 'rgba(255, 99, 132, 0.8)' : 'rgba(54, 162, 235, 0.8)'
        ),
        borderColor: results.pairs.map(pair => 
          pair.is_potential_clone ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Similarity Scores Between Text Pairs',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Similarity: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Similarity (%)'
        }
      }
    },
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Analysis Results
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Model used: {results.model_used}
      </Typography>

      {/* Similarity Chart */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Similarity Chart
        </Typography>
        <Box sx={{ height: 400 }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </Paper>

      {/* Similarity Matrix */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Similarity Matrix
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Text</TableCell>
                {results.text_ids.map(id => (
                  <TableCell key={id}>{id.replace('text', 'Text ')}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.similarity_matrix.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>{results.text_ids[rowIndex].replace('text', 'Text ')}</TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell 
                      key={cellIndex}
                      sx={{
                        backgroundColor: rowIndex !== cellIndex && cell >= 0.8 
                          ? 'rgba(255, 99, 132, 0.1)' 
                          : 'inherit',
                        fontWeight: rowIndex !== cellIndex && cell >= 0.8 ? 'bold' : 'normal',
                      }}
                    >
                      {formatSimilarity(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Potential Clones */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Potential Clones
        </Typography>
        
        {results.pairs.filter(pair => pair.is_potential_clone).length === 0 ? (
          <Typography>No potential clones detected.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Text Pair</TableCell>
                  <TableCell>Similarity</TableCell>
                  <TableCell>Preview</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.pairs
                  .filter(pair => pair.is_potential_clone)
                  .map((pair, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {pair.id1.replace('text', 'Text ')} & {pair.id2.replace('text', 'Text ')}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={formatSimilarity(pair.similarity)} 
                          color="error" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>{pair.id1.replace('text', 'Text ')}:</strong> {getTextContent(pair.id1)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>{pair.id2.replace('text', 'Text ')}:</strong> {getTextContent(pair.id2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ResultsSection; 