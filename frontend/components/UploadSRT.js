import { useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";

export default function UploadSRT({ setIsLoading, setError, setSessionId, setIsFileUploaded, setResults }) {
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
    <div>
      <label htmlFor="file-upload" className="block cursor-pointer">
        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-violet-500 transition-all duration-300 bg-slate-900/50">
          <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-300 mb-2 font-medium">Drop your SRT file here</p>
          <p className="text-sm text-slate-500">or click to browse</p>
        </div>
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".srt"
        onChange={handleUpload}
        className="hidden"
      />
      {message && (
        <div className="mt-4 px-4 py-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
          <p className="text-violet-400 text-sm font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}