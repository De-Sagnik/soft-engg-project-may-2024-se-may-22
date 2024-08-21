import "../../App.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";

const CourseSelectPage = (props) => {
  useEffect(() => {
    if (
      localStorage.getItem("token") === null ||
      localStorage.getItem("token") === undefined ||
      localStorage.getItem("token") === ""
    ) {
      window.open("http://localhost:3000/login", "_self");
    }
  }, []);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/course/getall")
      .then((res) => {
        setCourses(res.data);
        console.log(courses);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
      });
  }, []);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const setID = (id) => {
    console.log(id);
    window.open("/course/" + id, "_self");
  };

  return (
    <div className="mx-auto mt-16 max-w-3xl">
      <div className="text-lg text-center">Select a course</div>
      <div>
        <Dropdown
          value={selectedCourse}
          onChange={(e) => setID(e.value.course_id)}
          options={courses}
          optionLabel="course_name"
          placeholder="Select a Course"
          className="w-full md:w-14rem"
          checkmark={true}
          highlightOnSelect={false}
        />
      </div>
    </div>
  );
};

export default CourseSelectPage;
