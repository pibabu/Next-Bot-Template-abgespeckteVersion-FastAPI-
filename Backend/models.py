from pydantic import BaseModel, Field
#from typing import Optional, List
from json import JSONEncoder



# class RapRequest(BaseModel):
#     role: str #= Field(default="user", description="Supported values are: 'system', 'assistant', 'user', 'function', and 'tool'")
#     content: str

class RapRequest(BaseModel):
    role: str = Field(default="user", description="Supported values are: 'system', 'assistant', 'user', 'function', and 'tool'")
    message: str

class RapResponse(BaseModel):
    response: str
    
class Message(BaseModel):
        message: str


# class ChatCompletionRequest(BaseModel):
#     model: str = Field(default="gpt-4o-mini", description="The name of the model to use")
#     temperature: Optional[float] = Field(1.0, description="Sampling temperature", ge=0, le=1)
#     max_tokens: Optional[int] = Field(16, description="Maximum number of tokens to generate", ge=0)
#     prompt: str
#     top_p: Optional[float] = Field(1.0, description="Nucleus sampling", ge=0, le=1)
#     logit_bias: Optional[dict] = None
#     user: Optional[str] = None
#     n: Optional[int] = Field(1, description="Number of completions to generate", ge=1, le=128)
#     stream: Optional[bool] = False
#     logprobs: Optional[int] = Field(None, ge=0, le=5)
#     suffix: Optional[str] = None
#     echo: Optional[bool] = False
#     stop: Optional[List[str]] = None
#     presence_penalty: Optional[float] = Field(0.0, description="Presence penalty", ge=-2.0, le=2.0)
#     frequency_penalty: Optional[float] = Field(0.0, description="Frequency penalty", ge=-2.0, le=2.0)
#     best_of: Optional[int] = Field(1, description="Generates best_of completions", ge=1, le=128)