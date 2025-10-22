// 'use client';
// import { useState, useEffect } from "react";
// import axios from "axios";
// import ResultsList from "../../components/ResultsList";
// import { Search, Sparkles } from "lucide-react";

// export default function LibrarySearchPage() {
//   const [movies, setMovies] = useState([]);
//   const [selectedMovie, setSelectedMovie] = useState('');
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [hasSearched, setHasSearched] = useState(false);

//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/library/movies`);
//         setMovies(res.data.movies);
//       } catch (err) {
//         setError("Could not fetch movie list from the server.");
//       }
//     };
//     fetchMovies();
//   }, []);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setHasSearched(true);
    
//     if (!selectedMovie) {
//       setError("Please select a movie from the list.");
//       return;
//     }
//     if (!query.trim()) {
//       setError("Please enter a search term.");
//       return;
//     }

//     setIsLoading(true);
//     setError('');
//     setResults([]);

//     try {
//       const payload = {
//         query: query,
//         movie_id: selectedMovie
//       };
//       const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/library/search`, payload);
//       setResults(res.data.results);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Search failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isSearchDisabled = isLoading || !query.trim() || !selectedMovie;

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
//         body {
//           font-family: 'Space Grotesk', sans-serif;
//         }
//       `}</style>
      
//       <main className="container mx-auto px-4 py-8 md:py-16 lg:px-8">
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
//             <Sparkles className="w-4 h-4 text-violet-400" />
//             <span className="text-sm font-medium text-violet-400">Movie Library</span>
//           </div>
//           <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
//             Search The <span className="text-violet-500">Library.</span>
//           </h1>
//           <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
//             No `.srt` file? No problem. Select a movie from our collection and find any line in seconds.
//           </p>
//         </div>
        
//         {/* Main interactive card */}
//         <div className="max-w-2xl mx-auto bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl">
//           <form onSubmit={handleSearch} className="space-y-6">
//             <div>
//               <label htmlFor="movie-select" className="block text-sm font-medium text-slate-300 mb-2">
//                 1. Select a Movie
//               </label>
//               <select
//                 id="movie-select"
//                 value={selectedMovie}
//                 onChange={(e) => setSelectedMovie(e.target.value)}
//                 className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
//               >
//                 <option value="" disabled>-- Select a Movie --</option>
//                 {movies.map(movie => (
//                   <option key={movie} value={movie}>{movie.replace(/_/g, ' ')}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <p>Cant find your movie here? <span><a className="text-violet-400" href="https://subtitlecat.com/" target="_blank">get the .srt file here!</a> </span> </p>
//             </div>
            
//             <div>
//               <label htmlFor="dialogue-search" className="block text-sm font-medium text-slate-300 mb-2">
//                 2. Search for Dialogue
//               </label>
//               <input
//                 id="dialogue-search"
//                 type="text"
//                 placeholder="Type a line you remember..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
//               />
//             </div>
//             <button 
//               type="submit" 
//               disabled={isSearchDisabled} 
//               className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-all duration-300 font-semibold text-lg shadow-lg shadow-violet-900/50 hover:shadow-violet-900/70 hover:scale-105 transform disabled:bg-slate-700 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
//             >
//               <Search className="w-5 h-5" />
//               {isLoading ? 'Searching...' : 'Search Library'}
//             </button>
//           </form>

//           {/* Status and Results Area */}
//           <div className="mt-8">
//             {isLoading && (
//               <div className="flex items-center justify-center gap-3 text-violet-400 bg-violet-500/10 px-4 py-3 rounded-lg border border-violet-500/20">
//                 <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
//                 <p className="font-medium">Searching our library...</p>
//               </div>
//             )}
//             {error && (
//               <div className="text-red-400 bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/20">
//                 <p className="font-medium">{error}</p>
//               </div>
//             )}
//             {hasSearched && !isLoading && results.length === 0 && (
//               <div className="text-center text-slate-400 bg-slate-800/30 px-4 py-6 rounded-lg border border-slate-800">
//                 <p className="font-medium">No Results Found</p>
//                 <p className="text-sm text-slate-500 mt-1">Try a different search term or movie.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {results.length > 0 && !isLoading && (
//           <div className="max-w-2xl mx-auto mt-8 bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl">
//             <div className="mb-6 flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-white">Search Results</h2>
//               <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium">
//                 {results.length} {results.length === 1 ? 'match' : 'matches'}
//               </span>
//             </div>
//             <ResultsList results={results} />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }







'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import ResultsList from "../../components/ResultsList";
import { Search, Sparkles } from "lucide-react";

export default function LibrarySearchPage() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Searchable dropdown state
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/library/movies`);
        // Expecting res.data.movies to be an array of strings (movie ids/names)
        setMovies(res.data.movies || []);
      } catch (err) {
        console.error(err);
        setError("Could not fetch movie list from the server.");
      }
    };
    fetchMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);

    if (!selectedMovie) {
      setError("Please select a movie from the list.");
      return;
    }
    if (!query.trim()) {
      setError("Please enter a search term.");
      return;
    }

    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      const payload = { query, movie_id: selectedMovie };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/library/search`, payload);
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSearchDisabled = isLoading || !query.trim() || !selectedMovie;

  const normalizedSearch = (txt = '') => txt.toString().toLowerCase();
  const filteredMovies = movies.filter(movie =>
    normalizedSearch(movie).includes(normalizedSearch(searchTerm))
  );

  // helper to display movie label (replace underscores)
  const movieLabel = (movie) => (movie ? movie.replace(/_/g, ' ') : '');

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Space Grotesk', sans-serif;
        }
      `}</style>

      <main className="container mx-auto px-4 py-8 md:py-16 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-400">Movie Library</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Search The <span className="text-violet-500">Library.</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
            No `.srt` file? No problem. Select a movie from our collection and find any line in seconds.
          </p>
        </div>

        {/* Main interactive card */}
        <div className="max-w-2xl mx-auto bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleSearch} className="space-y-6">

            {/* Searchable Dropdown */}
            <div className="relative">
              <label htmlFor="movie-search" className="block text-sm font-medium text-slate-300 mb-2">
                1. Select a Movie
              </label>

              <input
                id="movie-search"
                type="text"
                placeholder={movieLabel(selectedMovie) || "Search or select a movie..."}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowOptions(true);
                }}
                onFocus={() => setShowOptions(true)}
                // use timeout to allow onMouseDown on option to register before blur hides it
                onBlur={() => setTimeout(() => setShowOptions(false), 150)}
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                autoComplete="off"
              />

              {showOptions && (
                <ul className="absolute z-50 w-full max-h-56 overflow-y-auto bg-slate-800 border border-slate-700 rounded-lg mt-1 shadow-xl">
                  {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                      <li
                        key={movie}
                        onMouseDown={() => {
                          // onMouseDown to avoid blur race
                          setSelectedMovie(movie);
                          // set input to movie label so user sees selection; if they clear, it stays empty
                          setSearchTerm(movieLabel(movie));
                          setShowOptions(false);
                        }}
                        className={`p-3 cursor-pointer hover:bg-violet-600 hover:text-white ${
                          selectedMovie === movie ? "bg-violet-700 text-white" : "text-slate-200"
                        }`}
                      >
                        {movieLabel(movie)}
                      </li>
                    ))
                  ) : (
                    <li className="p-3 text-slate-400">No movies found</li>
                  )}
                </ul>
              )}
            </div>

            <div>
              <p>
                Can’t find your movie here?{" "}
                <a
                  className="text-violet-400"
                  href="https://subtitlecat.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  get the .srt file here!
                </a>
              </p>
            </div>

            <div>
              <label htmlFor="dialogue-search" className="block text-sm font-medium text-slate-300 mb-2">
                2. Search for Dialogue
              </label>
              <input
                id="dialogue-search"
                type="text"
                placeholder="Type a line you remember..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSearchDisabled}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-all duration-300 font-semibold text-lg shadow-lg shadow-violet-900/50 hover:shadow-violet-900/70 hover:scale-105 transform disabled:bg-slate-700 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5" />
              {isLoading ? 'Searching...' : 'Search Library'}
            </button>
          </form>

          {/* Status and Results Area */}
          <div className="mt-8">
            {isLoading && (
              <div className="flex items-center justify-center gap-3 text-violet-400 bg-violet-500/10 px-4 py-3 rounded-lg border border-violet-500/20">
                <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-medium">Searching our library...</p>
              </div>
            )}
            {error && (
              <div className="text-red-400 bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/20">
                <p className="font-medium">{error}</p>
              </div>
            )}
            {hasSearched && !isLoading && results.length === 0 && (
              <div className="text-center text-slate-400 bg-slate-800/30 px-4 py-6 rounded-lg border border-slate-800">
                <p className="font-medium">No Results Found</p>
                <p className="text-sm text-slate-500 mt-1">Try a different search term or movie.</p>
              </div>
            )}
          </div>
        </div>

        {results.length > 0 && !isLoading && (
          <div className="max-w-2xl mx-auto mt-8 bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Search Results</h2>
              <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium">
                {results.length} {results.length === 1 ? 'match' : 'matches'}
              </span>
            </div>
            <ResultsList results={results} />
          </div>
        )}
      </main>
    </div>
  );
}
