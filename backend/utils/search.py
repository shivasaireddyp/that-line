# import httpx
# import numpy as np
# import faiss

# MODEL_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"

# class SemanticSearch:
#     def __init__(self, api_token: str):
#         self.headers = {"Authorization": f"Bearer {api_token}"}
#         # Use an async client for making API calls
#         self.async_client = httpx.AsyncClient(timeout=30)
#         self.texts = []
#         self.meta = []
#         self.index = None

#     async def _get_embeddings(self, texts: list[str]) -> np.ndarray:
#         """Calls the Hugging Face API to get embeddings."""

#         valid_texts = [text for text in texts if text and text.strip()]

#         print("--- DATA SENT TO HUGGING FACE API ---", {"inputs": valid_texts})

#         response = await self.async_client.post(
#             MODEL_URL,
#             headers=self.headers,
#             json={"inputs": valid_texts, "options": {"wait_for_model": True}}
#         )
#         # print("CHECK THIS",response.headers)
#         response.raise_for_status() # Raise an exception for bad status codes
#         # print("Response text:", text.text)  # Debugging line to print the response text
#         embeddings = np.array(response.json(), dtype=np.float32)
#         return embeddings







#     async def add_texts(self, texts_meta_list: list[dict]):
#         """Gets embeddings for valid texts and builds the FAISS index."""

#         # Filter the entire list of items at the beginning
#         valid_items = [
#             item for item in texts_meta_list 
#             if item.get('text') and item.get('text').strip()
#         ]
        
#         if not valid_items:
#             self.texts, self.meta, self.index = [], [], None
#             return

#         self.texts = [x['text'] for x in valid_items]
#         self.meta = [{"start_time": x['start_time'], "end_time": x['end_time']} for x in valid_items]
        
#         embeddings = await self._get_embeddings(self.texts)
        
#         if embeddings.shape[0] == 0:
#             self.index = None
#             return

#         dim = embeddings.shape[1]
#         self.index = faiss.IndexFlatL2(dim)
#         faiss.normalize_L2(embeddings) 
#         self.index.add(embeddings)



#     async def search(self, query: str, top_k=5, similarity_threshold=0.5):
#         """Gets embedding for a query and searches the index."""
#         if not self.index or self.index.ntotal == 0:
#             return []
            
#         # Get query embedding from the API
#         query_embedding = await self._get_embeddings([query])
#         faiss.normalize_L2(query_embedding) # Normalize for cosine similarity

#         distances, indices = self.index.search(query_embedding, top_k)
        
#         results = []
#         for dist, idx in zip(distances[0], indices[0]):
#             # The distance from a normalized L2 search is related to cosine similarity
#             # We can use it directly, but remember lower is better.
#             # Let's convert it to a 0-1 similarity score.
#             similarity = 1 - (dist**2 / 2)

#             if similarity >= similarity_threshold:
#                 results.append({
#                     "text": self.texts[idx],
#                     "start_time": self.meta[idx]["start_time"],
#                     "end_time": self.meta[idx]["end_time"],
#                     "score": float(similarity)
#                 })
#         return results





# in backend/utils/search.py
from huggingface_hub import InferenceClient
import numpy as np
import faiss

# We no longer need to hardcode the URL. The library handles it.
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

class SemanticSearch:
    def __init__(self, api_token: str):
        # Create an official client to communicate with the Hugging Face API
        self.client = InferenceClient(model=MODEL_NAME, token=api_token)
        self.texts = []
        self.meta = []
        self.index = None

    async def _get_embeddings(self, texts: list[str]) -> np.ndarray:
        """Calls the Hugging Face API to get embeddings using the official client."""
        # The client's feature_extraction method handles everything for us!
        embeddings = self.client.feature_extraction(texts)
        # Convert the result to a NumPy array
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

    async def search(self, query: str, top_k=10, similarity_threshold=0.3):
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