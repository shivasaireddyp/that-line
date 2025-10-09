import { useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";

export default function SearchBox({ sessionId, setResults, isFileUploaded, setIsLoading, setError }) {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault(); 
    
    if (!query || !isFileUploaded) return;

    setIsLoading(true);
    setError("");
    setResults([]);

    try {
      const payload = {
        query: query,
        session_id: sessionId
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/search`, payload);
      setResults(res.data.results);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Search failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative mt-6">
      <input
        type="text"
        placeholder={isFileUploaded ? "Search for a line... (e.g., 'I'll be back')" : "Upload a file to start searching..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={!isFileUploaded}
        className="w-full px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button 
        type="submit"
        disabled={!isFileUploaded || !query.trim()}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-violet-600 rounded-lg hover:bg-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Search className="w-5 h-5 text-white" />
      </button>
    </form>
  );
}