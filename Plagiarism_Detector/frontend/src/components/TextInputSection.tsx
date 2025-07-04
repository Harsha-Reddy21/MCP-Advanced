import React from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface TextItem {
  id: string;
  content: string;
}

interface TextInputSectionProps {
  texts: TextItem[];
  onTextChange: (id: string, content: string) => void;
  onAddText: () => void;
  onRemoveText: (id: string) => void;
}

const TextInputSection: React.FC<TextInputSectionProps> = ({
  texts,
  onTextChange,
  onAddText,
  onRemoveText,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Text Inputs</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddText}
        >
          Add Text
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {texts.map((text) => (
          <Grid item xs={12} key={text.id}>
            <Box sx={{ display: 'flex', alignItems: 'start' }}>
              <TextField
                label={`Text ${text.id.replace('text', '')}`}
                multiline
                rows={6}
                fullWidth
                value={text.content}
                onChange={(e) => onTextChange(text.id, e.target.value)}
                variant="outlined"
                placeholder="Enter text to compare..."
              />
              <IconButton
                color="error"
                onClick={() => onRemoveText(text.id)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default TextInputSection; 