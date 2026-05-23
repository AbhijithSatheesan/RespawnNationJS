import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { SEARCH_GAMES } from '../../services/apiRoutes';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // --- 1. DEBOUNCED SEARCH LOGIC ---
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await api.get(SEARCH_GAMES, { params: { q: query } });
        setResults(response.data);
        setIsOpen(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // --- 2. CLICK OUTSIDE TO CLOSE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 3. HANDLE SELECTION ---
  const handleSelectGame = (gameId) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/game/${gameId}`); 
  };

  return (
    <div className="relative w-full max-w-sm" ref={searchRef}>
      
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          placeholder="Search games..."
          className="w-full px-4 py-2 pl-10 bg-[#0b0f19] border border-gray-700 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* The Dropdown Menu (Text Only) */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-[#151a28] border border-gray-800 rounded-lg shadow-2xl overflow-hidden z-50">
          {results.length > 0 ? (
            <ul>
              {results.map((game) => (
                <li 
                  key={game.id}
                  onClick={() => handleSelectGame(game.id)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#1e2538] cursor-pointer transition-colors border-b border-gray-800/50 last:border-0"
                >
                  <span className="text-white text-sm font-bold truncate pr-4">{game.name}</span>
                  
                  {game.rating ? (
                    <span className="text-cyan-400 text-xs font-medium tracking-wide whitespace-nowrap">★ {game.rating}</span>
                  ) : (
                    <span className="text-gray-500 text-xs font-medium tracking-wide whitespace-nowrap">-</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-4 text-center text-sm text-gray-500">
              No games found for "{query}"
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default SearchBar;