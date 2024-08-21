import React, {useState} from 'react';
import {Button} from "primereact/button";
import {Sidebar} from "primereact/sidebar";
import {InputText} from "primereact/inputtext";
import {useParams} from "react-router-dom";
import Markdown from "react-markdown";

const GenAI = ({week, context}) => {
    const params = useParams()
    const courseId = params.courseId;
    const [visibleRight, setVisibleRight] = useState(false);
    const [query, setQuery] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    let response = ""

    const handleGenerate = () => {
        setLoading(true)
        response = ""
        const ws = new WebSocket(`ws://localhost:8000/generate`);
        ws.onmessage = function (event) {
            response = response + event.data
            setText(response)
        };
        ws.onopen = () => {
            const dt = {query: context + query, week: week, course_id: courseId}
            ws.send(JSON.stringify(dt))
        }
        ws.onclose = () => {
            setLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setVisibleRight(true)}>
                Ask AI
            </Button>
            <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)} className="w-96">
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <p className="mb-2">Write a query to get AI reply {loading ?
                            <i className="pi pi-spin pi-spinner mt-1" style={{fontSize: 'rem'}}></i> : ''} </p>
                        <p className="text-sm text-justify">
                            <Markdown>{text}</Markdown>
                        </p>
                    </div>
                    <div className="flex">
                        <InputText className="w-full" value={query} onChange={(e) => setQuery(e.target.value)}/>
                        <Button icon="pi pi-send" className="p-button-primary" onClick={handleGenerate}/>
                    </div>
                </div>
            </Sidebar>
        </>
    );
};

export default GenAI;
