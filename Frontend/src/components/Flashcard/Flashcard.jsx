import React, {useRef, useState} from 'react';
import Sidenav from "../Sidenav";
import {Typography} from '@mui/material';
import EditFlashCard from "./EditFlashCard";

const Flashcard = ({flashcard, getFlashCards, toast}) => {
    const [flip, setFlip] = useState(false)
    const frontEl = useRef()
    const backEl = useRef()
    return (
        <>
            <Sidenav/>
            <div className='container' ref={frontEl}>
                <div
                    className={`card ${flip ? 'flip' : ''}`}>
                    <div className="front  w-full h-full">
                        <div className="text-right ">
                            <EditFlashCard  flashcard={flashcard} getFlashCards={getFlashCards} toast={toast}/>
                        </div>
                        <div className=" w-full h-full flex flex-col align-middle justify-center"
                             onClick={() => setFlip(!flip)} ref={frontEl}>
                            <Typography variant="h6" gutterBottom sx={{color: '#333333'}}>
                                {flashcard.title}
                            </Typography>
                        </div>
                    </div>

                    <div className="back w-full h-full" ref={backEl}
                    >
                        <div className="text-right">
                            <EditFlashCard  flashcard={flashcard} getFlashCards={getFlashCards} toast={toast}/>
                        </div>
                        <div className="w-full h-full flex flex-col align-middle justify-center"
                             onClick={() => setFlip(!flip)}
                        >
                            <Typography variant="h6" gutterBottom sx={{color: '#333333'}}>
                                {flashcard.content}
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Flashcard;

