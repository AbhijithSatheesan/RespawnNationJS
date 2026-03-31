// src/pages/TournamentFormats/BattleRoyaleFormat.jsx
import React, { useState } from 'react';

const BattleRoyaleFormat = ({ tournament }) => {
  const [activeTab, setActiveTab] = useState('LEADERBOARD');

  // Safely default to empty arrays (We will update Django to send these soon)
  const brLeaderboard = tournament.br_leaderboard || []; 
  const brLobbies = tournament.br_lobbies || [];

  return (
    <div>
      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button onClick={() => setActiveTab('LEADERBOARD')} className={`px-6 py-3 font-black uppercase tracking-widest text-xs border transition-colors ${activeTab === 'LEADERBOARD' ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]' : 'bg-[#0a0a0c] border-gray-800 text-gray-400 hover:border-gray-600'}`}>
          Overall Leaderboard
        </button>
        <button onClick={() => setActiveTab('LOBBIES')} className={`px-6 py-3 font-black uppercase tracking-widest text-xs border transition-colors ${activeTab === 'LOBBIES' ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]' : 'bg-[#0a0a0c] border-gray-800 text-gray-400 hover:border-gray-600'}`}>
          Lobby Details
        </button>
      </div>

      {/* TAB 1: OVERALL LEADERBOARD */}
      {activeTab === 'LEADERBOARD' && (
        <div className="max-w-4xl mx-auto bg-[#0a0a0c] border border-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="bg-[#050505] px-4 py-3 border-b border-gray-800 font-black text-cyan-400 uppercase tracking-widest text-sm">
            Top Fraggers & Survivors
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#08080a] text-gray-500 uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-center w-16">Rank</th>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3 text-center">Total Kills</th>
                  <th className="px-4 py-3 text-center text-cyan-500 font-black">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {brLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500 font-bold uppercase tracking-widest">No stats recorded yet.</td>
                  </tr>
                ) : (
                  brLeaderboard.map((player, index) => (
                    <tr key={index} className="hover:bg-gray-900/50 transition-colors">
                      <td className="px-4 py-4 text-center font-black text-gray-400">#{index + 1}</td>
                      <td className="px-4 py-4 font-bold text-white">{player.username}</td>
                      <td className="px-4 py-4 text-center text-red-500/80">{player.total_kills}</td>
                      <td className="px-4 py-4 text-center font-black text-cyan-400 text-sm">{player.total_points}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LOBBIES / MATCHES */}
      {activeTab === 'LOBBIES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {brLobbies.length === 0 ? (
             <div className="col-span-full py-12 text-center border border-dashed border-gray-800 rounded-lg">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No lobbies generated yet.</p>
             </div>
          ) : (
            brLobbies.map((lobby, index) => (
              <div key={index} className="bg-[#0a0a0c] border border-gray-800 rounded-lg p-5 flex items-center justify-between shadow-lg hover:border-cyan-900/50 transition-colors">
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Match #{lobby.match_number}</div>
                  <div className="text-white font-black text-lg">Drop in Progress</div>
                </div>
                <div>
                  {lobby.is_completed ? (
                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Completed</span>
                  ) : (
                    <span className="bg-red-900/30 text-red-500 border border-red-800/50 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest animate-pulse">Live</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default BattleRoyaleFormat;