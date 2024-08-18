import React, { useState, useRef } from "react";
import Sidenav from "../Sidenav";
import {
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import Editor from "@monaco-editor/react";

import questions from "./Questions";
import axios from "axios";
import base64 from "base-64";

const files = {
  "script.py": {
    name: "script.py",
    language: "python",
    value: "# some comment",
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: "<!-- some comment -->",
  },
};

const Code = () => {
  const [fileName, setFileName] = useState("script.py");
  const file = files[fileName];
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
              <Typography variant="subtitle1" style={{ marginTop: "10px", color: "red", fontWeight: "bold" }}>
                  Deadline: {selectedQuestion.deadline}
                </Typography>
                <Typography variant="h5">
                  {selectedQuestion.question}
                </Typography>
                <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
                  Function Name: {selectedQuestion.functionName}
                </Typography>
                <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
                  Explanation: {selectedQuestion.explanation}
                </Typography>
                <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
                  Examples:
                </Typography>
                {selectedQuestion.examples.map((example, index) => (
                  <Card key={index} style={{ marginTop: "10px" }}>
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
                <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
                  Public Test Cases:
                </Typography>
                {selectedQuestion.testCases.map((testCase, index) => (
                  <Card key={index} style={{ marginTop: "10px" }}>
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
                <Button
                  variant="outlined"
                  onClick={() => setFileName("script.py")}
                >
                  Switch to script.py
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setFileName("index.html")}
                >
                  Switch to index.html
                </Button>
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
                      path={file.name}
                      defaultLanguage={file.language}
                      defaultValue={file.value}
                    />
                  </CardContent>
                </Card>
              </Grid>
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
