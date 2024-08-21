import React, {useState} from "react";
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import axios from "axios";
import {InputTextarea} from "primereact/inputtextarea";
import {InputText} from "primereact/inputtext";
import {useParams} from "react-router-dom";

export default function FlashCardCreate({getFlashCards, toast}) {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const params = useParams()
    const courseId = params.courseId;


    const create = () => {
        axios.post(process.env.REACT_APP_BACKEND_URL + 'flash_card/create/', {
            title: title,
            content: content,
            week: 12,
            course_id: courseId
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(() => {
            getFlashCards()
            createMessage()
        })
    }

    const createMessage = () => {
        toast('success', 'Success', 'Created Successfully');
    }

    return (
        <>
            <Button className="my-auto ml-2" severity="warning" onClick={() => setVisible(true)}>
                Create
            </Button>
            <Dialog header="Edit Flashcard" visible={visible} style={{width: '60vw', height: '60vh'}} onHide={() => {
                if (!visible) return;
                setVisible(false);
            }}>
                <div className="h-full flex flex-col justify-between">
                    <div className="flex flex-col">
                        <label>Title</label>
                        <InputText type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <div className="flex flex-col">
                        <label>Content</label>
                        <InputTextarea type="text" value={content} className="h-32"
                                       onChange={(e) => setContent(e.target.value)}/>
                    </div>
                    <div className="text-right">
                        <Button label="Save" icon="pi pi-save" severity="info" onClick={create}/>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
