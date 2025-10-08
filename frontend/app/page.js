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
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 md:py-12">
        
        {/* === Hero Section === */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            <span className=" ">That Line</span> <image src="./favicon.ico" alt="Logo" className="inline w-12 h-12 md:w-16 md:h-16" />
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
            Ever remember a line from a movie but can't place it? Stop searching. Simply upload a subtitle file and search naturally — find the exact dialogue and timestamp in seconds.
          </p>
        </div>

        {/* === Main Application Section === */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <UploadSRT
            setIsLoading={setIsLoading}
            setError={setError}
            setSessionId={setSessionId}
            setIsFileUploaded={setIsFileUploaded}
            setResults={setResults}
          />
          <SearchBox
            sessionId={sessionId}
            setResults={setResults}
            isFileUploaded={isFileUploaded}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        </div>
        
        {/* === Results / Status Display Section === */}
        <div className="max-w-2xl mx-auto mt-6">
          {isLoading && <p className="text-center text-blue-500">Uploading and Searching...</p>}
          {error && <p className="text-center text-red-500 font-medium">{error}</p>}
          {results.length > 0 && <ResultsList results={results} />}
        </div>
        
        {/* === How It Works Section === */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
          <p className="mt-2 text-gray-500">Simple steps to find any line.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-4xl mb-3">📄</div>
              <h3 className="text-lg font-semibold">1. Upload File</h3>
              <p className="text-gray-500 mt-1">Select any standard `.srt` subtitle file from your computer.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold">2. Search Dialogue</h3>
              <p className="text-gray-500 mt-1">Type a word, phrase, or even just the gist of the line you remember.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-lg font-semibold">3. Get Instant Results</h3>
              <p className="text-gray-500 mt-1">Model finds the most relevant lines with their timestamps instantly.</p>
            </div>
          </div>
        </div>

        {/* === Who It's For Section === */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Who Can Benefit</h2>
          <ul className="mt-8 space-y-4 text-left">
            <li className="flex items-start bg-white p-4 rounded-lg border">
              <span className="text-2xl mr-4">🎬</span>
              <div>
                <h4 className="font-semibold">Video Editors & Content Creators</h4>
                <p className="text-gray-500">Quickly locate specific clips for your edits, reaction videos, or compilations.</p>
              </div>
            </li>
            <li className="flex items-start bg-white p-4 rounded-lg border">
              <span className="text-2xl mr-4">🍿</span>
              <div>
                <h4 className="font-semibold">Movie Buffs & Fans</h4>
                <p className="text-gray-500">Settle debates with friends, find trivia, or create the perfect movie-themed meme.</p>
              </div>
            </li>
            <li className="flex items-start bg-white p-4 rounded-lg border">
              <span className="text-2xl mr-4">✍️</span>
              <div>
                <h4 className="font-semibold">Writers & Researchers</h4>
                <p className="text-gray-500">Analyze dialogue, study character arcs, or find quotes for your articles.</p>
              </div>
            </li>
          </ul>
        </div>
      </main>

      {/* === Footer === */}
      <footer className="py-6 border-t bg-white">
        <p className="text-sm text-gray-500">shivasaireddyp</p>
      </footer>
    </div>
  );
}