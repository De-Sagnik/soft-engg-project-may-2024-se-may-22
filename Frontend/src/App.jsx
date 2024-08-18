// src/components/Notes.jsx
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Notes from "./components/Notes/Notes";
import Code from "./components/Code/Code";
import Assignment from "./components/Assignment/Assignment";
import CourseInstructor from "./components/instructor_coding_assignment/Code_instructor";
import Instructor from "./components/instructor_GA/GA_instructor";
import FlashcardList from "./components/Flashcard/FlashcardList";
import Biology from "./components/Notes/Biology";
import Math from "./components/Notes/Math";
import English from "./components/Notes/English";
import ComputerScience from "./components/Notes/ComputerScience.jsx";
import InstructorNotes from "./components/instructor_Notes/InstructorNotes.jsx";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Notes />} />
          <Route path="/notes/:courseId/:courseName" element={<Notes />} />
          <Route path="/assignment" exact element={<Assignment />}></Route>
          <Route path="/code" exact element={<Code />}></Route>
          <Route path="/flashcard" exact element={<FlashcardList />} />
          {/* <Route path="/notes/biology" exact element={<Biology />} />
          <Route path="/notes/math" exact element={<Math />} />
          <Route path="/notes/english" exact element={<English />} />
          <Route
            path="/notes/computer-science"
            exact
            element={<ComputerScience />}
          /> */}
          <Route
            path="/instructor/code"
            exact
            element={<CourseInstructor />}
          ></Route>
          <Route path="/instructor/GA" exact element={<Instructor />}></Route>
          <Route path="/instructor/notes" exact element={<InstructorNotes />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
