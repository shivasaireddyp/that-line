from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil, os, uuid
from pydantic import BaseModel
from typing import Dict
from cachetools import TTLCache

from utils.parse_srt import parse_srt
from utils.search import SemanticSearch

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# This will hold separate search instances for each uploaded file
# sessions: Dict[str, SemanticSearch] = {}

# Each session will automatically expire and be removed after 2 hours (7200 seconds).
sessions = TTLCache(maxsize=500, ttl=300)

# Pydantic model for the search request body
class SearchRequest(BaseModel):
    query: str
    session_id: str

@app.post("/upload_srt")
async def upload_srt(file: UploadFile = File(...)):

    if len(sessions) >= sessions.maxsize:
        # If full, raise a 503 Service Unavailable error
        raise HTTPException(
            status_code=503, 
            detail="The server is currently at maximum capacity. Please try again in a few minutes."
        )

    if not file.filename.endswith(".srt"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please try to upload an .srt file.")

    session_id = str(uuid.uuid4())
    file_path = f"temp_{session_id}_{file.filename}"

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Create a new SemanticSearch instance for this session
        semantic_search = SemanticSearch()
        parsed_subs = parse_srt(file_path)
        semantic_search.add_texts(parsed_subs)
        
        # Store it in our sessions dictionary
        sessions[session_id] = semantic_search
        
        os.remove(file_path)
        
        return {
            "status": "success", 
            "message": f"Uploaded {file.filename} with {len(parsed_subs)} lines.",
            "session_id": session_id # Return the ID to the frontend
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search")
async def search(request: SearchRequest):
    # Check if the session_id is valid
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Your session is expired. Please upload a file again.")
    
    try:
        semantic_search = sessions[request.session_id]
        results = semantic_search.search(request.query)
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))