import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { GAME_TOURNAMENTS } from '../../../services/apiRoutes';
import TournamentCard from '../../tournaments/components/TournamentCard';

const TabTournaments = ({ gameId }) => {
  // 1. Local State: Defaulting to 'LIVE' as requested
  const [activeStatus, setActiveStatus] = useState('LIVE');
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Safe Tab Switcher
  const handleStatusChange = (statusId) => {
    if (activeStatus === statusId) return;
    setActiveStatus(statusId);
    setTournaments([]); // Clear screen immediately for clean UX
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        // Appending the status to the URL so Django can filter it
        const response = await api.get(`${GAME_TOURNAMENTS(gameId)}?status=${activeStatus}`);
        
        // Handle flat array response safely
        const data = response.data.results || response.data;
        setTournaments(data);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (gameId) {
      fetchTournaments();
    }
  }, [gameId, activeStatus]); // Re-run whenever gameId or activeStatus changes

  return (
    <div className="animate-fadeIn w-full">
      
      {/* HEADER & PILL TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-800 pb-6">
        <h2 className="text-xl font-black uppercase text-gray-400 tracking-wider">
          Arena Activity
        </h2>

        {/* Custom Order: Live -> Open -> Past */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { id: 'LIVE', label: 'Live' },
            { id: 'REGISTRATION', label: 'Open' },
            { id: 'COMPLETED', label: 'Past' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleStatusChange(tab.id)} 
              className={`px-4 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all duration-300 border flex-1 sm:flex-none ${
                activeStatus === tab.id 
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(8,145,178,0.2)]' 
                  : 'bg-[#0a0f12] border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="flex justify-center items-center h-48 border border-dashed border-gray-800/40 bg-black/20 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">
              Syncing Matrix...
            </p>
          </div>
        </div>
      ) : tournaments.length === 0 ? (
        <div className="bg-[#0a0a0c] border border-dashed border-gray-800 rounded-lg p-12 text-center animate-fadeIn">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
            No active {activeStatus.toLowerCase()} tournaments for this game right now.
          </p>
        </div>
      ) : (
        /* THE GRID CONTAINER (4 cards per row) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center w-full">
          {tournaments.map((tournament, index) => {
            if (!tournament) return null;
            return (
              <TournamentCard 
                key={tournament.id || index} 
                tournament={tournament} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TabTournaments;











// import React, { useState, useEffect } from 'react';
// import api from '../../../services/api';

// import TournamentCard from '../../tournaments/components/TournamentCard'; 
// import { GAME_TOURNAMENTS } from '../../../services/apiRoutes';

// const TabTournaments = ({ gameId }) => {
//   const [tournaments, setTournaments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTournaments = async () => {
//       try {
//         const response = await api.get(GAME_TOURNAMENTS(gameId));
//         setTournaments(response.data);
//       } catch (error) {
//         console.error("Failed to fetch tournaments:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTournaments();
//   }, [gameId]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-20">
//         <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (tournaments.length === 0) {
//     return (
//       <div className="bg-[#0a0a0c] border border-gray-800 rounded-lg p-12 text-center animate-fadeIn">
//         <p className="text-gray-500 font-bold uppercase tracking-widest">
//           No active tournaments for this game right now.
//         </p>
//       </div>
//     );
//   }

//   return (
//     // Changed to a single column flexbox so the wide cards fit perfectly
//     <div className="flex flex-col gap-8 animate-fadeIn">
//       {tournaments.map((tournament) => (
//         <TournamentCard key={tournament.id} tournament={tournament} />
//       ))}
//     </div>
//   );
// };

// export default TabTournaments;