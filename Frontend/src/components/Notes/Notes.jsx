import React, { useEffect, useState } from "react";
import Sidenav from "../Sidenav";
import {
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const Notes = () => {
  const { courseId, courseName } = useParams(); // Use the correct parameter names

  console.log("Extracted Params:", { courseId, courseName });

  const [notes, setNotes] = useState(null);
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
  }, [courseId]);

  useEffect(() => {
    if (notes) {
      console.log("Notes:", notes);
    }
  }, [notes]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Sidenav />
      <Typography variant="h4">Notes</Typography>
      <Typography variant="h6">Course: {courseName}</Typography> {/* Display course name */}
      {notes ? (
        <Box>
          <Typography variant="h6">Title: {notes.title}</Typography>
          <Typography variant="body1">Course ID: {notes.course_id}</Typography> {/* Display course ID */}
          <Typography variant="body2">Content: {notes.content}</Typography>
        </Box>
      ) : (
        <Typography>No notes available</Typography>
      )}
    </Box>
  );
};

export default Notes;
