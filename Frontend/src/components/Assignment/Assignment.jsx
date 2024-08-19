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

const drawerWidth = 240;

const QuestionCard = ({ question }) => {
  const renderOptions = () => {
    if (question.q_type === "MCQ") {
      return (
        <FormControl component="fieldset">
          <RadioGroup name={`question-${question.id}`}>
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
                control={<Checkbox name={`question-${question.id}-${index}`} />}
                label={option}
              />
            ))}
        </FormControl>
      );
    } else if (question.q_type === "Numerical") {
      return <TextField type="number" label="Your Answer" variant="outlined" />;
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
  const [questions, setQuestions] = useState([]);
  const [courseId, setCourseId] = useState("CS01");
  const [week, setWeek] = useState(1);
  const [assgnType, setAssgnType] = useState("AQ");
  const [allCourses, setAllCourses] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8000/course/getall")
      .then((res) => {
        const courses = {};
        res.data.forEach((course) => {
          courses[course.course_id] = course.course_name;
        });
        setAllCourses(courses);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
      });
  }, []);

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
        console.log(response.data[0]);
        if (Array.isArray(response.data)) {
          setQuestions(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [courseId, week, assgnType]);

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
            <InputLabel>Course</InputLabel>
            <Select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              label="Course"
            >
              {Object.entries(allCourses).map(([id, name]) => (
                <MenuItem key={id} value={id}>
                  {name}
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
              {new Date(questions[0].deadline).toLocaleString()}
            </Typography>
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
            <Button variant="contained" color="primary">
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
