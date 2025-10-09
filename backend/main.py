from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from cachetools import TTLCache
import shutil, os, uuid
from pathlib import Path
from dotenv import load_dotenv
import glob
from pinecone import Pinecone 
from huggingface_hub import InferenceClient

from utils.parse_srt import parse_srt
from utils.search import SemanticSearch

dotenv_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI()
NEXT_CLIENT_URL = os.getenv("NEXT_CLIENT_URL")

origins = [
    NEXT_CLIENT_URL,
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN")
if not HUGGING_FACE_TOKEN:
    raise ValueError("HUGGING_FACE_TOKEN environment variable not set")
sessions = TTLCache(maxsize=500, ttl=300)

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY environment variable not set")

PINECONE_INDEX_NAME = "that-line-index"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
hf_client = InferenceClient(model=MODEL_NAME, token=HUGGING_FACE_TOKEN)
pc = Pinecone(api_key=PINECONE_API_KEY)
pinecone_index = pc.Index(PINECONE_INDEX_NAME)

class SearchRequest(BaseModel):
    query: str
    session_id: str

class LibrarySearchRequest(BaseModel):
    query: str
    movie_id: str


# for upload and search

@app.post("/upload_srt")
async def upload_srt(file: UploadFile = File(...)):
    if not file.filename.endswith(".srt"):
        raise HTTPException(status_code=400, detail="Invalid file type.")

    session_id = str(uuid.uuid4())
    file_path = f"temp_{session_id}_{file.filename}"

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        semantic_search = SemanticSearch(api_token=HUGGING_FACE_TOKEN)
        parsed_subs = parse_srt(file_path)
        await semantic_search.add_texts(parsed_subs)
        
        sessions[session_id] = semantic_search
        
        return {
            "status": "success", 
            "message": f"Uploaded {file.filename} with {len(parsed_subs)} lines.",
            "session_id": session_id
        }
    except Exception as e:
        print(f"An error occurred during upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/search")
async def search(request: SearchRequest):
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found or has expired.")
    
    try:
        semantic_search = sessions[request.session_id]
        results = await semantic_search.search(request.query)

        sorted_results = sorted(results, key=lambda item: item['score'], reverse=True)

        return {"status": "success", "results": sorted_results}
    except Exception as e:
        print(f"An error occurred during search: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# for librabry search

# @app.get("/library/movies")
# async def get_library_movies():
#     """Returns a list of available movies from the pre-processed library."""
#     srt_files_path = os.path.join(Path(__file__).parent.parent, 'srt_files', '*.srt')
#     srt_files = glob.glob(srt_files_path)
#     movie_ids = sorted([os.path.basename(f).replace('.srt', '') for f in srt_files])
#     return {"movies": movie_ids}

@app.get("/library/movies")
async def get_library_movies():
    """Returns a list of available movies by fetching namespaces from Pinecone."""
    try:
        stats = pinecone_index.describe_index_stats()
        movie_ids = sorted(list(stats['namespaces'].keys()))
        return {"movies": movie_ids}
    except Exception as e:
        print(f"Could not fetch movie list from Pinecone: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch movie list from database.")


@app.post("/library/search")
async def library_search(request: LibrarySearchRequest):
    """Performs a semantic search within a specific movie in the Pinecone library."""
    try:

        SIMILARITY_THRESHOLD = 0.4
        query_embedding = hf_client.feature_extraction(request.query)
        
        query_vector_as_list = query_embedding.tolist()
        
        query_results = pinecone_index.query(
            vector=query_vector_as_list,
            top_k=7,
            include_metadata=True,
            namespace=request.movie_id
        )
        
        results = []
        for match in query_results['matches']:
            if match['score'] >= SIMILARITY_THRESHOLD:
                results.append({
                    "text": match['metadata']['text'],
                    "start_time": match['metadata']['start_time'],
                    "end_time": match['metadata']['end_time'],
                    "score": match['score']
                })
        return {"status": "success", "results": results}
    except Exception as e:
        print(f"An error occurred during library search: {e}")
        raise HTTPException(status_code=500, detail=str(e))