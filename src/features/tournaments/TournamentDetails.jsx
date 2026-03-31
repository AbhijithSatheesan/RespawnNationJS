// src/pages/TournamentDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { TOURNAMENT_DETAILS } from '../../services/apiRoutes';


import WorldCupFormat from './components/WorldCupFormat';
import BattleRoyaleFormat from './components/BattleRoyaleFormat';



const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(TOURNAMENT_DETAILS(id));
        setTournament(response.data);
      } catch (error) {
        console.error("Error fetching tournament details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
      </div>
    );
  }

  if (!tournament) return <div className="text-white text-center mt-20">Tournament not found.</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono pt-24 px-4 sm:px-8 lg:px-16 pb-20">
      
      {/* GLOBAL HEADER (Same for all formats) */}
      <div className="mb-8 border-b border-gray-800 pb-8 relative">
        <button onClick={() => navigate(-1)} className="text-cyan-500 hover:text-cyan-400 mb-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          ← Back to Dashboard
        </button>
        <span className="bg-cyan-900/30 text-cyan-400 px-3 py-1 border border-cyan-800/50 text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-md">
          {tournament.game_name}
        </span>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">
          {tournament.title}
        </h1>
      </div>

      {/* DYNAMIC FORMAT ROUTER */}
      {tournament.engine_code === 'world_cup' && <WorldCupFormat tournament={tournament} />}
      {tournament.engine_code === 'battle_royale' && <BattleRoyaleFormat tournament={tournament} />}
      
      {/* Fallback if no specific engine is set yet */}
      {tournament.engine_code !== 'world_cup' && tournament.engine_code !== 'battle_royale' && (
        <div className="py-12 text-center border border-dashed border-gray-800 rounded-lg max-w-4xl mx-auto">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Standings layout pending for {tournament.engine_code}</p>
        </div>
      )}

    </div>
  );
};

export default TournamentDetails;