from fastapi import FastAPI, WebSocket
# from models import RapRequest, RapResponse
# from utils import get_response_openai
from fastapi.middleware.cors import CORSMiddleware

from utils2 import stream_completion
#from fastapi.responses import JSONResponse
from models import Message
import json

app = FastAPI()


origins = [
        "http://localhost:3000/"
    ]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
    )


@app.get("/ok")
async def ok_endpoint():
    return {"message": "ok"}

@app.get("/hello")
async def hello_endpoint(name: str = 'World'):
    return {"message": f"Hello, {name}!"}



# @app.post("/api/text", response_model=RapResponse)
# async def rap_endpoint(rap_request: RapRequest):
#     response = get_response_openai(rap_request)
#     return response

@app.websocket('/async_chat')
async def async_chat(websocket: WebSocket):
        await websocket.accept()
        while True:
            try:
                data = await websocket.receive_text()  # Receive text from the client
                message_data = Message.model_validate_json(data)  # Validate and parse the incoming data
                question = message_data.message  # Access the message content
            
                async for event in stream_completion(question):
                    if event["event_type"] == "done":
                        await websocket.close()
                        return
                    else:
                        await websocket.send_text(json.dumps(event))  # Send event data back to the client
            except Exception as e:
                print(f"Error: {e}")  # Log any errors
                await websocket.close()  # Close the connection on error
                break
            
            
# @app.post("/chat", description="Chat")
# async def chat(message: Message):
#         response = get_answer_and_docs(message.message)
#         response_content = {
#             "question": message.message,
#             "answer": response["answer"],
#         }
#         return JSONResponse(content=response_content, status_code=200)