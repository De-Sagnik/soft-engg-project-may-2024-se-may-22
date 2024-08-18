from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
from typing import List, Any
import base64

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust the origin(s) as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class TestCase(BaseModel):
    input: Any
    expectedOutput: Any

class CodeExecutionRequest(BaseModel):
    code: str
    test_cases: List[TestCase]

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/run")
async def run_code(request: CodeExecutionRequest):
    code = base64.b64decode(request.code).decode()
    print(code)
    test_cases = request.test_cases
    results = []
    
    try:
        exec_globals = {}
        exec(code, exec_globals)
        functions = [obj for obj in exec_globals.values() if callable(obj)]
        
        if not functions:
            raise ValueError("No callable function found in the provided code.")
        
        function = functions[0]

        for test in test_cases:
            input_data = test.input
            expectedOutput = test.expectedOutput
            
            try:
                output = function(*input_data)
                
                results.append({
                    'input': input_data,
                    'expected': expectedOutput,
                    'output': output,
                    'pass': output == expectedOutput
                })
            except Exception as e:
                results.append({
                    'input': input_data,
                    'expected': expectedOutput,
                    'output': str(e),
                    'pass': False
                })
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return results

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
