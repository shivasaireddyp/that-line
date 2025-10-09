'use client';
import UploadSRT from "../components/UploadSRT";
import SearchBox from "../components/SearchBox";
import ResultsList from "../components/ResultsList";
import { useState } from "react";
import { Search, Upload, Film, Sparkles } from "lucide-react";
import Link from 'next/link';

export default function Home() {
  const [results, setResults] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Space Grotesk', sans-serif;
        }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="relative container mx-auto px-4 py-8 md:py-16 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          <div className="lg:sticky lg:top-8 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-400">Semantic Powered Search</span>
              </div>
                
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white">
                <span className="text-violet-500">That</span> Line.
              </h1>

              
              <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-xl">
                Ever remember a line from a movie but can't place it? 
                <span className="text-violet-400 font-semibold"> Stop searching.</span>
              </p>
              
              <div className="space-y-3 text-slate-400">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                  </div>
                  <p className="text-lg">Upload any subtitle file (.srt)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                  </div>
                  <p className="text-lg">Search using natural language</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                  </div>
                  <p className="text-lg">Find exact dialogue & timestamps instantly</p>
                </div>
              </div>
            </div>


            <div className="pt-4">
              <h2 className="text-3xl font-bold text-white mb-2 px-2">The <span className="text-violet-500">Library.</span></h2>
              <p className="text-xl text-slate-400 mb-4 px-2 md:text-1xl text-slate-400 max-w-xl">
                No .srt file? No problem. Search our collection instantly.
              </p>
              <Link 
                href="/library" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-all duration-300 font-semibold text-lg shadow-lg shadow-violet-900/50 hover:shadow-violet-900/70 hover:scale-105 transform"
              >
                <Film className="w-5 h-5" />
                Search The Library 
              </Link>
            </div>

          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-slate-800 shadow-2xl">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Get started <span className="text-violet-500">here</span> :)</h2>
                <p className="text-slate-400">Upload your subtitle file and start searching</p>
              </div>
              
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

              {/* Status messages */}
              <div className="mt-6">
                {isLoading && (
                  <div className="flex items-center gap-3 text-violet-400 bg-violet-500/10 px-4 py-3 rounded-lg border border-violet-500/20">
                    <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium">Processing your request...</p>
                  </div>
                )}
                {error && (
                  <div className="text-red-400 bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/20">
                    <p className="font-medium">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Search Results</h2>
                  <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium">
                    {results.length} {results.length === 1 ? 'match' : 'matches'}
                  </span>
                </div>
                <ResultsList results={results} />
              </div>
            )}


          </div>
        </div>

      </main>
    </div>
  );
}