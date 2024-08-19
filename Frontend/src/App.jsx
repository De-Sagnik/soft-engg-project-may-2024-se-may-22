// src/components/Notes.jsx
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Notes from "./components/Notes/Notes";
import Code from "./components/Code/Code";
import Assignment from "./components/Assignment/Assignment";
import CourseInstructor from "./components/instructor_coding_assignment/Code_instructor";
import Instructor from "./components/instructor_GA/GA_instructor";
import FlashcardList from "./components/Flashcard/FlashcardList";
import InstructorNotes from "./components/instructor_Notes/InstructorNotes.jsx";
import Login from "./components/Login/Login";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import CourseSelectPage from "./components/course/course";

const App = () => {
    return (
        <PrimeReactProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" exact element={<CourseSelectPage/>}/>
                    <Route path="/course/:courseId" exact element={<Notes/>}/>
                    <Route path="/notes/:courseId" element={<Notes/>}/>
                    <Route path="/assignments/:courseId" exact element={<Assignment/>}></Route>
                    <Route path="/code/:courseId" exact element={<Code/>}></Route>
                    <Route path="/flashcards/:courseId" exact element={<FlashcardList/>}/>
                    <Route
                        path="/instructor/code"
                        exact
                        element={<CourseInstructor/>}
                    ></Route>
                    <Route path="/login/:token/type/:user_type" exact element={<Login/>}></Route>
                    <Route path="/login" exact element={<Login/>}></Route>
                    <Route path="/instructor/GA" exact element={<Instructor/>}></Route>
                    <Route path="/instructor/notes" exact element={<InstructorNotes/>}></Route>
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    );
};

export default App;
