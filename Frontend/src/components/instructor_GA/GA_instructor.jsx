import React, { useState, useEffect } from "react";

import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import InstructorSidenav from "../InstructorSidenav";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const Instructor = () => {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("MCQ");
  const [allCourses, setAllCourses] = useState({});
  const [course, setCourse] = useState('');
  const [options, setOptions] = useState([""]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [assignmentType, setAssignmentType] = useState('');
  const [lowerBound, setLowerBound] = useState("");
  const [upperBound, setUpperBound] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [week, setWeek] = useState('');
  const [courseId, setCourseId] = useState(''); 

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    const newCorrectAnswers = correctAnswers.filter((_, i) => i !== index);
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = options.map((option, i) =>
      i === index ? value : option
    );
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (index) => {
    if (questionType === "MCQ") {
      setCorrectAnswers([index]);
    } else {
      const newCorrectAnswers = correctAnswers.includes(index)
        ? correctAnswers.filter((i) => i !== index)
        : [...correctAnswers, index];
      setCorrectAnswers(newCorrectAnswers);
    }
    
  };

  // const handleAddQuestion = () => {
  //   const newQuestion = {
  //     id: questions.length + 1,
  //     text: questionText,
  //     type: questionType,
  //     options: questionType !== "Numerical" ? options : [],
  //     correctAnswers: questionType !== "Numerical" ? correctAnswers : null,
  //     range:
  //       questionType === "Numerical"
  //         ? { lower: lowerBound, upper: upperBound }
  //         : null,
  //   };

  //   setQuestions([...questions, newQuestion]);
  //   resetForm();
  // };
  const isFormValid = () => {
    return (
      questionText &&
      questionType &&
      courseId &&
      week &&
      assignmentType &&
      (questionType === "Numerical"
        ? lowerBound && upperBound
        : options.length >= 2 && correctAnswers.length > 0) &&
      deadline
    );
  };
  

  const handleAddQuestion = () => {
    const newQuestion = {
      // id: questions.length + 1,
      question: questionText,
      q_type: questionType,
      options: questionType !== "Numerical" ? options : [],
      answers: questionType !== "Numerical" ? correctAnswers : null,
      // range:
      //   questionType === "Numerical"
      //     ? { lower: lowerBound, upper: upperBound }
      //     : null,
      assgn_type: assignmentType,
      course_id: courseId, // Include courseId in the newQuestion object
      week: week, // Include week in the newQuestion object
      evaluated: false,
      deadline: deadline ? deadline.toISOString() : null
      
    }
    resetForm();


    // class Assignment(BaseModel):
    // question: str
    // q_type: QuestionType
    // options: List[Union[int, str, float]]
    // answers: List[Union[int, str, float]]
    // assgn_type: AssignmentType
    // course_id: str
    // week: int = Field(ge=0, le=12)
    // evaluated: bool | None = False
    // deadline: datetime = Field(..., description="Deadline in ISO format")

   
    //   .then((res) => {
    //     console.log(res.data); // Debugging API response
    //     const sortedMaterials = res.data.sort((a, b) => a.week - b.week);
    //     setCourseMaterials(sortedMaterial
    console.log(newQuestion)
    axios.post(`http://localhost:8000/assignment/create`, newQuestion, {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkcmlwdG8uMjE1QGdtYWlsLmNvbSIsInNjb3BlcyI6WyJ1c2VyIl0sImV4cCI6MTcyMzk4NjIxNX0.aDMw0_MsSDK412A6rhuDeK73feyNxFBOq0tUradLlFY'
      }
    })
    .then(response => {
      console.log("Question added successfully:", response.data);
      // Handle success (e.g., clear form fields or update UI)
    })
    .catch(error => {
      console.error("Error adding question:", error);
      // Handle error (e.g., show an error message to the user)
    });
};


  // const resetForm = () => {
  //   setQuestionText("");
  //   setQuestionType("MCQ");
  //   setOptions([""]);
  //   setCorrectAnswers([]);
  // };

  const resetForm = () => {
    setQuestionText("");
    setQuestionType("MCQ");
    setOptions([""]);
    setCorrectAnswers([]);
    setAssignmentType('');
    setCourseId('');
    setWeek('');
    setDeadline(null);
  };
  

  useEffect(() => {
    axios.get("http://localhost:8000/course/getall")
      .then((res) => {
        const courses = {};
        res.data.forEach(course => {
          courses[course.course_id] = course.course_name;
        });
        setAllCourses(courses);
      })
      .catch(err => {
        console.error("Error fetching courses:", err);
      });
  }, []);

  return (
    <Container>
      <InstructorSidenav />
      <Box marginLeft="240px" my={4}>
        <Typography variant="h4" gutterBottom>
          Set Questions
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Assignment Deadline"
            value={deadline}
            onChange={(date) => setDeadline(date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>

        <Card variant="outlined" style={{ marginBottom: "16px" }}>
          <CardContent>
            <TextField
              label="Question"
              variant="outlined"
              fullWidth
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
            <FormControl
              variant="outlined"
              fullWidth
              style={{ marginBottom: "16px" }}
            >
              <InputLabel>Type</InputLabel>
              <Select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                label="Type"
              >
                <MenuItem value="MCQ">MCQ</MenuItem>
                <MenuItem value="MSQ">MSQ</MenuItem>
                {/* <MenuItem value="Numerical">Numerical</MenuItem> */}
              </Select>
              </FormControl>


              <FormControl variant="outlined" fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Subject</InputLabel>
          <Select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)} // Update courseId on selection
            label="Subject"
          >
            {Object.entries(allCourses).map(([id, name]) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Week</InputLabel>
          <Select
            value={week}
            onChange={(e) => setWeek(e.target.value)} // Update week on selection
            label="Week"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((weekNumber) => (
              <MenuItem key={weekNumber} value={weekNumber}>
                {weekNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Assignment Type</InputLabel>
          <Select
            value={assignmentType}
            onChange={(e) => setAssignmentType(e.target.value)}
            label="Assignment Type"
          >
            <MenuItem value="AQ">AQ</MenuItem>
            <MenuItem value="PA">PA</MenuItem>
            <MenuItem value="GA">GA</MenuItem>
            <MenuItem value="PPA">PPA</MenuItem>
            <MenuItem value="GrPA">GrPA</MenuItem>
          </Select>
        </FormControl>
  
            {questionType !== "Numerical" && (
              <>
                {options.map((option, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    style={{ marginBottom: "8px" }}
                  >
                    <TextField
                      label={`Option ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                    />
                    <IconButton onClick={() => handleRemoveOption(index)}>
                      <RemoveCircleIcon />
                    </IconButton>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={correctAnswers.includes(index)}
                          onChange={() => handleCorrectAnswerChange(index)}
                        />
                      }
                      label="Correct"
                    />
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={handleAddOption}
                  startIcon={<AddCircleIcon />}
                >
                  Add Option
                </Button>
              </>
            )}

            {questionType === "Numerical" && (
              <Box
                display="flex"
                justifyContent="space-between"
                style={{ marginBottom: "16px" }}
              >
                <TextField
                  label="Lower Bound"
                  variant="outlined"
                  type="number"
                  value={lowerBound}
                  onChange={(e) => setLowerBound(e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                <TextField
                  label="Upper Bound"
                  variant="outlined"
                  type="number"
                  value={upperBound}
                  onChange={(e) => setUpperBound(e.target.value)}
                />
              </Box>
            )}

            {/* <Button
              variant="contained"
              color="primary"
              onClick={handleAddQuestion}
            >
              Add Question
            </Button> */}

<Button
  variant="contained"
  color="primary"
  onClick={handleAddQuestion}
  disabled={!isFormValid()}
>
  Add Question
</Button>




{!isFormValid() && (
  <Typography color="error" variant="body2" style={{ marginTop: "16px" }}>
    Please fill in all required fields and ensure options are correctly set before adding the question.
  </Typography>
)}


          </CardContent>
        </Card>

        {questions.length > 0 && (
          <div>
            <Typography variant="h5">Questions List:</Typography>
            {questions.map((question) => (
              <Card
                key={question.id}
                variant="outlined"
                style={{ marginBottom: "16px" }}
              >
                <CardContent>
                  <Typography variant="h6">{question.text}</Typography>
                  <Typography variant="body2">Type: {question.type}</Typography>
                  {question.type !== "Numerical" && (
                    <ul>
                      {question.options.map((option, index) => (
                        <li key={index}>
                          {option}{" "}
                          {question.correctAnswers.includes(index) &&
                            "(Correct)"}
                        </li>
                      ))}
                    </ul>
                  )}
                  {question.type === "Numerical" && (
                    <Typography variant="body2">
                      Range: {question.range.lower} - {question.range.upper}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Box>
    </Container>
  );
};

export default Instructor;


