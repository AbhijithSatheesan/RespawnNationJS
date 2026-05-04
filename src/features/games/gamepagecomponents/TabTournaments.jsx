import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

import TournamentCard from '../../tournaments/components/TournamentCard'; 
import { GAME_TOURNAMENTS } from '../../../services/apiRoutes';

const TabTournaments = ({ gameId }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await api.get(GAME_TOURNAMENTS(gameId));
        setTournaments(response.data);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [gameId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="bg-[#0a0a0c] border border-gray-800 rounded-lg p-12 text-center animate-fadeIn">
        <p className="text-gray-500 font-bold uppercase tracking-widest">
          No active tournaments for this game right now.
        </p>
      </div>
    );
  }

  return (
    // Changed to a single column flexbox so the wide cards fit perfectly
    <div className="flex flex-col gap-8 animate-fadeIn">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
};

export default TabTournaments;