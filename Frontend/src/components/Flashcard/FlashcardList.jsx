import React, {useEffect, useState} from "react";
import Sidenav from "../Sidenav";
import {MenuItem, Select} from "@mui/material";
import Flashcard from "./Flashcard";
// import FlashcardGenerateButton from '../FlashcardGenerateButton'
import "../../App.css";
import axios from "axios";
import {IconField} from "primereact/iconfield";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {generate_flashcard} from "./generate";

const FlashcardList = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [allCourses, setAllCourses] = useState({});
    const [subject, setSubject] = useState("Select a Course");
    const [value, setValue] = useState("");


    const handleGenerate = () => {
        console.log("Generating flashcards...", value);
        generate_flashcard(value, subject).then(() => {
            getFlashCards();
        });
    };

    useEffect(() => {
        axios.get('http://localhost:8000/user/flashcards', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then(res => {
                setFlashcards(res.data);
            })
            .catch(err => {
                console.error("Error fetching flashcards:", err);
            });
    }, []); // This runs once on component mount

    useEffect(() => {
        axios.get("http://localhost:8000/course/getall")
            .then((res) => {
                const coursesData = {};
                res.data.forEach(course => {
                    coursesData[course.course_id] = course.course_name;
                });
                setAllCourses(coursesData);
            })
            .catch(err => {
                console.error("Error fetching courses:", err);
            });
    }, []);


            const getFlashCards = () => {
                axios.get('http://localhost:8000/user/flashcards',
                    {
                        headers:
                            {
                                Authorization: "Bearer " + localStorage.getItem("token"),
                            }
                    }
                )
                    .then(res => {
                        setFlashcards(res.data);
                        console.log(res.data, flashcards);
                    })
                    .catch(err => {
                        console.error("Error fetching flashcards:", err);
                    });
            }


            useEffect(() => {
                getFlashCards()
            }, []);


            useEffect(() => {
                axios.get("http://localhost:8000/course/getall")
                    .then((res) => {
                        const courses = {};
                        res.data.forEach(course => {
                            courses[course.course_id] = course.course_name;
                        });
                        setAllCourses(courses);
                    })
                    .catch(err => {
                        console.error("Error fetching courses:", err);
                    });
            }, []);

            const handleChange = (event) => {
                setSubject(event.target.value);
            };

            return (
                <>
                    <Sidenav/>
                    <div className="flex align-middle justify-center">
                        <div>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={subject}
                                onChange={handleChange}
                                align="center"
                                className="w-64 mr-2"
                            >
                                <MenuItem value="Select a Course">Select a Course</MenuItem>
                                {Object.keys(allCourses).map((course_id) => (
                                    <MenuItem key={course_id} value={course_id}>
                                        {allCourses[course_id]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <IconField>
                                <InputText value={value} onChange={(e) => setValue(e.target.value)}/>
                            </IconField>
                        </div>
                        <div><Button className="my-auto ml-2" color="primary" onClick={handleGenerate}>
                            Generate
                        </Button></div>
                    </div>

            <div className="container">
                <div className="card-grid" align="center">
                    {flashcards
                        .filter((card) => card.course_id === subject)
                        .map((flashcard) => {
                            return (
                                <Flashcard flashcard={flashcard} key={flashcard.id}/>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default FlashcardList;
