from openai import AzureOpenAI
import os
import sys
from models import RapRequest, RapResponse

client = AzureOpenAI(
  api_key = os.getenv("AZURE_OPENAI_API_KEY"),  
  api_version = "2024-02-01",
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT") 
)

system_promt = "You will edit the following message based on included instructions and comments. If its anormal conversation, act as an assistant"
def get_response_openai(rap_request: RapRequest) -> RapResponse:
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_promt},
                {"role": rap_request.role, "content": rap_request.message},
            ],
        )
    
        if response.choices and response.choices[0].message.content:
            return RapResponse(response=response.choices[0].message.content)
        else:
            return RapResponse(response="No valid response received from OpenAI.")

    except Exception as e:
        error_message = f"Error in creating stuff from OpenAI: {str(e)}"
        print(error_message, file=sys.stderr)
        return RapResponse(response=f"An error occurred: {error_message}")