// Button.jsx
import React from 'react';
import { Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const FlashcardGenerateButton = ({ onClick }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
    Generate 
    </Button>
  );
};

export default FlashcardGenerateButton;
