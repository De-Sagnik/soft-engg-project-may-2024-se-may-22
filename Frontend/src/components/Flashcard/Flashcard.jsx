import React, { useState, useRef } from 'react';
import Sidenav from "../Sidenav";
import { Typography } from '@mui/material';

const Flashcard = ( {flashcard} ) => {
  const [flip, setFlip] = useState(false)
  const frontEl = useRef()
  const backEl = useRef()

  // function setMaxHeight(){
  //   const frontEl
  // }

  return (
    <>
     <Sidenav />
     <div className='container' ref={frontEl}>
     <div 
        className={`card ${flip ? 'flip' : ''}`}
        onClick={() => setFlip(!flip)}
     >
      <div className="front">
      <Typography variant="h6" gutterBottom sx={{ color: '#333333' }}>
        {flashcard.title}
      </Typography>
        
      </div>
      <div className="back" ref={backEl}>
      <Typography variant="h6" gutterBottom sx={{ color: '#333333' }}>
        {flashcard.content}
      </Typography>
      </div>
     </div>
     </div>
    </>
  );
};

export default Flashcard;

