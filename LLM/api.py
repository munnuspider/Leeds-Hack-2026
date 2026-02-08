from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from llm import qa_chain

app = FastAPI()

# Allow all origins (good for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This allows ALL origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str

@app.post("/ask")
def ask_question(q: Question):
    try:
        response = qa_chain.invoke(q.question)
        answer = response.get("result", "No answer.")
        return {"answer": answer}
    except Exception as e:
        return {"answer": f"Error: {str(e)}"}

@app.get("/")
def read_root():
    return {"message": "Leafy Chatbot API is running! 🌱"}