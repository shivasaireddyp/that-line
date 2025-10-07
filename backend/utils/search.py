from sentence_transformers import SentenceTransformer
import faiss
class SemanticSearch:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.texts = []
        self.meta = []
        self.embeddings = None
        self.index = None

    def add_texts(self, texts_meta_list):
        self.texts = [x['text'] for x in texts_meta_list]
        self.meta = [{"start_time": x['start_time'], "end_time": x['end_time']} for x in texts_meta_list]
        self.embeddings = self.model.encode(self.texts, convert_to_numpy=True)
        dim = self.embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dim)
        self.index.add(self.embeddings)

    def search(self, query, top_k=5, similarity_threshold=0.6):
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        distances, indices = self.index.search(query_embedding, top_k)
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            cosine_similarity = 1 - (dist**2 / 2)
            if cosine_similarity >= similarity_threshold:
                results.append({
                    "text": self.texts[idx],
                    "start_time": self.meta[idx]["start_time"],
                    "end_time": self.meta[idx]["end_time"],
                    "score": float(cosine_similarity) 
                })
        return results
