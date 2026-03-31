// src/pages/TournamentFormats/WorldCupFormat.jsx
import React, { useState } from 'react';

const WorldCupFormat = ({ tournament }) => {
  const [activeTab, setActiveTab] = useState('STANDINGS');

  const standings = tournament.standings || [];
  const matches = tournament.matches || [];

  const groupedStandings = standings.reduce((acc, standing) => {
    if (!acc[standing.group_name]) acc[standing.group_name] = [];
    acc[standing.group_name].push(standing);
    return acc;
  }, {});

  const groupMatches = matches.filter(m => m.stage === 'GROUP');
  const knockoutMatches = matches.filter(m => m.stage === 'KNOCKOUT');

  const standardRoundOrder = ['Round of 16', 'Quarter-Final', 'Semi-Final', 'Final'];
  const groupedKnockouts = {};
  
  knockoutMatches.forEach(m => {
    if (!groupedKnockouts[m.round_name]) groupedKnockouts[m.round_name] = [];
    groupedKnockouts[m.round_name].push(m);
  });

  const activeRounds = standardRoundOrder.filter(round => groupedKnockouts[round] && groupedKnockouts[round].length > 0);

  // =========================================================================
  // NEW: Grab the Champion if the Final is completed
  // =========================================================================
  const finalMatch = groupedKnockouts['Final']?.[0];
  const tournamentChampion = finalMatch?.is_completed ? finalMatch.winner_name : null;

  return (
    <div>
      {/* FILTER / TABS NAVIGATION */}
      <div className="flex flex-wrap border-b border-gray-800 mb-8">
        {[
          { id: 'STANDINGS', label: 'Group Standings' },
          { id: 'MATCHES', label: 'Group Matches' },
          { id: 'BRACKET', label: 'Knockout Bracket' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-bold uppercase tracking-wider text-xs transition-all duration-300 relative ${
              activeTab === tab.id 
                ? 'text-cyan-400 bg-cyan-900/10' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_12px_rgba(8,145,178,1)]"></span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: GROUP STANDINGS */}
      {activeTab === 'STANDINGS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
          {Object.keys(groupedStandings).length === 0 ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-lg bg-[#0a0a0c]/50">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No groups generated yet.</p>
             </div>
          ) : (
            Object.entries(groupedStandings).map(([groupName, players]) => {
              const sortedPlayers = [...players].sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points; 
                const gdA = a.goals_scored - a.goals_conceded;
                const gdB = b.goals_scored - b.goals_conceded;
                if (gdB !== gdA) return gdB - gdA; 
                return b.goals_scored - a.goals_scored; 
              });

              return (
                <div key={groupName} className="bg-[#0a0a0c] border border-gray-800 rounded-lg overflow-hidden shadow-xl">
                  <div className="bg-[#050505] px-4 py-3 border-b border-gray-800 font-black text-cyan-400 uppercase tracking-widest text-sm flex items-center justify-between">
                    {groupName}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#08080a] text-gray-500 uppercase tracking-wider border-b border-gray-800">
                        <tr>
                          <th className="px-4 py-3">Player</th>
                          <th className="px-4 py-3 text-center">MP</th>
                          <th className="px-4 py-3 text-center">GF</th>
                          <th className="px-4 py-3 text-center">GA</th>
                          <th className="px-4 py-3 text-center">GD</th>
                          <th className="px-4 py-3 text-center text-cyan-500 font-black">PTS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/50">
                        {sortedPlayers.map((p, index) => {
                          const gd = p.goals_scored - p.goals_conceded;
                          const gdColor = gd > 0 ? 'text-green-400' : gd < 0 ? 'text-red-400' : 'text-gray-400';
                          
                          return (
                            <tr key={p.id} className="hover:bg-gray-900/50 transition-colors">
                              <td className="px-4 py-4 font-bold text-white flex items-center gap-2">
                                <span className="text-gray-600 w-4">{index + 1}.</span> {p.username}
                              </td>
                              <td className="px-4 py-4 text-center text-gray-400">{p.matches_played}</td>
                              <td className="px-4 py-4 text-center text-green-500/80">{p.goals_scored}</td>
                              <td className="px-4 py-4 text-center text-red-500/80">{p.goals_conceded}</td>
                              <td className={`px-4 py-4 text-center font-bold ${gdColor}`}>
                                {gd > 0 ? `+${gd}` : gd}
                              </td>
                              <td className="px-4 py-4 text-center font-black text-cyan-400 text-sm">{p.points}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: GROUP MATCHES LIST */}
      {activeTab === 'MATCHES' && (
        <div className="space-y-4 max-w-4xl mx-auto animate-fadeIn">
          {groupMatches.length === 0 ? (
             <div className="py-20 flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-lg bg-[#0a0a0c]/50">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No matches scheduled yet.</p>
             </div>
          ) : (
            groupMatches.map((match) => (
              <div key={match.id} className="bg-[#0a0a0c] border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-cyan-900/50 transition-colors shadow-lg">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest w-full md:w-32 text-center md:text-left">{match.round_name}</div>
                <div className="flex-1 flex items-center justify-center gap-4 w-full">
                  <div className={`flex-1 text-right font-bold text-sm truncate ${match.winner_name === match.player_1_name ? 'text-green-400' : 'text-gray-300'}`}>{match.player_1_name}</div>
                  <div className="bg-[#050505] border border-gray-700 rounded px-4 py-2 font-black text-lg min-w-[80px] text-center tracking-widest shadow-inner">
                    {match.is_completed ? `${match.p1_score} - ${match.p2_score}` : 'VS'}
                  </div>
                  <div className={`flex-1 text-left font-bold text-sm truncate ${match.winner_name === match.player_2_name ? 'text-green-400' : 'text-gray-300'}`}>{match.player_2_name}</div>
                </div>
                <div className="w-full md:w-24 text-center md:text-right">
                  {match.is_completed ? <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Final</span> : <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Pending</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: KNOCKOUT BRACKET */}
      {activeTab === 'BRACKET' && (
        <div className="w-full overflow-x-auto pb-10 animate-fadeIn relative">
          {activeRounds.length === 0 ? (
             <div className="py-20 flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-lg bg-[#0a0a0c]/50 max-w-4xl mx-auto">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Knockout stage has not begun.</p>
             </div>
          ) : (
            // Increased gap sizes slightly to give the tree room to breathe
            <div className="flex flex-row min-w-max gap-10 md:gap-16 p-4 items-stretch justify-start min-h-[500px]">
              
              {/* RENDER THE ROUNDS */}
              {activeRounds.map((roundName) => (
                <div key={roundName} className="flex flex-col justify-around w-64 flex-shrink-0 relative">
                  <div className="absolute -top-8 left-0 w-full text-center text-[10px] font-black uppercase tracking-widest text-cyan-500/70 border-b border-cyan-900/50 pb-2">{roundName}</div>
                  
                  {groupedKnockouts[roundName].map((match) => {
                    const p1Winner = match.is_completed && match.winner_name === match.player_1_name;
                    const p2Winner = match.is_completed && match.winner_name === match.player_2_name;
                    
                    return (
                      <div key={match.id} className="relative w-full bg-[#0a0a0c] border border-gray-800 rounded-lg shadow-[0_5px_20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col text-xs font-bold transition-all hover:scale-105 hover:border-cyan-600/60 z-10 my-2">
                        
                        {/* Player 1: Fades out if they lost, glows if they won */}
                        <div className={`flex justify-between items-center p-3 border-b border-gray-800/80 transition-colors ${
                            p1Winner ? 'bg-cyan-900/30 text-cyan-300' : match.is_completed && p2Winner ? 'opacity-30 text-gray-500' : 'text-gray-300'
                          }`}>
                          <span className="truncate pr-2">{match.player_1_name}</span>
                          <span className="font-black text-sm">{match.is_completed ? match.p1_score : '-'}</span>
                        </div>
                        
                        {/* Player 2: Fades out if they lost, glows if they won */}
                        <div className={`flex justify-between items-center p-3 transition-colors ${
                            p2Winner ? 'bg-cyan-900/30 text-cyan-300' : match.is_completed && p1Winner ? 'opacity-30 text-gray-500' : 'text-gray-300'
                          }`}>
                          <span className="truncate pr-2">{match.player_2_name}</span>
                          <span className="font-black text-sm">{match.is_completed ? match.p2_score : '-'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* RENDER THE CHAMPION PODIUM */}
              {activeRounds.includes('Final') && (
                 <div className="flex flex-col justify-around w-64 flex-shrink-0 relative pl-10 border-l border-gray-800/50 ml-4">
                    <div className="absolute -top-8 left-0 w-full text-center text-[10px] font-black uppercase tracking-widest text-yellow-500/70 border-b border-yellow-900/50 pb-2 pl-10">Tournament Champion</div>
                    
                    {tournamentChampion ? (
                       <div className="relative w-full bg-gradient-to-br from-yellow-900/40 to-[#0a0a0c] border border-yellow-500/50 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col items-center justify-center p-8 transform hover:scale-105 transition-all">
                          <span className="text-5xl mb-4 drop-shadow-lg">🏆</span>
                          <span className="text-white font-black text-xl text-center uppercase tracking-wider drop-shadow-md">{tournamentChampion}</span>
                       </div>
                    ) : (
                       <div className="relative w-full bg-[#0a0a0c] border-2 border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center p-8 opacity-60">
                          <span className="text-4xl mb-4 grayscale opacity-50">🏆</span>
                          <span className="text-gray-600 font-bold text-sm text-center uppercase tracking-widest">TBD</span>
                       </div>
                    )}
                 </div>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorldCupFormat;