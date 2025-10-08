'use client';
import { useState } from "react";
import UploadSRT from "../components/UploadSRT";
import SearchBox from "../components/SearchBox";
import ResultsList from "../components/ResultsList";

export default function Home() {
  const [results, setResults] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
          setResults={setResults}
        />
        {isLoading && <p className="text-center text-blue-500 mt-4">Uploading your file...Please wait!</p>}
        
        <SearchBox
          sessionId={sessionId}
          setResults={setResults}
          isFileUploaded={isFileUploaded}
          setIsLoading={setIsLoading}
          setError={setError}
        />
        
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {results.length > 0 && <ResultsList results={results} />}
      </div>
    </div>
  );
}