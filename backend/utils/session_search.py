# in backend/utils/session_search.py

from huggingface_hub import InferenceClient
import numpy as np
import faiss

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

class SessionSearch:
    def __init__(self, api_token: str):
        self.client = InferenceClient(model=MODEL_NAME, token=api_token)
        self.texts = []
        self.meta = []
        self.index = None

    def get_embeddings(self, texts: list[str]) -> np.ndarray:
        valid_texts = [text for text in texts if text and text.strip()]
        if not valid_texts:
            return np.array([]).reshape(0, 384)
        
        embeddings = self.client.feature_extraction(valid_texts)
        return np.array(embeddings, dtype=np.float32)

    def add_texts(self, texts_meta_list: list[dict]):
        valid_items = [
            item for item in texts_meta_list 
            if item.get('text') and item.get('text').strip()
        ]
        if not valid_items:
            self.texts, self.meta, self.index = [], [], None
            return

        self.texts = [x['text'] for x in valid_items]
        self.meta = [{"start_time": x['start_time'], "end_time": x['end_time']} for x in valid_items]
        
        embeddings = self.get_embeddings(self.texts)
        
        if embeddings.size == 0:
            self.index = None
            return

        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings)

    def search(self, query: str, top_k=5, similarity_threshold=0.5):
        if not self.index or self.index.ntotal == 0:
            return []
            
        query_embedding = self.get_embeddings([query])
        faiss.normalize_L2(query_embedding)

        distances, indices = self.index.search(query_embedding, top_k)
        
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            similarity = 1 - (dist**2 / 2)
            if similarity >= similarity_threshold:
                results.append({
                    "text": self.texts[idx],
                    "start_time": self.meta[idx]["start_time"],
                    "end_time": self.meta[idx]["end_time"],
                    "score": float(similarity)
                })
        return sorted(results, key=lambda item: item['score'], reverse=True)