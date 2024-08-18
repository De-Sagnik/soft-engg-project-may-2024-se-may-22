import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Container, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Card, CardActions, CardContent, IconButton, List, ListItem, ListItemText, MenuItem, Select } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import InstructorSidenav from '../InstructorSidenav';

const drawerWidth = 240;


const InstructorNotes = () => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, subject: '', content: [], course_id: '', url: '' });
  const [editing, setEditing] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/course/getall")
      .then((res) => {
        const courseOptions = res.data.map(course => ({
          id: course.course_id,
          name: course.course_name
        }));
        setCourses(courseOptions);
      })
      .catch(err => {
        console.error("Error fetching courses:", err);
      });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    setCurrentNote({
      id: null,
      subject: '',
      content: [
        { type: 'text', value: '' },
        { type: 'title', value: '' },
        { type: 'link', value: '' },
        // Add other types as needed
      ],
      course_id: '',
      url: ''
    });
    setEditing(false);
    setViewing(false);
  };
  

  // class Notes(BaseModel):
  //   course_id: str
  //   title: str
  //   content: str
  //   url: Optional[HttpUrl] = None
  const handleUpload = () => {
    const newQuestion = {
      course_id: currentNote.course_id, // Maps selected course_id
      title: currentNote.content.find(block => block.type === 'title')?.value || '', // Extracts the title
      content: currentNote.content.find(block => block.type === 'text')?.value || '', // Extracts the paragraph text
      // url: currentNote.content.find(block => block.type === 'link')?.value || null // Extracts the link
    };
    console.log(newQuestion)
  
    axios.post(`http://localhost:8000/notes/create`, newQuestion, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      console.log("Notes added successfully:", response.data);
      // Handle success (e.g., clear form fields or update UI)
    })
    .catch(error => {
      console.error("Error adding notes:", error);
      // Handle error (e.g., show an error message to the user)
    });
  };
  


  const handleClose = () => {
    setOpen(false);
    setViewing(false);
  };

  const handleSave = () => {
    if (editing) {
      setNotes(notes.map(note => note.id === currentNote.id ? currentNote : note));
    } else {
      setNotes([...notes, { ...currentNote, id: notes.length }]);
    }
    setOpen(false);
  };

  const handleEdit = (note) => {
    setCurrentNote(note);
    setEditing(true);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setNoteToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = () => {
    setNotes(notes.filter(note => note.id !== noteToDelete));
    setDeleteConfirmationOpen(false);
  };

  const handleView = (note) => {
    setCurrentNote(note);
    setEditing(false);
    setViewing(true);
    setOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setDeleteConfirmationOpen(false);
  };

  const addContentField = (type) => {
    setCurrentNote({
      ...currentNote,
      content: [...currentNote.content, { type, value: type === 'list' ? [''] : '' }],
    });
  };

  const handleContentChange = (index, value) => {
    const updatedContent = [...currentNote.content];
    updatedContent[index].value = value;
    setCurrentNote({ ...currentNote, content: updatedContent });
  };

  const handleListItemChange = (index, itemIndex, value) => {
    const updatedContent = [...currentNote.content];
    updatedContent[index].value[itemIndex] = value;
    setCurrentNote({ ...currentNote, content: updatedContent });
  };

  const addListItem = (index) => {
    const updatedContent = [...currentNote.content];
    updatedContent[index].value.push('');
    setCurrentNote({ ...currentNote, content: updatedContent });
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedContent = [...currentNote.content];
      updatedContent[index].value = reader.result;
      setCurrentNote({ ...currentNote, content: updatedContent });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <InstructorSidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: `${drawerWidth}px` }, display: 'flex', justifyContent: 'center' }}>
        <Container>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>+ Upload Notes</Button>
          <Box mt={2}>
            {notes.map((note) => (
              <Card key={note.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{note.subject}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {note.content.map((block, index) => {
                      if (block.type === 'text') {
                        return <span key={index}>{block.value.substring(0, 100)}...</span>;
                      }
                      if (block.type === 'list') {
                        return (
                          <List key={index} dense>
                            {block.value.map((item, itemIndex) => (
                              <ListItem key={itemIndex}>
                                <ListItemText primary={item.substring(0, 30) + (item.length > 30 ? '...' : '')} />
                              </ListItem>
                            ))}
                          </List>
                        );
                      }
                      return null;
                    })}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleView(note)}>View</Button>
                  {/* <Button size="small" color="secondary" onClick={() => handleEdit(note)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(note.id)}>Delete</Button> */}
                </CardActions>
              </Card>
            ))}
          </Box>

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{editing ? 'Edit Note' : viewing ? 'View Note' : 'Upload Note'}</DialogTitle>
            <DialogContent>
  <DialogContentText>
    {editing ? 'Edit your note details below.' : viewing ? 'View your note details below.' : 'Subject'}
  </DialogContentText>
  <Select
  margin="dense"
  id="course"
  label="Course"
  value={currentNote.course_id}
  onChange={(e) => setCurrentNote({ ...currentNote, course_id: e.target.value })}
  fullWidth
  variant="standard"
  disabled={viewing} // Disable if viewing
>
  {courses.map((course) => (
    <MenuItem key={course.id} value={course.id}>
      {course.name}
    </MenuItem>
  ))}
</Select>

  {currentNote.content.map((block, index) => (
    <div key={index}>
      {block.type === 'text' && (
        <TextField
          margin="dense"
          label="Paragraph"
          type="text"
          fullWidth
          variant="standard"
          multiline
          rows={4}
          value={block.value}
          onChange={(e) => handleContentChange(index, e.target.value)}
          disabled={viewing} // Disable if viewing
        />
      )}
      {block.type === 'title' && (
        <TextField
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={block.value}
          onChange={(e) => handleContentChange(index, e.target.value)}
          disabled={viewing} // Disable if viewing
        />
      )}
      {block.type === 'subheading' && (
        <TextField
          margin="dense"
          label="Subheading"
          type="text"
          fullWidth
          variant="standard"
          value={block.value}
          onChange={(e) => handleContentChange(index, e.target.value)}
          disabled={viewing} // Disable if viewing
        />
      )}
      {/* {block.type === 'link' && (
        <TextField
          margin="dense"
          label="Link"
          type="text"
          fullWidth
          variant="standard"
          value={block.value}
          onChange={(e) => handleContentChange(index, e.target.value)}
          disabled={viewing} // Disable if viewing
        />
      )} */}
      {/* Handle other block types here */}
    </div>
  ))}
</DialogContent>







<DialogActions>
  <Button onClick={handleClose}>Cancel</Button>
  <Button variant="contained" color="primary" onClick={handleUpload}>
  Upload
</Button>
</DialogActions>



          </Dialog>

          <Dialog open={deleteConfirmationOpen} onClose={handleDeleteConfirmationClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this note?
              </DialogContentText>
            </DialogContent>
            {/* <DialogActions>
              <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
              <Button onClick={confirmDelete} color="error">Delete</Button>
            </DialogActions> */}
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default InstructorNotes;