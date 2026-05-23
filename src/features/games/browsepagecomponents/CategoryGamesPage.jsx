import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { GET_CATEGORY_GAMES } from '../../../services/apiRoutes';
import GameCard from './GameCard'; 

const CategoryGamesPage = () => {
  // Grab the categoryName from the URL
  const { categoryName } = useParams();
  const navigate = useNavigate();
  
  const [displayTitle, setDisplayTitle] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryGames = async () => {
      try {
        setLoading(true);
        const response = await api.get(GET_CATEGORY_GAMES(categoryName));
        setDisplayTitle(response.data.category_name);
        setGames(response.data.games);
      } catch (err) {
        console.error("Error fetching category games:", err);
        setError("Could not load games for this category.");
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchCategoryGames();
    }
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex justify-center items-center">
        <div className="text-cyan-500 font-bold tracking-widest uppercase animate-pulse">
          Loading Database...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col justify-center items-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button onClick={() => navigate(-1)} className="text-cyan-400 hover:text-white font-bold tracking-widest uppercase">
          &lt; Return to Base
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] pt-24 px-4 md:px-12 pb-12">
      
      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-800 pb-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4 transition-colors flex items-center"
          >
            <span className="mr-2">&lt;</span> Back
          </button>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider drop-shadow-lg">
            {displayTitle} <span className="text-cyan-500">Games</span>
          </h1>
        </div>
        <div className="text-gray-500 font-medium text-sm mt-4 md:mt-0 uppercase tracking-widest">
          Showing {games.length} titles
        </div>
      </div>

      {/* Grid Layout for Games */}
      {games.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 font-bold uppercase tracking-widest">
          No games found in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {games.map((game) => (
            <div key={game.id} className="w-full flex justify-center">
              <GameCard
                id={game.id}
                cover={game.cover}
                name={game.name}
                rating={game.rating}
                isLarge={true} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryGamesPage;