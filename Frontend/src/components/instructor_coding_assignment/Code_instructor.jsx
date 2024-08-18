import React, { useState } from "react";
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

const CourseInstructor = () => {
  const [question, setQuestion] = useState("");
  const [questionExplanation, setQuestionExplanation] = useState("");
  const [testCaseInput, setTestCaseInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [deadline, setDeadline] = useState(null);

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

  const handleQuestionSubmit = () => {
    const newAssignment = {
      question,
      questionExplanation,
      testCases,
      deadline,
    };
    console.log("Assignment Submitted: ", newAssignment);
    // TODO: Implement the logic to save this assignment
  };

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

              <Grid item xs={12}>
                <TextField
                  label="Question Explanation"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={questionExplanation}
                  onChange={(e) => setQuestionExplanation(e.target.value)}
                />
              </Grid>

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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                    />
                  }
                  label="Make this test case public"
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
                      <Typography>
                        <strong>Public:</strong>{" "}
                        {testCase.public ? "Yes" : "No"}
                      </Typography>
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
