# import os
# from fastapi import APIRouter
# from pydantic import BaseModel
# # import google.generativeai as genai
# from google import genai
# from dotenv import load_dotenv


# # Load environment variables
# load_dotenv()

# # # Configure Gemini API
# # genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# client=genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
# # Initialize model
# # model = genai.GenerativeModel("gemini-2.5-flash")

# from fastapi import APIRouter
# from google import genai
# import os
# from dotenv import load_dotenv

# load_dotenv()

# router = APIRouter()

# client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# @router.get("/ai")
# def get_ai_response():
#     response = client.models.generate_content(
#         model="gemini-1.5-flash",
#         contents="Explain Artificial Intelligence"
#     )
    
#     return {"result": response.text}
# # Initialize chat session (memory)
# chat = model.start_chat(history=[])

# # Create router
# router = APIRouter(
#     prefix="/chat",
#     tags=["AI Chat"]
# )

# # Request schema
# class ChatRequest(BaseModel):
#     message: str

# # Chat endpoint
# @router.post("/")
# def chat_api(request: ChatRequest):
#     user_input = request.message
#     response = chat.send_message(user_input)
#     return {"reply": response.text}

import os
from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

# Load env
load_dotenv()

# Create router
router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)

# Initialize Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Request schema
class ChatRequest(BaseModel):
    message: str

# Simple chat (no memory)
@router.post("/")
def chat_api(request: ChatRequest):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=request.message
    )

    return {"reply": response.text}