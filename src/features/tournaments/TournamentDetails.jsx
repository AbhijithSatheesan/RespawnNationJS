// src/pages/TournamentDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { TOURNAMENT_DETAILS } from '../../services/apiRoutes';

import WorldCupFormat from './components/WorldCupFormat';
import BattleRoyaleFormat from './components/BattleRoyaleFormat';
// Import the modal! (Adjust the path to wherever you saved it)
import JoinTournamentModal from './components/JoinTournamentModal';

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // NEW: State for the Razorpay Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // NEW: Handle successful payment from the details page
  const handlePaymentSuccess = () => {
    setIsModalOpen(false);
    window.location.reload(); // Refresh to update the slots and show "Joined ✓"
  };

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
      
      {/* GLOBAL HEADER */}
      <div className="mb-8 border-b border-gray-800 pb-8 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
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

        {/* NEW: THE JOIN BUTTON */}
        {tournament.status === 'REGISTRATION' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={tournament.is_registered}
            className={`w-full md:w-auto px-8 py-4 font-black uppercase tracking-widest text-sm rounded transition-all shadow-lg ${
              tournament.is_registered 
                ? 'bg-gray-800 text-green-500 border border-green-500/30 cursor-not-allowed shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]'
            }`}
          >
            {tournament.is_registered ? 'Joined ✓' : 'Join Tournament (₹500)'}
          </button>
        )}
      </div>

      {/* DYNAMIC FORMAT ROUTER */}
      {tournament.engine_code === 'world_cup' && <WorldCupFormat tournament={tournament} />}
      {tournament.engine_code === 'battle_royale' && <BattleRoyaleFormat tournament={tournament} />}
      
      {/* Fallback */}
      {tournament.engine_code !== 'world_cup' && tournament.engine_code !== 'battle_royale' && (
        <div className="py-12 text-center border border-dashed border-gray-800 rounded-lg max-w-4xl mx-auto">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Standings layout pending for {tournament.engine_code}</p>
        </div>
      )}

      {/* NEW: RENDER THE MODAL */}
      {isModalOpen && (
        <JoinTournamentModal 
          tournamentId={tournament.id}
          tournamentTitle={tournament.title}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
};

export default TournamentDetails;