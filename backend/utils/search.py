from huggingface_hub import InferenceClient
import numpy as np
import faiss

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

class SemanticSearch:
    def __init__(self, api_token: str):
        # client to communicate with the Hugging Face API
        self.client = InferenceClient(model=MODEL_NAME, token=api_token)
        self.texts = []
        self.meta = []
        self.index = None

    async def _get_embeddings(self, texts: list[str]) -> np.ndarray:
        """Calls the Hugging Face API to get embeddings using the official client."""
        embeddings = self.client.feature_extraction(texts)
        return np.array(embeddings, dtype=np.float32)

    async def add_texts(self, texts_meta_list: list[dict]):
        """Gets embeddings for valid texts and builds the FAISS index."""
        valid_items = [
            item for item in texts_meta_list 
            if item.get('text') and item.get('text').strip()
        ]
        
        if not valid_items:
            self.texts, self.meta, self.index = [], [], None
            return

        self.texts = [x['text'] for x in valid_items]
        self.meta = [{"start_time": x['start_time'], "end_time": x['end_time']} for x in valid_items]
        
        embeddings = await self._get_embeddings(self.texts)
        
        if embeddings.size == 0:
            self.index = None
            return

        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings)

    async def search(self, query: str, top_k=10, similarity_threshold=0.25):
        """Gets embedding for a query and searches the index."""
        if not self.index or self.index.ntotal == 0:
            return []
            
        query_embedding = await self._get_embeddings([query])
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
        return results