import React from 'react';
import Sidenav from "../Sidenav";
import { Box, Typography, Container, Paper, Link } from '@mui/material';
import DownloadButton from '../DownloadButton'
import BiologyContent from './Content/BiologyContent'
import SummarizeButton from '../SummarizeButton';

const drawerWidth = 240;  // Add this line to define drawerWidth

const Biology = () => {
    const handleDownloadPDF = () => {
      // Logic for downloading PDF
      alert('Downloading PDF...');
    };
    const handleSummarize = () => {
      // Logic for downloading PDF
      alert('Summarizing...');
    };
  return (
    <>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: `${drawerWidth}px` }, display: 'flex', justifyContent: 'center' }}>
        <Container>
          <Paper elevation={3} sx={{ p: 3, position: 'relative'}}>
            {/* Button positioned top right */}
            <Box sx={{ position: 'absolute', top: -70, right: -15, m: 2 }}>
              <SummarizeButton onClick={handleSummarize} />
            </Box>
            <Box sx={{ position: 'absolute', top: 0, right: 0, m: 2 }}>
              <DownloadButton onClick={handleDownloadPDF} />
            </Box>
             <BiologyContent />
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Biology;



