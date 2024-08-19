import React, {useEffect, useState} from "react";
import Sidenav from "../Sidenav";
import Flashcard from "./Flashcard";
// import FlashcardGenerateButton from '../FlashcardGenerateButton'
import "../../App.css";
import axios from "axios";
import {IconField} from "primereact/iconfield";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {generate_flashcard} from "./generate";
import {useParams} from "react-router-dom";
import GenAI from "../GenAI/GenAI";

const FlashcardList = () => {
    const params = useParams()
    const courseId = params.courseId;
    const [flashcards, setFlashcards] = useState([]);
    const [value, setValue] = useState("");


    const handleGenerate = () => {
        generate_flashcard(value, courseId).then(() => {
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

                <GenAI context="" week={12}/>
            </div>


            <div className="container">
                <div className="card-grid" align="center">
                    {flashcards
                        .filter((card) => card.course_id === courseId)
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
