'use client';
import { useState } from "react";
import UploadSRT from "../components/UploadSRT";
import SearchBox from "../components/SearchBox";
import ResultsList from "../components/ResultsList";

export default function Home() {
  // State to hold the results from the backend
  const [results, setResults] = useState([]);
  // State for the unique session ID from the backend
  const [sessionId, setSessionId] = useState(null);
  // State to know if a file has been successfully uploaded
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  // Shared loading state for both upload and search
  const [isLoading, setIsLoading] = useState(false);
  // Shared error message state
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center mt-10 px-6">
      <div className="w-full max-w-2xl mx-auto">
        <p className="text-6xl font-bold text-center mb-6 text-gray-800">"That" Line</p>
        <p className=" m-2 text-center">You can find "that" line from "that" movie here.</p>
        <UploadSRT
          setIsLoading={setIsLoading}
          setError={setError}
          setSessionId={setSessionId}
          setIsFileUploaded={setIsFileUploaded}
          setResults={setResults} // Pass setResults to clear old results on new upload
        />
        
        <SearchBox
          sessionId={sessionId}
          setResults={setResults}
          isFileUploaded={isFileUploaded}
          setIsLoading={setIsLoading}
          setError={setError}
        />
        
        {/* Display loading indicator or error message */}
        {isLoading && <p className="text-center text-blue-500 mt-4">Loading...Please wait!</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {/* Only show results container if there are results */}
        {results.length > 0 && <ResultsList results={results} />}
      </div>
    </div>
  );
}