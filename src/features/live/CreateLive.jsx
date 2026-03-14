import React, { useState, useEffect } from "react";
import streamService from "../../services/streamService"; 

const CreateLive = ({ streamData, onStreamStarted }) => {
  // Initialize with empty strings to avoid the "Uncontrolled" error
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_live: true, 
  });

  const [gameQuery, setGameQuery] = useState("");
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [gameResults, setGameResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync state when streamData arrives from the parent
  useEffect(() => {
    if (streamData) {
      setFormData({
        title: streamData.title || "",
        description: streamData.description || "",
        is_live: true,
      });
      setGameQuery(streamData.game?.name || "");
      setSelectedGameId(streamData.game?.id || null);
    }
  }, [streamData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGameSearch = async (e) => {
    const query = e.target.value;
    setGameQuery(query);
    setShowDropdown(true);

    if (query.length > 1) {
      try {
        const results = await streamService.searchGames(query);
        setGameResults(results);
      } catch (err) {
        console.error("Search failed", err);
      }
    } else {
      setGameResults([]);
    }
  };

  const selectGame = (game) => {
    setGameQuery(game.name);
    setSelectedGameId(game.id);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGameId) {
      alert("Please select a game from the list.");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        game_id: selectedGameId
      };
      const updatedStream = await streamService.updateStream(payload);
      onStreamStarted(updatedStream);
    } catch (error) {
      console.error("Failed to go live:", error);
      alert("Error starting stream.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 w-full h-full flex flex-col justify-center shadow-[0_0_50px_rgba(168,85,247,0.15)]">
      
      <div className="mb-8 border-b border-gray-700 pb-4">
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <span className="text-purple-500">🎮</span> Setup Stream
        </h2>
        <p className="text-gray-400 mt-2">Fill in the details before you go live.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title */}
        <div>
          <label className="block text-purple-300 mb-2 text-sm font-bold uppercase tracking-wider">Stream Title</label>
          <input
            type="text"
            name="title"
            value={formData.title} // Now guaranteed to be a string
            onChange={handleChange}
            placeholder="Ex: Road to Radiant! 🚀"
            className="w-full bg-black/50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:border-purple-500 outline-none transition-all"
            required
          />
        </div>

        {/* Game Search */}
        <div className="relative">
          <label className="block text-purple-300 mb-2 text-sm font-bold uppercase tracking-wider">Game Category</label>
          <input
            type="text"
            value={gameQuery} // Now guaranteed to be a string
            onChange={handleGameSearch}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search game (e.g. PUBG, Valorant...)"
            className="w-full bg-black/50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:border-purple-500 outline-none transition-all"
            required
          />
          
          {showDropdown && gameResults.length > 0 && (
            <ul className="absolute z-10 w-full bg-gray-900 border border-gray-700 rounded-xl mt-2 max-h-48 overflow-y-auto shadow-xl">
              {gameResults.map((game) => (
                <li 
                  key={game.id}
                  onClick={() => selectGame(game)}
                  className="p-3 hover:bg-purple-600/20 hover:text-purple-300 cursor-pointer text-gray-300 transition-colors border-b border-gray-800 last:border-0"
                >
                  {game.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-purple-300 mb-2 text-sm font-bold uppercase tracking-wider">Description</label>
          <textarea
            name="description"
            value={formData.description} // Now guaranteed to be a string
            onChange={handleChange}
            rows="4"
            className="w-full bg-black/50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:border-purple-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-xl font-black text-xl text-white shadow-2xl transition-all transform ${
            loading
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] hover:shadow-purple-500/50 active:scale-95"
          }`}
        >
          {loading ? "STARTING ENGINE..." : "🚀 GO LIVE NOW"}
        </button>

      </form>
    </div>
  );
};

export default CreateLive;