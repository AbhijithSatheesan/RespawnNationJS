import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ActiveMatchHub from './ActiveMatchHub'; // <--- 1. IMPORT YOUR NEW COMPONENT

const TournamentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2. NEW STATE: Tracks which tournament the user clicked
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/tournaments/userdashboard/'); 
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch tournament dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="text-cyan-500 font-bold uppercase tracking-widest text-xs animate-pulse">
          Loading Tournament Data...
        </span>
      </div>
    );
  }

  if (!dashboardData) return null;

  // 3. CONDITIONAL RENDER: If a tournament is selected, ONLY show the Match Hub!
  if (selectedTournamentId) {
    return (
      <ActiveMatchHub 
        tournamentId={selectedTournamentId} 
        onBack={() => setSelectedTournamentId(null)} // This is how the "Return" button works!
      />
    );
  }

  // OTHERWISE: Show the normal Dashboard
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* TROPHY CABINET */}
      <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-6">
        <h2 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-4 flex justify-between items-center">
          <span>Trophy Cabinet</span>
          <span className="text-cyan-500">{dashboardData.trophy_count} Won</span>
        </h2>
        
        {dashboardData.trophies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardData.trophies.map((trophy) => (
              <div key={trophy.id} className="border border-yellow-500/30 bg-yellow-500/5 rounded p-4 text-center group hover:border-yellow-500 transition-colors">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
                <p className="text-xs font-bold text-white uppercase truncate">{trophy.title}</p>
                <p className="text-[10px] text-gray-500 uppercase">{trophy.game}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No trophies yet. Enter the arena to claim your first victory.</p>
        )}
      </div>

      {/* LIVE TOURNAMENTS */}
      <div className="bg-[#0a0a0c] border border-cyan-900/50 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <h2 className="text-cyan-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Active Operations (Live Matches)
        </h2>

        {dashboardData.dashboard.live.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.dashboard.live.map((tourney) => (
              <div key={tourney.id} className="border border-gray-700 bg-black/40 rounded p-4 flex justify-between items-center hover:border-cyan-500/50 transition-colors">
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wider">{tourney.title}</h3>
                  <p className="text-xs text-gray-400 uppercase">{tourney.game}</p>
                </div>
                
                {/* 4. THE TRIGGER: Clicking this button sets the state and loads the Hub */}
                <button 
                  onClick={() => setSelectedTournamentId(tourney.id)}
                  className="bg-cyan-600/20 border border-cyan-600 hover:bg-cyan-500 hover:text-black text-cyan-400 text-xs font-bold uppercase px-4 py-2 rounded transition-all tracking-widest"
                >
                  Enter Hub
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No active tournaments right now.</p>
        )}
      </div>

    </div>
  );
};

export default TournamentDashboard;