import React, { useEffect, useState } from "react";
import Sidenav from "../Sidenav";
import {
  Typography,
  Box,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import DownloadButton from '../DownloadButton'; // Adjust the import path if needed
import SummarizeButton from '../SummarizeButton'; // Adjust the import path if needed

const drawerWidth = 240; // Define drawerWidth

const Notes = () => {
  const { courseId, courseName } = useParams();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (courseId) {
      axios
        .get(`http://localhost:8000/notes/get/${courseName}`, {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setNotes(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError("Course ID is missing.");
      setLoading(false);
    }
  }, [courseId, courseName]);

  // const handleDownloadPDF = (noteId) => {
  //   // Logic for downloading PDF
  //   alert(`Downloading PDF for note ID: ${noteId}`);
  // };

  

  const handleDownloadPDF = (noteId) => {
    // Replace with your actual static file URL
    const pdfUrl = `http://localhost:3000/notes/${noteId}.pdf`; // Update if using Express
  
    // Create a link element
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', `note_${noteId}.pdf`);
  
    // Append link to the body and trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.remove();
  };
  
  
  const handleSummarize = (noteId) => {
    // Logic for summarizing
    alert(`Summarizing note ID: ${noteId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Sidenav />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: `${drawerWidth}px` },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Container>
          {notes.length === 0 ? (
            <Typography>No notes available.</Typography>
          ) : (
            <Box>
              {notes.map((note) => (
                <Paper
                  key={note._id}
                  elevation={3}
                  sx={{
                    p: 3,
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: '8px', // Optional: Add rounded corners
                  }}
                >
                  {/* Buttons positioned top right */}
                  <Box sx={{ position: 'absolute', top: 10, right: 50 }}>
                    <SummarizeButton onClick={() => handleSummarize(note._id)} />
                  </Box>
                  <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <DownloadButton onClick={() => handleDownloadPDF(note._id)} />
                  </Box>
                  
                  <Typography variant="h6" component="div">
                    {note.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {note.content}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Notes;
