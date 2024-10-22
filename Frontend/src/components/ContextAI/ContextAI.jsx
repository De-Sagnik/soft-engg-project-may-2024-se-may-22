import React, {useState} from 'react';
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {useParams} from "react-router-dom";
import Markdown from "react-markdown";
import Sidenav from "../Sidenav";

const GenAI = () => {
    const params = useParams()
    const courseId = params.courseId;
    const [query, setQuery] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    let response = ""

    const handleGenerate = () => {
        setLoading(true)
        response = ""
        const ws = new WebSocket(`ws://localhost:8000/search_generate`);
        ws.onmessage = function (event) {
            response = response + event.data
            setText(response)
        };
        ws.onopen = () => {
            const dt = {query: query, week: 12, course_id: courseId}
            ws.send(JSON.stringify(dt))
        }
        ws.onclose = () => {
            setQuery("")
            setLoading(false)
        }
    }

    return (
        <>
            <Sidenav></Sidenav>
            <div className="flex flex-col justify-between h-[80vh] ml-[260px] mr-20">
                <div>
                    <div className="flex justify-between">
                        <p className="mb-2 text-xl">Write a query to get an AI response related to the course. You can ask any question specifically about the course.</p>
                        <div>
                            {loading ?
                                <i className="pi pi-spin pi-spinner mt-1" style={{fontSize: 'rem'}}></i> : ''}
                        </div>
                    </div>

                    <div className="w-full flex justify-end">
                        <div className="max-w-5xl h-[67vh] p-4 overflow-scroll">
                            <p className="text-justify bg-gray-100 p-3 rounded-2xl">
                                <Markdown>{text}</Markdown>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <InputText className="w-full" value={query}
                               onChange={(e) => setQuery(e.target.value)}/>
                    <Button icon="pi pi-send" className="p-button-primary" style={{backgroundColor: '#1976d2'}}
                            onClick={handleGenerate}/>
                </div>
            </div>

        </>
    );
};

export default GenAI;
