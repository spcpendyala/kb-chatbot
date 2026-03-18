from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ingest, chat, documents
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title='Knowledge Base Chatbot API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(ingest.router, prefix='/api/v1')
app.include_router(chat.router, prefix='/api/v1')
app.include_router(documents.router, prefix='/api/v1')

@app.get('/health')
def health():
    return {'status': 'healthy', 'service': 'knowledge-base-chatbot'}
