from openai import AsyncAzureOpenAI #AzureOpenAI
from string import Template
# from decouple import config 
import os
import sys

# client = AzureOpenAI(
#   api_key = os.getenv("AZURE_OPENAI_API_KEY"),  
#   api_version = "2024-02-01",
#   azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT") 
# )

async_client = AsyncAzureOpenAI(
  api_key = os.getenv("AZURE_OPENAI_API_KEY"),  
  api_version = "2024-02-01",
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT") 
)

prompt_template = Template("""
Answer the question based on the context, in a concise manner, in markdown and using bullet points where applicable.

Context: $context
Question: $question
Answer:
""")


# def get_embedding(text: str):
#     return client.embeddings.create(
#         model="text-embedding-ada-002",
#         input=text,
#     ).data[0].embedding


async def stream_completion(question: str):
    # context = "\n".join([doc.get("page_content") for doc in docs])
    prompt = prompt_template.substitute(question=question)
    
    response = await async_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": prompt},
        ],
        stream=True
    )
    # async for chunk in response:
    #     content = chunk.choices[0].delta.content
    #     if content:
    #         yield content
            
   
    # Stream the completion for the given question
    async for chunk in response:
        content = chunk.choices[0].delta.content
        if content:
            yield content
