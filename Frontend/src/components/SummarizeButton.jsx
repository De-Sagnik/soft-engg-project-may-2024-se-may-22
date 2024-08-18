// Button.jsx
import React from 'react';
import { Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const SummarizeButton = ({ onClick }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
    Summarize 
    </Button>
  );
};

export default SummarizeButton;
