import React, { useState, useEffect, useRef } from "react";
import Sidenav from "../Sidenav";
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

// function handleChange(e){
//     e.preventDefault()

const SAMPLE_FLASHCARDS = [
    {
        id: 1,
        subject: "Biology",
        question: "Mitochondria",
        answer:
            'Mitochondria are membrane-bound organelles present in the cytoplasm of all eukaryotic cells that produce adenosine triphosphate (ATP), the main energy molecule used by the cell. They are known as the "Powerhouse of the cell.',
    },
    {
        id: 2,
        question: "Mitochondrial Disorders",
        subject: "Biology",
        answer: "Alpers Disease, Barth Syndrome, and Kearns-Sayre syndrome (KSS)",
    },
    {
        id: 2,
        question: "Functions of Mitochondria",
        subject: "Biology",
        answer:
            "Beyond energy production, mitochondria regulate metabolism, promote cell growth and multiplication, detoxify ammonia in liver cells, facilitate apoptosis, build blood and hormones, maintain calcium levels, and are involved in cellular differentiation, signaling, senescence, and cell cycle control.",
    },
    {
        id: 2,
        question: "Structure of Mitochondria",
        subject: "Biology",
        answer:
            "he mitochondrion is a double-membraned, rod-shaped structure found in both plant and animal cells, ranging from 0.5 to 1.0 micrometre in diameter. ",
    },
    {
        id: 2,
        question: "What is 2+2?",
        subject: "Math",
        answer: "4",
    },
    {
        id: 3,
        question: "Colors?",
        answer: "VIBGYOR",
        subject: "Computer Science",
    },
    {
        id: 4,
        question: "What is a Membrane?",
        subject: "English",
        answer:
            "A membrane is a selective barrier; it allows some things to pass through but stops others. Such things may be molecules, ions, or other small particles. Membranes can be generally classified into synthetic membranes and biological membranes.",
    },
];

// }

const FlashcardList = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [allCourses, setAllCourses] = useState({});
    const [subject, setSubject] = useState("Select a Course");

    useEffect(() => {
        axios.get('http://localhost:8000/flash_card/getall')
            .then(res => {
                setFlashcards(res.data);
            })
            .catch(err => {
                console.error("Error fetching flashcards:", err);
            });
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
            <div>Hello Welcome to study </div>
        </>
    );
};

export default FlashcardList;
