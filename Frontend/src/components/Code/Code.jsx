import React, {useEffect, useRef, useState} from "react";
import Sidenav from "../Sidenav";
import {Box, Button, Card, CardContent, Grid, Typography,} from "@mui/material";
import Editor from "@monaco-editor/react";

import questions from "./Questions";
import axios from "axios";
import base64 from "base-64";
import {Dropdown} from "primereact/dropdown";
import {useParams} from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {ChevronDownIcon} from "primereact/icons/chevrondown";

const Code = () => {
    const params = useParams()
    const [assignments, setAssignment] = useState([]);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const courseId = params.courseId
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + `course/get_all_assignment?course_id=${courseId}`, {
            headers:
                {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                }
        })
            .then((res) => {
                setAssignment(res.data)
            })
            .catch(err => {
                console.error("Error fetching courses:", err);
            });
    }, []);

    const [fileName, setFileName] = useState("script.py");
    const editorRef = useRef(null);

    const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
    const [testResults, setTestResults] = useState([]);

    async function runCode() {
        const code = editorRef.current.getValue();
        console.log("Code:", code);
        console.log("Selected Question:", selectedQuestion.testCases);
        const encodedCode = base64.encode(code);
        const requestData = {
            code: encodedCode,
            test_cases: selectedQuestion.testCases,
        };
        try {
            const response = await axios.post(
                "http://localhost:8000/run",
                requestData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Response:", response.data);
            setTestResults(response.data);
        } catch (error) {
            alert("Error running code:", error);
        }
    }

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    const drawerWidth = 240;

    const selectedCountryTemplate = (currentAssignment, props) => {
        if (currentAssignment) {
            return (
                <div className="flex align-items-center">
                    <div>{currentAssignment.assgn_type} Week {currentAssignment.week}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const countryOptionTemplate = (currentAssignment) => {
        return (
            <div className="flex align-items-center">
                <div>{currentAssignment.assgn_type} Week {currentAssignment.week}</div>
            </div>
        );
    };
    const handleEditorChange = (value, event) => {
        console.log('here is the current model value:', value, event);
    }
    return (
        <>
            <Sidenav/>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: {sm: `${drawerWidth}px`},
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div className="card flex justify-content-center">
                    <Dropdown value={currentAssignment} onChange={(e) => setCurrentAssignment(e.value)}
                              options={assignments} optionLabel="name" placeholder="Select a Country"
                              valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate}
                              className="w-full md:w-14rem"
                              dropdownIcon={(opts) => {
                                  return opts.iconProps['data-pr-overlay-visible'] ?
                                      <ChevronRightIcon {...opts.iconProps} /> :
                                      <ChevronDownIcon {...opts.iconProps} />;
                              }}/>
                </div>
                <Grid container spacing={2}>
                    {/* Left side: Question */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1"
                                            style={{marginTop: "10px", color: "red", fontWeight: "bold"}}>
                                    Deadline: {selectedQuestion.deadline}
                                </Typography>
                                <Typography variant="h5">
                                    {selectedQuestion.question}
                                </Typography>
                                <Typography variant="subtitle1" style={{marginTop: "10px"}}>
                                    Function Name: {selectedQuestion.functionName}
                                </Typography>
                                <Typography variant="subtitle1" style={{marginTop: "10px"}}>
                                    Explanation: {selectedQuestion.explanation}
                                </Typography>
                                <Typography variant="subtitle1" style={{marginTop: "10px"}}>
                                    Examples:
                                </Typography>
                                {selectedQuestion.examples.map((example, index) => (
                                    <Card key={index} style={{marginTop: "10px"}}>
                                        <CardContent>
                                            <Typography>
                                                <strong>Input:</strong> {JSON.stringify(example.input)}
                                            </Typography>
                                            <Typography>
                                                <strong>Output:</strong> {example.output}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Typography variant="subtitle1" style={{marginTop: "10px"}}>
                                    Public Test Cases:
                                </Typography>
                                {selectedQuestion.examples.map((testCase, index) => (
                                    <Card key={index} style={{marginTop: "10px"}}>
                                        <CardContent>
                                            <Typography>
                                                <strong>Input:</strong> {JSON.stringify(testCase.input)}
                                            </Typography>
                                            <Typography>
                                                <strong>Expected Output:</strong>{" "}
                                                {testCase.expectedOutput}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right side: Code Editor */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button variant="contained" onClick={runCode}>
                                    Run Code
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Editor
                                            height="50vh"
                                            width="100%"
                                            theme="vs-light"
                                            onMount={handleEditorDidMount}
                                            handleEditorChange={handleEditorChange}
                                        />

                                    </CardContent>

                                </Card>
                            </Grid>
                            <Button label="Submit" icon="pi pi-check" onClick={() => {console.log("kjhd")}} />
                            <Grid item xs={12}>
                                {testResults.length > 0 && (
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h5">Test Results:</Typography>
                                            {testResults.map((result, index) => (
                                                <div key={index}>
                                                    <Typography>
                                                        Test {index + 1}: {result.pass ? "Pass" : "Fail"}
                                                    </Typography>
                                                    <Typography>
                                                        Input: {result.input}, Expected: {result.expected},
                                                        Output: {result.output}
                                                    </Typography>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Code;
