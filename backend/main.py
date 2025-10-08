from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from cachetools import TTLCache
import shutil, os, uuid
from pathlib import Path
from dotenv import load_dotenv

from utils.parse_srt import parse_srt
from utils.search import SemanticSearch

# Load environment variables from the .env file
# load_dotenv()
dotenv_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=dotenv_path)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Get the API token from environment variables
API_TOKEN = os.getenv("HUGGING_FACE_TOKEN")
if not API_TOKEN:
    raise ValueError("HUGGING_FACE_TOKEN environment variable not set")

sessions = TTLCache(maxsize=500, ttl=300)

class SearchRequest(BaseModel):
    query: str
    session_id: str

@app.post("/upload_srt")
async def upload_srt(file: UploadFile = File(...)):
    if not file.filename.endswith(".srt"):
        raise HTTPException(status_code=400, detail="Invalid file type.")

    session_id = str(uuid.uuid4())
    file_path = f"temp_{session_id}_{file.filename}"

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        semantic_search = SemanticSearch(api_token=API_TOKEN)
        parsed_subs = parse_srt(file_path)
        await semantic_search.add_texts(parsed_subs)
        
        sessions[session_id] = semantic_search
        # os.remove(file_path)
        
        return {
            "status": "success", 
            "message": f"Uploaded {file.filename} with {len(parsed_subs)} lines.",
            "session_id": session_id
        }
    except Exception as e:
        # It's good practice to log the actual error on the server
        print(f"An error occurred during upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # This block will ALWAYS run, ensuring the temp file is deleted.
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/search")
async def search(request: SearchRequest):
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found or has expired.")
    
    try:
        semantic_search = sessions[request.session_id]
        results = await semantic_search.search(request.query)
        return {"status": "success", "results": results}
    except Exception as e:
        print(f"An error occurred during search: {e}")
        raise HTTPException(status_code=500, detail=str(e))



