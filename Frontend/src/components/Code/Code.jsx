import React, { useEffect, useRef, useState } from "react";
import Sidenav from "../Sidenav";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Editor from "@monaco-editor/react";
import axios from "axios";
import base64 from "base-64";
import { useParams } from "react-router-dom";
import GenAI from "../GenAI/GenAI";

const Code = () => {
  const params = useParams();
  const courseId = params.courseId;
  const [assignments, setAssignment] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  // const courseId = params.courseId
  const [week, setWeek] = useState(1);
  const [context, setContext] = useState(""); 

  useEffect(() => {
    console.log("Auth token", localStorage.getItem("token"));
    axios
      .get("http://localhost:8000/coding_assignment/get", {
        params: {
          week: week,
          course_id: courseId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("Response:", res.data);
        setCurrentAssignment(res.data);
        if (res.data.language) {
          setFileName(`script.${res.data.language}`);
        }
        setContext(`Use the following context to give response \n Question: \n ${res.data.question}`);
      })
      .catch((err) => {
        console.error("Error fetching programming assignment:", err.response);
        alert(
          "Error fetching programming assignment. Please check the console for details."
        );
      });
  }, []);

  const [fileName, setFileName] = useState("script.py");
  const editorRef = useRef(null);

  // const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [testResults, setTestResults] = useState([]);

  async function runCode() {
    const code = editorRef.current.getValue();
    console.log("Code:", code);
    console.log("Selected Question:", currentAssignment.testCases);
    const encodedCode = base64.encode(code);
    const requestData = {
      code: encodedCode,
      assgn_id: currentAssignment._id,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/coding_assignment/run",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setContext(prevContext => prevContext + `\n Code: \n${code}`);
      
      console.log("Response:", response.data);
      setTestResults(response.data);
    } catch (error) {
      alert(
        `Error running code: ${error.response?.data?.detail || error.message}`
      );
      console.error("Error details:", error);
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
          <div>
            {currentAssignment.assgn_type} Week {currentAssignment.week}
          </div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  //   const countryOptionTemplate = (currentAssignment) => {
  //     return (
  //       <div className="flex align-items-center">
  //         <div>
  //           {currentAssignment.assgn_type} Week {currentAssignment.week}
  //         </div>
  //       </div>
  //     );
  //   };
  //   const handleEditorChange = (value, event) => {
  //     console.log("here is the current model value:", value, event);
  //   };
  return (
    <>
      <Sidenav />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: `${drawerWidth}px` },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={2}>
          {/* Left side: Question */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                {currentAssignment ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      style={{
                        marginTop: "10px",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Deadline:{" "}
                      {new Date(currentAssignment.deadline).toLocaleString()}
                    </Typography>
                    <Typography variant="h5">
                      {currentAssignment.question}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      style={{ marginTop: "10px" }}
                    >
                      <strong>Programming language: </strong>
                      {currentAssignment.language}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      style={{ marginTop: "10px" }}
                    >
                      <strong>Public Test Cases:</strong>
                    </Typography>
                    {currentAssignment.public_testcase.map((example, index) => (
                      <Card key={index} style={{ marginTop: "10px" }}>
                        <CardContent>
                          <Typography>
                            <strong>Input:</strong> {example.input}
                          </Typography>
                          <Typography>
                            <strong>Output:</strong> {example.output}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : (
                  <Typography variant="h5">Loading assignment...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Right side: Code Editor */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <div className="flex align-middle gap-2 justify-center">
                <Button variant="contained" onClick={runCode}>
                  Run Code
                </Button>
                <GenAI context={context} week={12} />
              </div>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Editor
                      height="50vh"
                      width="100%"
                      theme="vs-light"
                      language={
                        currentAssignment
                          ? currentAssignment.language
                          : "python"
                      } // Dynamically set language
                      value={"# Write your code here"}
                      path={fileName}
                      onMount={handleEditorDidMount}
                    />
                  </CardContent>
                </Card>
              </Grid>
              {testResults &&
                testResults.public_testcases &&
                testResults.public_testcases.length > 0 && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h5">Test Results:</Typography>
                        {testResults.public_testcases.map((result, index) => (
                          <div key={index}>
                            <Typography>
                              <strong>Test {index + 1}:</strong> {result.status}
                            </Typography>
                            <Typography>
                              Output: {result.output || "No output available"}
                            </Typography>
                          </div>
                        ))}
                        <Typography>
                          <strong>
                            {testResults.passed_public_count || "0/0"} public
                            test cases passed.{" "}
                          </strong>
                        </Typography>
                        <Typography>
                          <strong>
                            {testResults.passed_private_count || "0/0"} private
                            test cases passed.{" "}
                          </strong>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Code;
