from fastapi import FastAPI, Query
from models import RapRequest, RapResponse
from utils import get_response_openai

app = FastAPI()


@app.get("/ok")
async def ok_endpoint():
    return {"message": "ok"}

@app.get("/hello")
async def hello_endpoint(name: str = 'World'):
    return {"message": f"Hello, {name}!"}



@app.post("/api/text", response_model=RapResponse)
async def rap_endpoint(rap_request: RapRequest):
    response = get_response_openai(rap_request)
    return response