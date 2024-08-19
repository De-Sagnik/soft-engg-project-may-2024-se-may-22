import React, { useEffect, useState } from "react";
import Sidenav from "../Sidenav";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { generate_flashcard } from "./generate";
import { useParams } from "react-router-dom";
import axios from "axios";
import Flashcard from "./Flashcard";

const FlashcardList = () => {
    const params = useParams();
    const courseId = params.courseId;
    const [flashcards, setFlashcards] = useState([]);
    const [value, setValue] = useState("");

    const handleGenerate = () => {
        console.log("Generating flashcards...", value);
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
    }, []);

    const getFlashCards = () => {
        axios.get('http://localhost:8000/user/flashcards', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            }
        })
        .then(res => {
            setFlashcards(res.data);
            console.log(res.data, flashcards);
        })
        .catch(err => {
            console.error("Error fetching flashcards:", err);
        });
    };

    useEffect(() => {
        getFlashCards();
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
            <Sidenav />
            <div className="flex align-middle justify-center">
                <div>
                    <InputText
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        style={{
                            borderColor: 'initial',
                            boxShadow: 'none',
                        }}
                    />
                </div>
                <Button
                    className="my-auto ml-2 p-button-primary"
                    style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
                    onClick={handleGenerate}
                >
                    Generate
                </Button>
            </div>

            <div className="container">
                <div className="card-grid" align="center">
                    {flashcards
                        .filter((card) => card.course_id === courseId)
                        .map((flashcard) => {
                            return (
                                <Flashcard flashcard={flashcard} key={flashcard.id} />
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default FlashcardList;
