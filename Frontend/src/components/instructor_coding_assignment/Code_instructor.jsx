import React, { useState, useEffect } from "react";

import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import InstructorSidenav from "../InstructorSidenav";

// class ProgrammingAssignment(BaseModel):
//     question: str
//     language: CodeLanguage
//     public_testcase: List[dict]
//     private_testcase: List[dict]
//     assgn_type: AssignmentType
//     course_id: str
//     week: int = Field(ge=0, le=12)
//     evaluated: bool | None = False
//     deadline: datetime = Field(description="Deadline in ISO format")

const CourseInstructor = () => {
  const [question, setQuestion] = useState("");
  const [questionExplanation, setQuestionExplanation] = useState("");
  const [testCaseInput, setTestCaseInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [deadline, setDeadline] = useState(null);
  const [week, setWeek] = useState("");
  const [language, setLanguage] = useState("");



  const addTestCase = () => {
    const newTestCase = {
      input: testCaseInput,
      output: expectedOutput,
      public: isPublic,
    };
    setTestCases([...testCases, newTestCase]);
    setTestCaseInput("");
    setExpectedOutput("");
    setIsPublic(false);
  };

  // const handleQuestionSubmit = () => {
  //   const newAssignment = {
  //     question,
  //     questionExplanation,
  //     testCases,
  //     deadline,
  //   };
  //   console.log("Assignment Submitted: ", newAssignment);
  //   // TODO: Implement the logic to save this assignment
  // };

  const handleQuestionSubmit = () => {
    // Example values for language and assgn_type
  
    // Separate public and private test cases
    const public_testcase = testCases.filter(testCase => testCase.public);
    const private_testcase = testCases.filter(testCase => !testCase.private);
  
    const newAssignment = {
      question: question,
      language: language,
      public_testcase: public_testcase,
      private_testcase: private_testcase,
      assgn_type: 'GrPA',//GrPA
      course_id: 'CS3001',
      week: week,
      evaluated: false,
      deadline: deadline ? deadline.toISOString() : null,
    };
  
    console.log("Assignment Submitted: ", newAssignment);

    console.log(newAssignment)

    axios.post(`http://localhost:8000/coding_assignment/create_programming_question`, newAssignment, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      console.log("Assignment added successfully:", response.data);
      // Handle success (e.g., clear form fields or update UI)
    })
    .catch(error => {
      console.error("Error adding assignment:", error);
      // Handle error (e.g., show an error message to the user)
    });

  };
  

    // class ProgrammingAssignment(BaseModel):
//     question: str
//     language: CodeLanguage
//     public_testcase: List[dict]
//     private_testcase: List[dict]
//     assgn_type: AssignmentType
//     course_id: str
//     week: int = Field(ge=0, le=12)
//     evaluated: bool | None = False
//     deadline: datetime = Field(description="Deadline in ISO format")


  return (
    <>
      <InstructorSidenav />
      <Container
        maxWidth="md"
        style={{ marginTop: "2rem", marginLeft: "260px" }}
      >
        <Card>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Set Programming Assignment
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Assignment Deadline"
                    value={deadline}
                    onChange={(date) => setDeadline(date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <br></br>
  <TextField
    label="Week"
    fullWidth
    select
    variant="outlined"
    value={week}
    onChange={(e) => setWeek(e.target.value)}
    SelectProps={{
      native: true,
    }}
  >
    <option value="" disabled></option>
    {[...Array(12)].map((_, index) => (
      <option key={index + 1} value={index + 1}>
        Week {index + 1}
      </option>
    ))}
  </TextField>



</Grid>

<Grid item xs={12}>
  <TextField
    label="Language"
    fullWidth
    select
    variant="outlined"
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    SelectProps={{
      native: true,
    }}
  >
    <option value="" disabled></option>
    <option value="python">python</option>
    <option value="java">java</option>
  </TextField>
</Grid>


              <Grid item xs={12}>
                <TextField
                  label="Question"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </Grid>

              {/* <Grid item xs={12}>
                <TextField
                  label="Question Explanation"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={questionExplanation}
                  onChange={(e) => setQuestionExplanation(e.target.value)}
                />
              </Grid> */}

              <Grid item xs={6}>
                <TextField
                  label="Test Case Input"
                  fullWidth
                  variant="outlined"
                  value={testCaseInput}
                  onChange={(e) => setTestCaseInput(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Expected Output"
                  fullWidth
                  variant="outlined"
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                />
              </Grid>

  
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addTestCase}
                  fullWidth
                >
                  Add Test Case
                </Button>
              </Grid>

              

              <Grid item xs={12}>
                <Typography variant="h6">Test Cases:</Typography>
                {testCases.map((testCase, index) => (
                  <Card key={index} style={{ marginTop: "0.5rem" }}>
                    <CardContent>
                      <Typography>
                        <strong>Input:</strong> {testCase.input}
                      </Typography>
                      <Typography>
                        <strong>Expected Output:</strong> {testCase.output}
                      </Typography>
                      {/* <Typography>
                        <strong>Public:</strong>{" "}
                        {testCase.public ? "Yes" : "No"}
                      </Typography> */}
                    </CardContent>
                  </Card>
                ))}
              </Grid>

              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleQuestionSubmit}
                  style={{ width: "auto" }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default CourseInstructor;
