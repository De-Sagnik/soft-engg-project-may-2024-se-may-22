import React, {useState} from "react";
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import axios from "axios";
import {InputTextarea} from "primereact/inputtextarea";
import {InputText} from "primereact/inputtext";

export default function EditFlashCard({flashcard, getFlashCards, toast}) {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState(flashcard.title);
    const [content, setContent] = useState(flashcard.content);


    const deleteFlashCard = () => {
        axios.delete(process.env.REACT_APP_BACKEND_URL + 'flash_card/delete/' + flashcard._id, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(() => {
            getFlashCards()
            showDeleteMessage()
        })
    }

    const editFlashCard = () => {
        axios.put(process.env.REACT_APP_BACKEND_URL + 'flash_card/update/' + flashcard._id, {
            title: title,
            content: content,
            week: flashcard.week,
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(() => {
            getFlashCards()
            showUpdateMessage()
        })
    }

    const showDeleteMessage = () => {
        console.log(toast)
        toast('success', 'Success', 'Deleted Successfully');
    }
    const showUpdateMessage = () => {
        console.log(toast)
        toast('success', 'Success', 'Updated Successfully');
    }

    return (
        <>
            <Button icon="pi pi-pencil" className="-mt-5 -mr-5" rounded text aria-label="Filter"
                    onClick={() => setVisible(true)}/>
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
                        <InputTextarea type="text" value={content} className="h-32" onChange={(e) => setContent(e.target.value)}/>
                    </div>
                    <div className="flex justify-between">
                        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={() => deleteFlashCard()}/>
                        <Button label="Save" icon="pi pi-save" severity="info" onClick={editFlashCard}/>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
