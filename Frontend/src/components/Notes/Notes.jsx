import React, { useEffect, useState } from "react";
import Sidenav from "../Sidenav";
import {
  Typography,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Sidebar } from "primereact/sidebar";
// import { Button } from "primereact/button";

const Notes = () => {
  const { courseId, courseName } = useParams();
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [availableWeeks, setAvailableWeeks] = useState([]);

  const [visibleRight, setVisibleRight] = useState(false);
  <Sidebar
    visible={visibleRight}
    position="right"
    onHide={() => setVisibleRight(false)}
  >
    <h2>Right Sidebar</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
  </Sidebar>;

  useEffect(() => {
    axios
      .get(`http://localhost:8000/course/course_material/${courseId}`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkcmlwdG8uMjE1QGdtYWlsLmNvbSIsInNjb3BlcyI6WyJ1c2VyIl0sImV4cCI6MTcyMzk4NjIxNX0.aDMw0_MsSDK412A6rhuDeK73feyNxFBOq0tUradLlFY",
        },
      })
      .then((res) => {
        console.log(res.data); // Debugging API response
        const sortedMaterials = res.data.sort((a, b) => a.week - b.week);
        setCourseMaterials(sortedMaterials);

        const weeks = [
          ...new Set(sortedMaterials.map((material) => material.week)),
        ];
        setAvailableWeeks(weeks);
        setSelectedWeeks(weeks); // Select all weeks by default
      })
      .catch((err) => {
        console.error("Error fetching course material:", err);
      });
  }, [courseId]);

  const handleWeekChange = (event) => {
    setSelectedWeeks(event.target.value);
  };

  const renderMaterial = (material) => {
    if (material.material_type === "notes") {
      return (
        <Typography key={material._id} variant="body1" paragraph>
          {material.content}
        </Typography>
      );
    } else if (material.material_type === "video_URL") {
      return (
        <Box key={material._id} mb={2}>
          <Typography variant="body1">
            <a href={material.url} target="_blank" rel="noopener noreferrer">
              {material.content || material.url}
            </a>
          </Typography>
        </Box>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <Sidenav />
      <div>
        <Typography variant="h3" align="center">
          {" "}
          Notes for {courseName}{" "}
        </Typography>
        <Box display="flex" justifyContent="center" my={2}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel id="week-select-label">Select Week(s)</InputLabel>
            <Select
              labelId="week-select-label"
              id="week-select"
              multiple
              value={selectedWeeks}
              onChange={handleWeekChange}
              label="Select Week(s)"
              renderValue={(selected) => selected.join(", ")}
            >
              {availableWeeks.map((week) => (
                <MenuItem key={week} value={week}>
                  {week}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => 
        {
          console.log("Visible Right", visibleRight)
          setVisibleRight(true)
          // Chat with Notes
        }}>
        </Button>
        <Box>
          {courseMaterials
            .filter((material) => selectedWeeks.includes(material.week))
            .map((material) => renderMaterial(material))}
        </Box>
      </div>
    </>
  );
};

export default Notes;
