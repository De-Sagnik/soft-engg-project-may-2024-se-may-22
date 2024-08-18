"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
} from "@mui/material";
// import questions from "./questions";
import Sidenav from "../Sidenav";
import axios from "axios";

const drawerWidth = 240;

const QuestionCard = ({ question }) => {
  console.log(question.options);
  const renderOptions = () => {
    if (question.q_type === "MCQ") {
      return (
        <FormControl component="fieldset">
          <RadioGroup name={`question-${question.id}`}>
            {question.options && question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    } else if (question.q_type === "MSQ") {
      return (
        <FormControl component="fieldset">
          {question.options && question.options.map((option, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox name={`question-${question.id}-${index}`} />}
              label={option}
            />
          ))}
        </FormControl>
      );
    } else if (question.type === "Numerical") {
      return <TextField type="number" label="Your Answer" variant="outlined" />;
    }
  };

  return (
    <>
      <Card variant="outlined" style={{ marginBottom: "16px" }}>
        <CardContent>
          <Typography variant="h6">{question.question}</Typography>
          {renderOptions()}
        </CardContent>
      </Card>
    </>
  );
};

const Assignment = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const course_id = "CS01";
        const week = 1;
        const assgn_type = "AQ";
        const response = await axios.get(
          `http://localhost:8000/course/get_assignment?course_id=${course_id}&week=${week}&assgn_type=${assgn_type}`
        );
        console.log(response.data[0]);
        if (Array.isArray(response.data)) {
          setQuestions(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchQuestions();
  }, []);
  return (
    <>
      <Sidenav />
      {/* <Container> */}
      <Box
        // component="main"
        // sx={{
        //   flexGrow: 1,
        //   p: 3,
        //   ml: { sm: `${drawerWidth}px` },
        //   display: "flex",
        //   justifyContent: "center",
        // }}
        marginLeft="280px"
        marginRight="40px"
      >
        <Typography
          variant="subtitle1"
          style={{ marginTop: "10px", color: "red", fontWeight: "bold" }}
        >
          Deadline: 2024-12-31 23:59
        </Typography>
        {questions && Array.isArray(questions) && questions.length > 0 &&
          questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
          }
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </Box>
      {/* </Container> */}
    </>
  );
};

export default Assignment;
