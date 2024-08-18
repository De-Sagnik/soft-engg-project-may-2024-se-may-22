import "../../App.css";

import React, {useEffect, useState} from 'react';
import {Button} from 'primereact/button';
import {DataView} from 'primereact/dataview';
import {Rating} from 'primereact/rating';
import {classNames} from 'primereact/utils';
import axios from "axios";
import {Dropdown} from "primereact/dropdown";
import {Navigate} from "react-router-dom";


const CourseSelectPage = (props) => {
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:8000/course/getall")
            .then((res) => {
                setCourses(res.data)
                console.log(courses)
            })
            .catch(err => {
                console.error("Error fetching courses:", err);
            });
    }, []);

    const [selectedCourse, setSelectedCourse] = useState(null);

    const setID = (id) => {
        console.log(id)
        window.open('/course/' + id, '_self')
    }

    return (
        <div className="card flex justify-content-center">
            <Dropdown value={selectedCourse} onChange={(e) => setID(e.value.course_id)} options={courses}
                      optionLabel="course_name"

                      placeholder="Select a Course" className="w-full md:w-14rem" checkmark={true}
                      highlightOnSelect={false}/>
        </div>
    )
};

export default CourseSelectPage;
