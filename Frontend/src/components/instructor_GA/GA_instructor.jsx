import React, { useState } from "react";
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
  const [options, setOptions] = useState([""]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [lowerBound, setLowerBound] = useState("");
  const [upperBound, setUpperBound] = useState("");
  const [deadline, setDeadline] = useState(null);

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

  const handleAddQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: questionText,
      type: questionType,
      options: questionType !== "Numerical" ? options : [],
      correctAnswers: questionType !== "Numerical" ? correctAnswers : null,
      range:
        questionType === "Numerical"
          ? { lower: lowerBound, upper: upperBound }
          : null,
    };

    setQuestions([...questions, newQuestion]);
    resetForm();
  };

  const resetForm = () => {
    setQuestionText("");
    setQuestionType("MCQ");
    setOptions([""]);
    setCorrectAnswers([]);
    setLowerBound("");
    setUpperBound("");
  };

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
                <MenuItem value="Numerical">Numerical</MenuItem>
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

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddQuestion}
            >
              Add Question
            </Button>
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
