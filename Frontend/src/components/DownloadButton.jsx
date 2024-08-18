// Button.jsx
import React from 'react';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const DownloadButton = ({ onClick }) => {
  return (
    <Button 
      variant="contained" 
      color="primary"
      disableElevation
      style={{ 
        width: '30px',
        height: '30px',
        backgroundColor: '#f2f2f2', 
        color: '#bfbfbf',
        padding: '4px 8px', // Adjust padding to make it smaller
        fontSize: '12px', // Adjust font size
        minWidth: 'auto' // Remove minimum width constraint
      }} 
      onClick={onClick}
    >
      
      <FileDownloadIcon style={{ fontSize: '18px'}} /> 
    
    </Button>
  );
};
export default DownloadButton;
