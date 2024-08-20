"use client";
import React, { useState, useEffect } from "react";
import {
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
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import Sidenav from "../Sidenav";
import axios from "axios";
import { useParams } from "react-router-dom";

const drawerWidth = 240;

const QuestionCard = ({ question, handle_answer_change, user_answers }) => {
  const handleChange = (event) => {
    if (question.q_type === "MCQ") {
      handle_answer_change(question.id, event.target.value);
    } else if (question.q_type === "MSQ") {
      const currentAnswers = user_answers[question.id] || [];
      const newAnswers = event.target.checked
        ? [...currentAnswers, event.target.value]
        : currentAnswers.filter((answer) => answer !== event.target.value);
      handle_answer_change(question.id, newAnswers);
    } else if (question.q_type === "Numerical") {
      handle_answer_change(question.id, event.target.value);
    }
  };

  const renderOptions = () => {
    if (question.q_type === "MCQ") {
      return (
        <FormControl component="fieldset">
          <RadioGroup
            name={`question-${question.id}`}
            onChange={handleChange}
          >
            {question.options &&
              question.options.map((option, index) => (
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
          {question.options &&
            question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox value={option} onChange={handleChange} />}
                label={option}
              />
            ))}
        </FormControl>
      );
    } else if (question.q_type === "Numerical") {
      return (
        <TextField
          type="number"
          label="Your Answer"
          variant="outlined"
          onChange={handleChange}
        />
      );
    }
  };

  return (
    <Card variant="outlined" style={{ marginBottom: "16px" }}>
      <CardContent>
        <Typography variant="h6">{question.question}</Typography>
        {renderOptions()}
      </CardContent>
    </Card>
  );
};


const Assignment = () => {
  const params = useParams();
  const courseId = params.courseId;
  const [questions, setQuestions] = useState([]);
  const [week, setWeek] = useState(1);
  const [assgnType, setAssgnType] = useState("AQ");
  const [deadline, setDeadline] = useState("");
  const [user_answers, setUserAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/course/get_assignment?course_id=${courseId}&week=${week}&assgn_type=${assgnType}`,
          {
            headers: {
              Authorization: `Bearer ` + localStorage.getItem("token"),
            },
          }
        );
        if (Array.isArray(response.data)) {
          setQuestions(response.data);
          setDeadline(response.data[0]?.deadline);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [courseId, week, assgnType]);

  const handle_answer_change = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handle_answers_submit = async () => {
    const today = new Date();
    const deadline_date = new Date(deadline);

    if (today > deadline_date) {
      alert("Deadline has passed");
      return;
    }

    let user_id = localStorage.getItem("user_id");
    if (!user_id) {
      try {
        const response = await axios.get("http://localhost:8000/user/me", {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        user_id = response.data.user_id;
        localStorage.setItem("user_id", user_id);
      } catch (err) {
        console.error(err);
        alert("Error fetching user details");
        return;
      }
    }

    for (const [questionId, answer] of Object.entries(user_answers)) {
      try {
        await axios.post(
          "http://localhost:8000/user/submit_answers",
          {
            assgn_id: questionId,
            user_id: user_id,
            answer: answer,
          },
          {
            headers: {
              Authorization: `Bearer ` + localStorage.getItem("token"),
            },
          }
        );
      } catch (err) {
        console.error(err);
        alert("Error submitting answer for question " + questionId);
        return;
      }
    }

    alert("All answers submitted successfully");
  };

  return (
    <>
      <Sidenav />
      <Box marginLeft="280px" marginRight="40px" marginTop="20px">
        {/* Filters */}
        <Box display="flex" gap="20px" marginBottom="20px">
          <FormControl variant="outlined" style={{ minWidth: 120 }}>
            <InputLabel>Week</InputLabel>
            <Select
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              label="Week"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => (
                <MenuItem key={week} value={week}>
                  Week {week}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" style={{ minWidth: 120 }}>
            <InputLabel>Assignment Type</InputLabel>
            <Select
              value={assgnType}
              onChange={(e) => setAssgnType(e.target.value)}
              label="Assignment Type"
            >
              <MenuItem value="AQ">AQ</MenuItem>
              <MenuItem value="PA">PA</MenuItem>
              <MenuItem value="GA">GA</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Deadline */}

        {/* Questions or No Questions Message */}
        {questions && Array.isArray(questions) && questions.length > 0 ? (
          <>
            <Typography
              variant="subtitle1"
              style={{ marginTop: "10px", color: "red", fontWeight: "bold" }}
            >
              Deadline:
              {deadline}
            </Typography>
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                handle_answer_change={handle_answer_change}
                user_answers={user_answers}
              />
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handle_answers_submit}
            >
              Submit
            </Button>
          </>
        ) : (
          <Typography variant="h6" style={{ marginTop: "20px", color: "gray" }}>
            No questions here. Try changing the filters.
          </Typography>
        )}
      </Box>
    </>
  );
};

export default Assignment;
