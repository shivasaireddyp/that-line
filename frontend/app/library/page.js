'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import ResultsList from "../../components/ResultsList";

export default function LibrarySearchPage() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/library/movies`);
        setMovies(res.data.movies);
      } catch (err) {
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
      setError("Please search something.");
      return;
    }

    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      const payload = {
        query: query,
        movie_id: selectedMovie
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/library/search`, payload);
      setResults(res.data.results);
    } catch (err) {
      setError(err.response?.data?.detail || "Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSearchDisabled = isLoading || !query.trim() || !selectedMovie;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            <span className=" bg-clip-text text-black">
              Library Search
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
            Select a movie from your pre-processed library and find any line in seconds.
          </p>
        </div>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="mb-4">
            <label htmlFor="movie-select" className="block text-sm font-medium text-gray-700 mb-2">
              1. Select a Movie:
            </label>
            <select
              id="movie-select"
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Please select from here</option>
              {movies.map(movie => (
                <option key={movie} value={movie}>{movie.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="dialogue-search" className="block text-sm font-medium text-gray-700 mb-2">
              2. Search Something:
            </label>
            <input
              id="dialogue-search"
              type="text"
              placeholder="Type a line you remember..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button type="submit" disabled={isSearchDisabled} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isLoading ? 'Searching...' : 'Search Library'}
          </button>
        </form>

        <div className="max-w-2xl mx-auto mt-6">
          {error && <p className="text-center text-red-500 font-medium">{error}</p>}
          {results.length > 0 && <ResultsList results={results} />}
          {hasSearched && !isLoading && results.length === 0 && (
            <div className="text-center bg-white p-6 rounded-lg border">
              <p className="font-semibold text-gray-700">No Results Found</p>
              <p className="text-gray-500 mt-1">Try a different search term or movie.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}