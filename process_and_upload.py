import os
import glob
import re
import pysrt
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from pinecone import Pinecone
from tqdm import tqdm
import numpy as np

dotenv_path = os.path.join('backend', '.env')
load_dotenv(dotenv_path=dotenv_path)

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN")
PINECONE_INDEX_NAME = "that-line-index" 
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
SRT_FILES_PATH = "srt_files/*.srt"

def parse_and_clean_srt(file_path):
    subs = pysrt.open(file_path, encoding='iso-8859-1')
    parsed = []
    for i, sub in enumerate(subs):
        clean_text = sub.text.replace('\n', ' ')
        clean_text = re.sub(r'<.*?>', '', clean_text)
        if clean_text.strip():
            parsed.append({
                "line_number": i + 1,
                "text": clean_text.strip(),
                "start_time": str(sub.start),
                "end_time": str(sub.end)
            })
    return parsed

def get_embeddings_in_batches(client, texts, batch_size=32):
    all_embeddings = []
    for i in tqdm(range(0, len(texts), batch_size)):
        batch = texts[i:i + batch_size]
        embeddings = client.feature_extraction(batch)
        all_embeddings.extend(embeddings)
    return np.array(all_embeddings, dtype=np.float32)

def main():

    hf_client = InferenceClient(model=MODEL_NAME, token=HUGGING_FACE_TOKEN)
    pc = Pinecone(api_key=PINECONE_API_KEY)

    if PINECONE_INDEX_NAME not in pc.list_indexes().names():
        print(f"Index '{PINECONE_INDEX_NAME}' not found. Please run the script once to create it first.")
        return
    index = pc.Index(PINECONE_INDEX_NAME)
    print("Connected to Pinecone index.")

    stats = index.describe_index_stats()
    existing_movies = set(stats.get('namespaces', {}).keys())
    print(f"Found {len(existing_movies)} existing movies in Pinecone: {existing_movies if existing_movies else 'None'}")

    all_local_files = glob.glob(SRT_FILES_PATH)
    new_files_to_process = []
    for file_path in all_local_files:
        movie_id = os.path.basename(file_path).replace('.srt', '')
        if movie_id not in existing_movies:
            new_files_to_process.append(file_path)
    
    if not new_files_to_process:
        print("No new movies found to process. Exiting.")
        return
    print(f"Found {len(new_files_to_process)} new movies to process.")

    for file_path in new_files_to_process:
        movie_id = os.path.basename(file_path).replace('.srt', '')
        print(f"\n--- Processing new file: {movie_id} ---")

        subtitles = parse_and_clean_srt(file_path)
        if not subtitles:
            print("No valid subtitle text found. Skipping.")
            continue
        
        texts = [sub['text'] for sub in subtitles]
        embeddings = get_embeddings_in_batches(hf_client, texts)
        
        vectors_to_upload = []
        for i, sub in enumerate(subtitles):
            vector_id = f"{movie_id}-{sub['line_number']}"
            metadata = {
                "text": sub['text'],
                "start_time": sub['start_time'],
                "end_time": sub['end_time']
            }
            vectors_to_upload.append((vector_id, embeddings[i].tolist(), metadata))
        
        print(f"Uploading {len(vectors_to_upload)} vectors to Pinecone namespace '{movie_id}'...")
        for i in tqdm(range(0, len(vectors_to_upload), 100)):
            batch = vectors_to_upload[i:i + 100]
            index.upsert(vectors=batch, namespace=movie_id)

    print("\nupload complete.")
    print(index.describe_index_stats())

if __name__ == "__main__":
    main()