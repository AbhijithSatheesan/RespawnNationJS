import React, { useState, useEffect } from "react";
import streamService from "../../services/streamService"; 

const CreateLive = ({ streamData, onSubmitForm }) => {
  // 1. Core Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stream_type: "CLOUDFLARE", // Default to native
    external_url: "",          
    is_live: true, 
  });

  // 2. Game Search State
  const [gameQuery, setGameQuery] = useState("");
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [gameResults, setGameResults] = useState([]);
  const [showGameDropdown, setShowGameDropdown] = useState(false);
  
  // 3. Tournament Search State
  const [tournamentQuery, setTournamentQuery] = useState("");
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [tournamentResults, setTournamentResults] = useState([]);
  const [showTournamentDropdown, setShowTournamentDropdown] = useState(false);

  const [loading, setLoading] = useState(false);

  // Sync state when streamData arrives (for editing an existing channel)
  useEffect(() => {
    if (streamData) {
      setFormData({
        title: streamData.title || "",
        description: streamData.description || "",
        stream_type: streamData.stream_type || "CLOUDFLARE",
        external_url: streamData.external_url || "",
        is_live: true,
      });
      
      setGameQuery(streamData.game?.name || "");
      setSelectedGameId(streamData.game?.id || null);
      
      setTournamentQuery(streamData.active_tournament?.title || "");
      setSelectedTournamentId(streamData.active_tournament?.id || null);
    }
  }, [streamData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- GAME SEARCH LOGIC ---
  const handleGameSearch = async (e) => {
    const query = e.target.value;
    setGameQuery(query);
    setShowGameDropdown(true);

    if (query.length > 1) {
      try {
        const results = await streamService.searchGames(query);
        setGameResults(results);
      } catch (err) {
        console.error("Game search failed", err);
      }
    } else {
      setGameResults([]);
    }
  };

  const selectGame = (game) => {
    setGameQuery(game.name);
    setSelectedGameId(game.id);
    setShowGameDropdown(false);
  };

  // --- TOURNAMENT SEARCH LOGIC ---
  const handleTournamentSearch = async (e) => {
    const query = e.target.value;
    setTournamentQuery(query);
    setShowTournamentDropdown(true);

    if (query.length > 1) {
      try {
        // Make sure you have searchTournaments in your streamService!
        const results = await streamService.searchTournaments(query);
        setTournamentResults(results);
      } catch (err) {
        console.error("Tournament search failed", err);
      }
    } else {
      setTournamentResults([]);
    }
  };

  const selectTournament = (tournament) => {
    setTournamentQuery(tournament.title);
    setSelectedTournamentId(tournament.id);
    setShowTournamentDropdown(false);
  };

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check for external platforms
    if (formData.stream_type !== 'CLOUDFLARE' && !formData.external_url) {
      alert("Please provide your YouTube or Twitch URL.");
      return;
    }

    setLoading(true);
    
    // Build the final payload
    const payload = {
      ...formData,
      game_id: selectedGameId,
      active_tournament_id: selectedTournamentId 
    };
    
    // Send it UP to the parent component (GoLive.jsx)
    await onSubmitForm(payload);
    
    setLoading(false);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 w-full flex flex-col justify-center shadow-[0_0_50px_rgba(168,85,247,0.15)]">
      
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <span className="text-purple-500">🎮</span> Setup Stream
        </h2>
        <p className="text-gray-400 mt-2">Configure your broadcast settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative">
        
        {/* Stream Type / Platform Selector */}
        <div>
           <label className="block text-purple-300 mb-2 text-sm font-bold uppercase tracking-wider">Broadcast Platform</label>
           <div className="grid grid-cols-3 gap-4">
            {['CLOUDFLARE', 'YOUTUBE', 'TWITCH'].map((type) => (
                <div 
                key={type}
                onClick={() => setFormData({...formData, stream_type: type})}
                className={`p-3 text-center rounded-xl cursor-pointer font-bold text-xs uppercase tracking-widest border transition-all ${
                    formData.stream_type === type 
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400' 
                    : 'bg-black/50 border-gray-700 text-gray-500 hover:border-gray-500'
                }`}
                >
                {type === 'CLOUDFLARE' ? 'Native RTMP' : type}
                </div>
            ))}
           </div>
        </div>

        {/* Conditional External URL Input */}
        {formData.stream_type !== 'CLOUDFLARE' && (
          <div className="animate-fadeIn">
            <label className="block text-purple-300 mb-2 text-sm font-bold uppercase tracking-wider">
              {formData.stream_type} URL
            </label>
            <input
              type="url"
              name="external_url"
              value={formData.external_url}
              onChange={handleChange}
              placeholder={`Paste your ${formData.stream_type} link here...`}
              className="w-full bg-black/50 border border-purple-500/50 rounded-xl p-4 text-white focus:border-purple-400 outline-none transition-all"
              required
            />
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-purple-300 mb-2 text-sm font-bold uppercase tracking-wider">Stream Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
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
            value={gameQuery}
            onChange={handleGameSearch}
            onFocus={() => setShowGameDropdown(true)}
            placeholder="Search game..."
            className="w-full bg-black/50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:border-purple-500 outline-none transition-all"
          />
          {showGameDropdown && gameResults.length > 0 && (
            <ul className="absolute z-20 w-full bg-gray-900 border border-gray-700 rounded-xl mt-2 max-h-48 overflow-y-auto shadow-2xl">
              {gameResults.map((game) => (
                <li 
                  key={game.id}
                  onClick={() => selectGame(game)}
                  className="p-3 hover:bg-purple-600/20 hover:text-purple-300 cursor-pointer text-gray-300 border-b border-gray-800 last:border-0"
                >
                  {game.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tournament Search (Optional) */}
        <div className="relative">
          <label className="block text-purple-300 mb-2 text-sm font-bold uppercase tracking-wider">Link Tournament (Optional)</label>
          <input
            type="text"
            value={tournamentQuery}
            onChange={handleTournamentSearch}
            onFocus={() => setShowTournamentDropdown(true)}
            placeholder="Search active tournaments..."
            className="w-full bg-black/50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:border-purple-500 outline-none transition-all"
          />
          {showTournamentDropdown && tournamentResults.length > 0 && (
            <ul className="absolute z-10 w-full bg-gray-900 border border-gray-700 rounded-xl mt-2 max-h-48 overflow-y-auto shadow-2xl">
              {tournamentResults.map((tourney) => (
                <li 
                  key={tourney.id}
                  onClick={() => selectTournament(tourney)}
                  className="p-3 hover:bg-purple-600/20 hover:text-purple-300 cursor-pointer text-gray-300 border-b border-gray-800 last:border-0"
                >
                  {tourney.title}
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
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full bg-black/50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:border-purple-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-xl font-black text-xl text-white shadow-2xl transition-all transform mt-4 ${
            loading 
              ? "bg-gray-700 cursor-not-allowed" 
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          }`}
        >
          {loading ? "STARTING ENGINE..." : "🚀 GO LIVE NOW"}
        </button>

      </form>
    </div>
  );
};

export default CreateLive;