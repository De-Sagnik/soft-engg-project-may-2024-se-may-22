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
import {useParams} from "react-router-dom";

const FlashcardList = () => {
    const params = useParams()
    const courseId = params.courseId;
    const [flashcards, setFlashcards] = useState([]);
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
