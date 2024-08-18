import React, { useState, useEffect, useRef } from "react";
import Sidenav from "../Sidenav";
import { Typography } from "@mui/material";
import Flashcard from "./Flashcard";
import { Button, FormControl, Select, MenuItem } from "@mui/material";
// import FlashcardGenerateButton from '../FlashcardGenerateButton'
import "../../App.css";
import axios from "axios";
import { Box } from "@mui/material";

const FlashcardGenerateButton = () => {
  const handleGenerate = () => {
    // Logic for downloading PDF
    alert("Generating Flashcards...");
  };
  return (
    <Button variant="contained" color="primary" onClick={handleGenerate}>
      Generate
    </Button>
  );
};

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [allCourses, setAllCourses] = useState({});
  const [subject, setSubject] = useState("Select a Course");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/coding_assignment/get`, {
        params: {
            week: 6,
            course_id: "CS3001"
        },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    .then((res) => {
        console.log("Response:", res.data);
        setAssignment(res.data);
    })
    .catch(err => {
        console.error("Error fetching programming assignment:", err.response);
        alert("Error fetching programming assignment. Please check the console for details.");
    });
}, []);
  

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
        alert("Error fetching courses:", err);
      });
  }, []);

  const handleChange = (event) => {
    setSubject(event.target.value);
  };

  const categoryEl = useRef();

  // const [curr_category, setCategory] = useState("Select a Course");

  // useEffect(() => {
  //   axios
  //    .get('https://opentdb.com/api_category.php')
  //    .then(res => {
  //     setCategories(res.data.trivia_categories)
  //    })
  // })

  return (
    <>
      <Sidenav />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <FormControl style={{ width: "10%" }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={subject}
            onChange={handleChange}
            align="center"
          >
            <MenuItem value="Select a Course">Select a Course</MenuItem>
            {Object.keys(allCourses).map((course_id) => (
              <MenuItem key={course_id} value={course_id}>
                {allCourses[course_id]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ position: "absolute", left: 850, top: 90, m: 2 }}>
          <FlashcardGenerateButton />
        </Box>
      </div>

      <div className="container">
        <div className="card-grid" align="center">
          {flashcards
            .filter((card) => card.course_id === subject)
            .map((flashcard) => {
              return <Flashcard flashcard={flashcard} key={flashcard.id} />;
            })}
        </div>
      </div>
    </>
  );
};

export default FlashcardList;
