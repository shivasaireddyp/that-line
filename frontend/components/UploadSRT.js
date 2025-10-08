
import axios from "axios";
import { useState } from "react";

export default function UploadSRT({ setIsLoading, setError, setSessionId, setIsFileUploaded, setResults }) {
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset state for new upload
    setIsLoading(true);
    setError("");
    setMessage("");
    setResults([]);
    setIsFileUploaded(false);
    setSessionId(null);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload_srt`, formData);
      setMessage(res.data.message);
      // Set the session ID in the parent component
      setSessionId(res.data.session_id);
      setIsFileUploaded(true);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Upload failed. Please try again later.";
      setError(errorMessage);
      setMessage(""); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
        1. Upload your .SRT file here:
      </label>
      <input 
        id="file-upload"
        type="file" 
        accept=".srt" 
        onChange={handleUpload} 
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {message && <p className="text-green-600 mt-2">{message}</p>}
    </div>
  );
}