import React, {useEffect, useState} from "react";
import Sidenav from "../Sidenav";
import {Box, CircularProgress, Container, Paper, Typography,} from "@mui/material";
import {useParams} from "react-router-dom";
import axios from "axios";
import jsPDF from 'jspdf'; // Import jsPDF
import DownloadButton from '../DownloadButton'; // Adjust the import path if needed
import SummarizeButton from '../SummarizeButton'; // Adjust the import path if needed
import { Button } from '@mui/material';
import GenerateButton from './GenerateButton'; // Adjust the import path



const drawerWidth = 240; // Define drawerWidth

const Notes = () => {
    const params = useParams();
    const {courseId} = params;

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSummaryVisible, setIsSummaryVisible] = useState({});
    const [generatedQuestions, setGeneratedQuestions] = useState({});



    useEffect(() => {
        if (courseId) {
            axios
                .get(`http://localhost:8000/notes/get/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("token"),
                    },
                })
                .then((res) => {
                    setNotes(res.data);
                    setLoading(false);
                    console.log("YEH", res.data)
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







    // const handleDownloadPDF = (note) => {
    //     const {title, content} = note;

    //     // Create a new jsPDF instance
    //     const doc = new jsPDF();

    //     // Define colors
    //     const titleColor = [0, 102, 204]; // Blue color for title
    //     const contentColor = [0, 0, 0]; // Light blue color for content
    //     const borderColor = [200, 220, 255]; // Light blue border color

    //     // Set title font and color
    //     doc.setFontSize(20);
    //     doc.setFont("Helvetica", "bold");
    //     doc.setTextColor(...titleColor);

    //     // Add title with background color and border
    //     const titleWidth = doc.getTextWidth(title);
    //     const pageWidth = doc.internal.pageSize.getWidth();
    //     const titleX = (pageWidth - titleWidth) / 2; // Center title

    //     // Draw title background
    //     doc.setFillColor(...borderColor);
    //     doc.rect(titleX - 10, 15, titleWidth + 20, 20, 'F');

    //     // Add title text
    //     doc.text(title, titleX, 25);

    //     // Set font and color for content
    //     doc.setFontSize(12);
    //     doc.setFont("Helvetica", "normal");
    //     doc.setTextColor(...contentColor);

    //     // Add content
    //     const margins = {top: 50, left: 20};
    //     const contentX = margins.left;
    //     let contentY = margins.top;

    //     // Split content into lines that fit the page width
    //     const lines = doc.splitTextToSize(content, pageWidth - margins.left * 2);

    //     // Add each line to the PDF, ensuring it fits within the margins
    //     lines.forEach((line) => {
    //         if (contentY > doc.internal.pageSize.height - margins.top) {
    //             doc.addPage();
    //             contentY = margins.top;
    //         }
    //         doc.text(line, contentX, contentY);
    //         contentY += 10; // Adjust line height
    //     });

    //     // Save the PDF
    //     doc.save(`${title}.pdf`);
    // };

    const handleDownloadPDF = (note) => {
      const { title, content } = note;
  
      // Function to remove HTML tags
      const stripHtmlTags = (html) => {
          const tmp = document.createElement("div");
          tmp.innerHTML = html;
          return tmp.textContent || tmp.innerText || "";
      };
  
      // Remove HTML tags from content
      const cleanedContent = stripHtmlTags(content);
  
      // Create a new jsPDF instance
      const doc = new jsPDF();
  
      // Define colors and fonts
      const titleColor = [33, 37, 41]; // Dark grey color for title
      const contentColor = [102, 102, 102]; // Gray color for content
      const borderColor = [200, 220, 255]; // Light blue border color
  
      // Function to add header
      const addHeader = () => {
          doc.setFontSize(16);
          doc.setFont("Helvetica", "bold");
          doc.setTextColor(...titleColor);
          doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      };
  
      // Function to add footer
      const addFooter = (pageNumber) => {
          doc.setFontSize(10);
          doc.setFont("Helvetica", "normal");
          doc.setTextColor(100);
          doc.text(`Page ${pageNumber}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
      };
  
      // Add title page
      doc.setFontSize(20); // Slightly increased font size for title page
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(...titleColor);
      doc.text(title, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2 - 10, { align: 'center' });
  
      // Add a subtle line under the title
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(1);
      doc.line(20, doc.internal.pageSize.getHeight() / 2 + 5, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() / 2 + 5);
  
      doc.addPage(); // Add new page for content
  
      // Set consistent font size and typeface for content
      const contentFontSize = 12; // Slightly increased font size for content
      doc.setFontSize(contentFontSize);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(...contentColor);
  
      // Add header and footer to the first content page
      addHeader();
      addFooter(1);
  
      // Adjust margins and line spacing
      const margins = { top: 20, bottom: 20, left: 20, right: 20 }; // Reduced top margin for less gap
      const contentX = margins.left;
      let contentY = margins.top;
      let pageNumber = 1;
  
      // Split content into lines that fit the page width
      const pageWidth = doc.internal.pageSize.getWidth();
      const lines = doc.splitTextToSize(cleanedContent, pageWidth - margins.left - margins.right);
  
      // Add each line to the PDF, ensuring it fits within the margins
      lines.forEach((line) => {
          if (contentY > doc.internal.pageSize.getHeight() - margins.bottom) {
              doc.addPage();
              contentY = margins.top;
              pageNumber += 1;
              addHeader();
              addFooter(pageNumber);
          }
          doc.text(line, contentX, contentY);
          contentY += contentFontSize * 1.2; // Adjusted line height for closer spacing
      });
  
      // Save the PDF
      doc.save(`${title}.pdf`);
  };
  
  
  


const handleGenerate = async (noteId, noteContent) => {
  try {
      const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}generate_questions`, 
          { text: noteContent },
          {
              headers: {
                  Authorization: `Bearer ` + localStorage.getItem("token"),
              }
          }
      );

      // Log the response data to see its structure
      console.log("API Response:", response);

      // Assuming response.data contains the generated questions
      console.log("Generated Questions:", response.data.questions);

      // Update the note with the returned questions
      setGeneratedQuestions((prevQuestions) => ({
          ...prevQuestions,
          [noteId]: response.data.questions, // Update with the questions for the specific note
      }));
  } catch (error) {
      console.error("Error generating questions:", error);
  }
};




const handleSummarize = async (noteId, noteContent) => {
  try {
      if (!isSummaryVisible[noteId]) {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}summarize`, { text: noteContent });
          setNotes((prevNotes) => 
              prevNotes.map(note => 
                  note._id === noteId ? { ...note, summary: response.data.summary } : note
              )
          );
          setIsSummaryVisible((prev) => ({ ...prev, [noteId]: true }));
      } else {
          setIsSummaryVisible((prev) => ({ ...prev, [noteId]: false }));
      }
  } catch (error) {
      console.error("Error summarizing note:", error);
  }
};

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
    
</Box>

<Box sx={{ position: 'absolute', top: 10, right: 165 }}>
                    <SummarizeButton 
                        onClick={() => handleSummarize(note._id, note.content)} 
                        buttonText={isSummaryVisible[note._id] ? 'Back' : 'Summarize'} 
                    />
                </Box>

<Box sx={{ position: 'absolute', top: 10, right: 50 }}>
{/* <Button variant="contained" onClick={handleGenerate}>
        Generate
    </Button> */}
    <Button variant="contained" onClick={() => handleGenerate(note._id, note.content)}>
    Generate
</Button>

    </Box>
                
                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <DownloadButton onClick={() => handleDownloadPDF(note)} />
                </Box>
            
                <Typography variant="h6" component="div">
                    {note.title}
                </Typography>

                <Typography variant="h6" component="div">
                    {/* URL: {note.url} */}
                </Typography>

                {note.url && (
    <Box mt={2}>
        <iframe 
            width="100%" 
            height="315" 
            src={`https://www.youtube.com/embed/${new URL(note.url).searchParams.get('v')}`} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
        </iframe>
    </Box>
)}

            
                {/* Conditionally render summary or content */}
                {isSummaryVisible[note._id] && note.summary ? (
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        {note.summary}
                    </Typography>
                ) : (
                    // <Typography variant="body2" color="textSecondary" mt={1}>
                    //     {note.content}
                    // </Typography>

                    <Typography 
    variant="body2" 
    color="textSecondary" 
    mt={1} 
    dangerouslySetInnerHTML={{ __html: note.content }}
/>

                )}


{generatedQuestions[note._id] && generatedQuestions[note._id].length > 0 && (
    <Box mt={2} sx={{ border: '1px solid #ddd', borderRadius: '8px', p: 2, bgcolor: '#f9f9f9' }}>
        <Typography variant="h6" gutterBottom>
            Generated Questions:
        </Typography>
        {generatedQuestions[note._id].map((item, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, borderBottom: index < generatedQuestions[note._id].length - 1 ? '1px solid #ddd' : 'none' }}>
                <Typography variant="body1" fontWeight="bold">
                    Question:
                </Typography>
                <Typography variant="body2" mb={2}>
                    {item.question}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                    Options:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ display: 'list-item' }}>
                        {item.option1}
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ display: 'list-item' }}>
                        {item.option2}
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ display: 'list-item' }}>
                        {item.option3}
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ display: 'list-item' }}>
                        {item.option4}
                    </Typography>
                </Box>
                <Typography variant="body1" fontWeight="bold">
                    Correct Option:
                </Typography>
                <Typography variant="body2">
                    {item.correct_option}
                </Typography>
            </Box>
        ))}
    </Box>
)}
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
