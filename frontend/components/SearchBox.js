import { useState } from "react";
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
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <p className="block text-sm font-medium text-gray-700 mb-2">
        2. Search for a line
      </p>
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder={isFileUploaded ? "Type a line you remember..." : "Waiting for SRT file upload."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={!isFileUploaded}
          className="border p-2 rounded-l-md w-full focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button 
          type="submit" 
          disabled={!isFileUploaded}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          Search
        </button>
      </form>
    </div>
  );
}