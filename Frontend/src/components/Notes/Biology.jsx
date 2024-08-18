import React, { useEffect, useState } from "react";
import Sidenav from "../Sidenav";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Button,
  Container,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

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

  const handleDownloadPDF = (noteId) => {
    // Logic for downloading PDF specific to the note
    alert(`Downloading PDF for note ${noteId}...`);
  };

  const handleSummarize = (noteId) => {
    // Logic for summarizing specific to the note
    alert(`Summarizing note ${noteId}...`);
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
                  <Typography variant="h6" component="div">
                    {note.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {note.content}
                  </Typography>

                  {/* Buttons positioned at the bottom */}
                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDownloadPDF(note._id)}
                    >
                      Download PDF
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleSummarize(note._id)}
                    >
                      Summarize
                    </Button>
                  </Box>
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
