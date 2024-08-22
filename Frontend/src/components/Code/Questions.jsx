import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [chosenWeek, setChosenWeek] = useState(1);
  const [chosenType, setChosenType] = useState("PPA");
  const params = useParams();
  const courseId = params.courseId;

  useEffect(() => {
    const getQuestions = () => {
      console.log("Auth token: ", localStorage.getItem("token"));
      console.log("Course ID: ", courseId);
      console.log("Week: ", chosenWeek);
      console.log("Assignment Type: ", chosenType);
      axios
        .get("http://localhost:8000/course/get_all_assignment", {
          params: {
            course_id: courseId,
            week: chosenWeek,
            assgn_type: chosenType,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setQuestions(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the questions!", error);
        });
    };

    getQuestions();
  }, [chosenWeek, chosenType]);

  const drawerWidth = 240;
  const navigate = useNavigate();

  return (
    <>
      <Sidenav />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: `${drawerWidth}px` },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <label htmlFor="week">Week:</label>
          <select
            id="week"
            value={chosenWeek}
            onChange={(e) => setChosenWeek(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => (
              <option key={week} value={week}>
                {week}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="assignmentType">Assignment Type:</label>
          <select
            id="assignmentType"
            value={chosenType}
            onChange={(e) => setChosenType(e.target.value)}
          >
            <option value="PPA">PPA</option>
            <option value="GrPA">GrPA</option>
          </select>
        </div>
        <div>
          {questions.length > 0 ? (
            questions.map((question) => (
              <Card
                key={question.id}
                onClick={() => navigate(`/code/problem/${question._id}`)}
                className="m-5"
              >
                <div className="whitespace-pre-wrap"> {question.question}</div>
              </Card>
            ))
          ) : (
            <p>No questions available for the selected filters.</p>
          )}
        </div>
      </Box>
    </>
  );
};

export default Questions;
