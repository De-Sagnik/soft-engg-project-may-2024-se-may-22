import axios from "axios";

export async function generate_flashcard(query, course_id) {
    await axios.post(`http://localhost:8000/flash_card/generate`, {
        title: query,
        course_id: course_id,
        week: 12,
        content: ''
    }, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => {
            console.log("Flashcard:", response.data);

        })
        .catch(error => {
            console.error("Error generating flashcard:", error);
        });

}


export function generate(query, course_id) {
    axios.post(`http://localhost:8000/user/generate`, {query: query, course_id: course_id, week: 12}, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => {
            console.log("Flashcard:", response.data);

        })
        .catch(error => {
            console.error("Error generating flashcard:", error);
        });
}
