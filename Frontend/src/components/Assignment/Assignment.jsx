"use client";
import React, {useEffect, useRef, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Sidenav from "../Sidenav";
import axios from "axios";
import {useParams} from "react-router-dom";
import {Toast} from "primereact/toast";

const QuestionCard = ({question, handle_answer_change, user_answers}) => {
    const handleChange = (event) => {
        if (question.q_type === "MCQ") {
            handle_answer_change(question._id, event.target.value);
        } else if (question.q_type === "MSQ") {
            const currentAnswers = user_answers[question._id] || [];
            const newAnswers = event.target.checked
                ? [...currentAnswers, event.target.value]
                : currentAnswers.filter((answer) => answer !== event.target.value);
            handle_answer_change(question._id, newAnswers);
        } else if (question.q_type === "Numerical") {
            handle_answer_change(question._id, event.target.value);
        }
    };

    const renderOptions = () => {
        if (question.q_type === "MCQ") {
            return (

                <FormControl component="fieldset">
                    <RadioGroup
                        name={`question-${question.id}`}
                        onChange={handleChange}
                    >
                        {question.options &&
                            question.options.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={option}
                                    control={<Radio/>}
                                    label={option}
                                />
                            ))}
                    </RadioGroup>
                </FormControl>
                
            );
        } else if (question.q_type === "MSQ") {
            return (
                <FormControl component="fieldset">
                    {question.options &&
                        question.options.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                control={<Checkbox value={option} onChange={handleChange}/>}
                                label={option}
                            />
                        ))}
                </FormControl>
            );
        } else if (question.q_type === "Numerical") {
            return (
                <TextField
                    type="number"
                    label="Your Answer"
                    variant="outlined"
                    onChange={handleChange}
                />
            );
        }
    };

    return (
        <Card variant="outlined" style={{marginBottom: "16px"}}>
            <CardContent>
                <div className="whitespace-pre-wrap">
                    {question.question}
                </div>
                {renderOptions()}
            </CardContent>
        </Card>
    );
};


const Assignment = () => {
    const params = useParams();
    const courseId = params.courseId;
    const [questions, setQuestions] = useState([]);
    const [week, setWeek] = useState(1);
    const [assgnType, setAssgnType] = useState("GA");
    const [deadline, setDeadline] = useState("");
    const [user_answers, setUserAnswers] = useState({});

    const [open, setOpen] = useState(false);  // Define setOpen here
    const [generatedQuestions, setGeneratedQuestions] = useState([]);

    const [userSelections, setUserSelections] = useState({});
    const [highlightedAnswers, setHighlightedAnswers] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);


    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/course/get_assignment?course_id=${courseId}&week=${week}&assgn_type=${assgnType}`,
                    {
                        headers: {
                            Authorization: `Bearer ` + localStorage.getItem("token"),
                        },
                    }
                );
                if (Array.isArray(response.data)) {
                    setQuestions(response.data);
                    setDeadline(response.data[0]?.deadline);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchQuestions();
    }, [courseId, week, assgnType]);

    const handle_answer_change = (questionId, answer) => {
        console.log("Setting answer for question", questionId, answer);
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    const handleGenerate = async () => {
        try {
            const noteContent = questions.map((q) => q.question).join(" "); // Combine all questions into one text
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}generate_assignment_questions`,
                {text: noteContent},
                {
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("token"),
                    },
                }
            );

            const handleSubmit = () => {
                const newHighlightedAnswers = {};

                generatedQuestions.forEach((questionObj) => {
                    const userAnswer = userSelections[questionObj.question];
                    if (userAnswer === questionObj.correct_option) {
                        newHighlightedAnswers[questionObj.question] = 'correct';
                    } else {
                        newHighlightedAnswers[questionObj.question] = 'incorrect';
                    }
                });

                setHighlightedAnswers(newHighlightedAnswers);
                setHasSubmitted(true); // Set flag to true when form is submitted
            };

            setGeneratedQuestions(response.data.questions);
            setOpen(true); // Open the modal
        } catch (error) {
            console.error("Error generating questions:", error);
        }
    };

    const handleOptionChange = (questionId, option) => {
        setUserSelections((prevSelections) => ({
            ...prevSelections,
            [questionId]: option
        }));
    };


    const handleSubmit = () => {
        const newHighlightedAnswers = {};

        generatedQuestions.forEach((questionObj) => {
            const userAnswer = userSelections[questionObj.question];
            if (userAnswer === questionObj.correct_option) {
                newHighlightedAnswers[questionObj.question] = 'correct';
            } else {
                newHighlightedAnswers[questionObj.question] = 'incorrect';
            }
        });

        setHighlightedAnswers(newHighlightedAnswers);
    };


    const handle_answers_submit = async () => {
        const today = new Date();
        const deadline_date = new Date(deadline);

        if (today > deadline_date) {
            show("Deadline has passed", "danger");
            return;
        }

        let user_id = localStorage.getItem("user_id");
        if (!user_id) {
            try {
                const response = await axios.get("http://localhost:8000/user/me", {
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("token"),
                    },
                });
                user_id = response.data.user_id;
                localStorage.setItem("user_id", user_id);
            } catch (err) {
                console.error(err);
                show("Error fetching user details", "danger");
                return;
            }
        }

        const load = []

        for (const [questionId, answer] of Object.entries(user_answers)) {
            load.push({
                assgn_id: questionId,
                user_id: user_id,
                answer: [answer],
            })
        }

        try {
            await axios.post(
                "http://localhost:8000/user/submit_answers",
                load,
                {
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
        } catch (err) {
            console.error(err);
            show("Error submitting answers", "danger");
        }
        show("All answers submitted successfully", "success");
    }
    const toast = useRef(null);

    const show = (message, severity = 'info') => {
        toast.current.show({severity: severity, summary: 'Info', detail: message});
    };


    return (
        <>
            <Toast ref={toast}/>
            <Sidenav/>
            <Box marginLeft="280px" marginRight="40px" marginTop="20px">
                {/* Filters */}
                <Box display="flex" gap="20px" marginBottom="20px">
                    <FormControl variant="outlined" style={{minWidth: 120}}>
                        <InputLabel>Week</InputLabel>
                        <Select
                            value={week}
                            onChange={(e) => setWeek(e.target.value)}
                            label="Week"
                        >
                            {Array.from({length: 12}, (_, i) => i + 1).map((week) => (
                                <MenuItem key={week} value={week}>
                                    Week {week}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" style={{minWidth: 120}}>
                        <InputLabel>Assignment Type</InputLabel>
                        <Select
                            value={assgnType}
                            onChange={(e) => setAssgnType(e.target.value)}
                            label="Assignment Type"
                        >
                            <MenuItem value="AQ">AQ</MenuItem>
                            <MenuItem value="PA">PA</MenuItem>
                            <MenuItem value="GA">GA</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Deadline */}

                {/* Questions or No Questions Message */}
                {questions && Array.isArray(questions) && questions.length > 0 ? (
                    <>
                        <Typography
                            variant="subtitle1"
                            style={{marginTop: "10px", color: "red", fontWeight: "bold"}}
                        >
                            Deadline: {new Date(deadline).toLocaleString()}
                        </Typography>
                        {questions.map((question) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                handle_answer_change={handle_answer_change}
                                user_answers={user_answers}
                            />
                        ))}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGenerate}>
                            Generate Similar Questions
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handle_answers_submit}
                            style={{right: "-5px"}}>
                            Submit
                        </Button>

                    </>
                ) : (
                    <Typography variant="h6" style={{marginTop: "20px", color: "gray"}}>
                        No questions here. Try changing the filters.
                    </Typography>
                )}
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Generated Questions</DialogTitle>
                <DialogContent>
                    {generatedQuestions.map((questionObj, index) => (
                        <div key={index} style={{marginBottom: "20px"}}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Question {index + 1}:</strong> {questionObj.question}
                            </Typography>
                            <Typography variant="body2">
                                {/* <FormControlLabel
        control={
          <Checkbox
            checked={userSelections[questionObj.question] === questionObj.option1}
            onChange={() => handleOptionChange(questionObj.question, questionObj.option1)}
            color="primary"
            style={{ borderRadius: '50%' }}
          />
        }
        label={<strong>Option 1:</strong> + questionObj.option1}
      /> */}

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={userSelections[questionObj.question] === questionObj.option1}
                                            onChange={() => handleOptionChange(questionObj.question, questionObj.option1)}
                                            color="primary"
                                            style={{borderRadius: '50%'}}
                                        />
                                    }
                                    label={<span><strong></strong> {questionObj.option1}</span>}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={userSelections[questionObj.question] === questionObj.option2}
                                            onChange={() => handleOptionChange(questionObj.question, questionObj.option2)}
                                            color="primary"
                                            style={{borderRadius: '50%'}}
                                        />
                                    }
                                    label={<span><strong></strong> {questionObj.option2}</span>}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={userSelections[questionObj.question] === questionObj.option3}
                                            onChange={() => handleOptionChange(questionObj.question, questionObj.option3)}
                                            color="primary"
                                            style={{borderRadius: '50%'}}
                                        />
                                    }
                                    label={<span><strong></strong> {questionObj.option3}</span>}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={userSelections[questionObj.question] === questionObj.option4}
                                            onChange={() => handleOptionChange(questionObj.question, questionObj.option4)}
                                            color="primary"
                                            style={{borderRadius: '50%'}}
                                        />
                                    }
                                    label={<span><strong></strong> {questionObj.option4}</span>}
                                />
                            </Typography>
                            {highlightedAnswers[questionObj.question] && (
                                <Typography
                                    variant="body2"
                                    style={{
                                        marginTop: "10px",
                                        color: highlightedAnswers[questionObj.question] === 'correct' ? 'green' : 'red'
                                    }}
                                >
                                    <strong>Correct Option:</strong> {questionObj.correct_option}
                                </Typography>
                            )}
                        </div>
                    ))}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <br></br>
            <br></br>


        </>
    );
}


export default Assignment;
