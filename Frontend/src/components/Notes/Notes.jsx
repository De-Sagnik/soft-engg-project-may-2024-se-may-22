import React, {useEffect, useState} from "react";
import Sidenav from "../Sidenav";
import {Box, Button, CircularProgress, Container, Paper, Typography,} from "@mui/material";
import {useParams} from "react-router-dom";
import axios from "axios";
import jsPDF from 'jspdf'; // Import jsPDF
import DownloadButton from '../DownloadButton'; // Adjust the import path if needed
import SummarizeButton from '../SummarizeButton'; // Adjust the import path if needed


const drawerWidth = 240; // Define drawerWidth

const Notes = () => {
    const params = useParams();
    const {courseId} = params;

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSummaryVisible, setIsSummaryVisible] = useState({});
    const [generatedQuestions, setGeneratedQuestions] = useState({});

    const stripHtmlTags = (html) => {
        // Create a temporary DOM element to parse HTML
        const tmp = document.createElement("div");
        tmp.innerHTML = html;

        // Remove specific class names and inline styles
        const elements = tmp.querySelectorAll("*");
        elements.forEach((element) => {
            element.removeAttribute("style");
            element.removeAttribute("class");
        });

        // Remove <style> and <script> tags
        const styleAndScriptTags = tmp.querySelectorAll("style, script");
        styleAndScriptTags.forEach(tag => tag.remove());

        // Get cleaned text content
        let text = tmp.textContent || tmp.innerText || "";

        // Replace multiple consecutive newlines with a maximum of two
        text = text.replace(/(\r\n|\n|\r){3,}/g, '\n\n');

        return text;
    };


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

    const handleDownloadPDF = (note) => {
        const {title, content} = note;

        // Remove HTML tags and excessive empty lines from content
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
            doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, {align: 'center'});
        };

        // Function to add footer
        const addFooter = (pageNumber) => {
            doc.setFontSize(8); // Smaller font size for footer
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(100);
            doc.text(`Page ${pageNumber}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, {align: 'right'});
        };

        // Add title page
        doc.setFontSize(24);
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(...titleColor);
        doc.text(title, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2 - 10, {align: 'center'});

        // Add a subtle line under the title
        doc.setDrawColor(...borderColor);
        doc.setLineWidth(1);
        doc.line(20, doc.internal.pageSize.getHeight() / 2 + 5, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() / 2 + 5);

        doc.addPage(); // Add new page for content

        // Set consistent font size and typeface for content
        const contentFontSize = 15; // Slightly smaller font size for content
        const lineHeight = 7; // Adjust line height for tighter spacing
        doc.setFontSize(contentFontSize);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(...contentColor);

        // Add header and footer to the first content page
        addHeader();
        addFooter(1);

        // Adjust margins and line spacing
        const margins = {top: 25, bottom: 20, left: 15, right: 15}; // Reduced margins for more content space
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
            contentY += lineHeight; // Adjust line height for tighter spacing
        });

        // Save the PDF
        doc.save(`${title}.pdf`);
    };


    const handleGenerate = async (noteId, noteContent) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}generate_questions`,
                {text: noteContent},
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
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}summarize`, {text: noteContent});
                setNotes((prevNotes) =>
                    prevNotes.map(note =>
                        note._id === noteId ? {...note, summary: response.data.summary} : note
                    )
                );
                setIsSummaryVisible((prev) => ({...prev, [noteId]: true}));
            } else {
                setIsSummaryVisible((prev) => ({...prev, [noteId]: false}));
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
            <Sidenav/>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: {sm: `${drawerWidth}px`},
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
                                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 2}}>

                                    </Box>

                                    <Box sx={{position: 'absolute', top: 10, right: 165}}>
                                        <SummarizeButton
                                            onClick={() => handleSummarize(note._id, note.content)}
                                            buttonText={isSummaryVisible[note._id] ? 'Back' : 'Summarize Notes'}
                                        />
                                    </Box>

                                    <Box sx={{position: 'absolute', top: 10, right: 50}}>
                                        {/* <Button variant="contained" onClick={handleGenerate}>
        Generate
    </Button> */}
                                        <Button variant="contained"
                                                onClick={() => handleGenerate(note._id, note.content)}>
                                            Generate Questions
                                        </Button>

                                    </Box>

                                    <Box sx={{position: 'absolute', top: 14, right: 10}}>
                                        <DownloadButton onClick={() => handleDownloadPDF(note)}/>
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
                                                height="515"
                                                src={`https://www.youtube.com/embed/${new URL(note.url).searchParams.get('v')}`}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen>
                                            </iframe>
                                        </Box>
                                    )}
                                    <br></br> <br></br>

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
                                            dangerouslySetInnerHTML={{__html: note.content}}
                                        />

                                    )}


                                    {generatedQuestions[note._id] && generatedQuestions[note._id].length > 0 && (
                                        <Box mt={2} sx={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            p: 2,
                                            bgcolor: '#f9f9f9'
                                        }}>
                                            <Typography variant="h6" gutterBottom>
                                                Generated Questions:
                                            </Typography>
                                            {generatedQuestions[note._id].map((item, index) => (
                                                <Box key={index} sx={{
                                                    mb: 3,
                                                    p: 2,
                                                    borderBottom: index < generatedQuestions[note._id].length - 1 ? '1px solid #ddd' : 'none'
                                                }}>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        Question:
                                                    </Typography>
                                                    <Typography variant="body2" mb={2}>
                                                        {item.question}
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        Options:
                                                    </Typography>
                                                    <Box component="ul" sx={{pl: 2, mb: 2}}>
                                                        <Typography component="li" variant="body2"
                                                                    sx={{display: 'list-item'}}>
                                                            {item.option1}
                                                        </Typography>
                                                        <Typography component="li" variant="body2"
                                                                    sx={{display: 'list-item'}}>
                                                            {item.option2}
                                                        </Typography>
                                                        <Typography component="li" variant="body2"
                                                                    sx={{display: 'list-item'}}>
                                                            {item.option3}
                                                        </Typography>
                                                        <Typography component="li" variant="body2"
                                                                    sx={{display: 'list-item'}}>
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
