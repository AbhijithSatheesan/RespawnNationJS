import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api'; 
import { SEE_TOURNAMENTS } from '../../services/apiRoutes';
import TournamentCard from './components/TournamentCard';
import { setTournament } from '../../services/TechBackGround/techBackgroundSlice';

const TournamentDashboard = () => {
  const dispatch = useDispatch();
  
  // URL bound state ensures the back button works perfectly
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'REGISTRATION';
  
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); 
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 

  const handleTabChange = (tabId) => {
    if (activeTab === tabId) return; 
    
    // FIX: Added { replace: true } to stop tab clicks from clogging the back button history!
    setSearchParams({ tab: tabId }, { replace: true }); 
    
    setTournaments([]); 
    setPage(1); 
    setHasMore(true);
  };

  useEffect(() => {
    dispatch(setTournament());

    const fetchTournaments = async () => {
      page === 1 ? setLoading(true) : setLoadingMore(true); 

      try {
        let fetchStatus = activeTab;
        if (activeTab === 'ONGOING') fetchStatus = 'LIVE';

        const response = await api.get(`${SEE_TOURNAMENTS}?status=${fetchStatus}&page=${page}`);
        
        const newTournaments = response.data.results;
        const nextLink = response.data.next;

        if (page === 1) {
          setTournaments(newTournaments); 
        } else {
          setTournaments(prev => [...prev, ...newTournaments]); 
        }

        setHasMore(nextLink !== null);

      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchTournaments();
  }, [dispatch, activeTab, page]); 

  return (
    <div className="min-h-screen bg-transparent text-white font-mono pt-20 md:pt-24 px-4 sm:px-8 lg:px-16 pb-20">
      
      {/* Header Section */}
      <div className="mb-8 md:mb-10 text-center md:text-left mt-4 md:mt-0 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2 drop-shadow-lg">
          TOURNAMENTS
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base tracking-widest uppercase font-semibold drop-shadow-md">
          Compete. Win. Dominate the Leaderboards.
        </p>
      </div>

      {/* MOBILE RESPONSIVE PILL TABS */}
      <div className="flex flex-wrap justify-center md:justify-start gap-2.5 sm:gap-4 mb-10 w-full max-w-7xl mx-auto">
        {[
          { id: 'REGISTRATION', label: 'Registration Open' },
          { id: 'ONGOING', label: 'Ongoing Matches' },
          { id: 'COMPLETED', label: 'Past Results' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)} 
            className={`px-5 py-3 rounded-lg font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-300 border ${
              activeTab === tab.id 
                ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(8,145,178,0.2)]' 
                : 'bg-[#0a0f12] border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-cyan-400 shadow-[0_0_15px_rgba(8,145,178,0.5)]"></div>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto">
          {tournaments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-20 border-2 border-dashed border-gray-700 bg-black/40 backdrop-blur-sm rounded-xl mx-2 md:mx-0">
              <p className="text-lg md:text-xl italic text-gray-400 font-bold tracking-widest uppercase">No Intel Found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center">
                {tournaments.map((tournament, index) => {
                  if (!tournament) return null;
                  return <TournamentCard key={tournament.id || index} tournament={tournament} />
                })}
              </div>
              
              {hasMore && (
                <div className="flex justify-center mt-10 md:mt-12 w-full px-4 md:px-0">
                  <button 
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={loadingMore}
                    className="w-full sm:w-auto justify-center px-8 py-3.5 md:py-3 bg-gray-900 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-400 font-bold uppercase tracking-widest text-xs md:text-sm rounded transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore && (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-cyan-400"></div>
                    )}
                    {loadingMore ? 'Decrypting Data...' : 'Load More Tournaments'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TournamentDashboard;






// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import api from '../../services/api'; 
// import { SEE_TOURNAMENTS } from '../../services/apiRoutes';
// import TournamentCard from './components/TournamentCard';
// import { setTournament } from '../../services/TechBackGround/techBackgroundSlice';

// const TournamentDashboard = () => {
//   const dispatch = useDispatch();
  
//   const [tournaments, setTournaments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false); // Spinner just for the button
//   const [activeTab, setActiveTab] = useState('REGISTRATION');
  
//   // NEW: Pagination States
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true); // Tells us if there is a "next" page in the DB

//   // Handles switching tabs safely
//   const handleTabChange = (tabId) => {
//     if (activeTab === tabId) return; // Do nothing if clicking the same tab
//     setActiveTab(tabId);
//     setTournaments([]); // Clear the screen immediately for good UX
//     setPage(1); // Reset back to page 1 for the new tab
//     setHasMore(true);
//   };

//   useEffect(() => {
//     dispatch(setTournament());

//     const fetchTournaments = async () => {
//       // If page 1, show massive screen spinner. If page 2+, show small button spinner.
//       page === 1 ? setLoading(true) : setLoadingMore(true); 

//       try {
//         let fetchStatus = activeTab;
//         if (activeTab === 'ONGOING') fetchStatus = 'LIVE';

//         // Include the page number in the API request!
//         const response = await api.get(`${SEE_TOURNAMENTS}?status=${fetchStatus}&page=${page}`);
        
//         // Django now wraps our data inside "results", and gives us a "next" link if more exist
//         const newTournaments = response.data.results;
//         const nextLink = response.data.next;

//         if (page === 1) {
//           setTournaments(newTournaments); // Fresh list for page 1
//         } else {
//           setTournaments(prev => [...prev, ...newTournaments]); // Append to bottom for page 2+
//         }

//         // If 'next' is null, we hit the end of the database!
//         setHasMore(nextLink !== null);

//       } catch (error) {
//         console.error("Error fetching tournaments:", error);
//       } finally {
//         setLoading(false);
//         setLoadingMore(false);
//       }
//     };

//     fetchTournaments();
//   }, [dispatch, activeTab, page]); // Re-run whenever tab OR page changes

//   return (
//     <div className="min-h-screen bg-transparent text-white font-mono pt-24 px-4 sm:px-8 lg:px-16 pb-20">
      
//       {/* Header Section */}
//       <div className="mb-12 text-center md:text-left">
//         <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2 drop-shadow-lg">
//           TOURNAMENTS
//         </h1>
//         <p className="text-gray-300 text-sm md:text-base tracking-widest uppercase font-semibold drop-shadow-md">
//           Compete. Win. Dominate the Leaderboards.
//         </p>
//       </div>

//       {/* Tabs Navigation */}
//       <div className="flex flex-wrap border-b border-gray-700 mb-8">
//         {[
//           { id: 'REGISTRATION', label: 'Registration Open' },
//           { id: 'ONGOING', label: 'Ongoing Matches' },
//           { id: 'COMPLETED', label: 'Past Results' }
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => handleTabChange(tab.id)} // Used our new safe handler
//             className={`px-6 py-4 font-bold uppercase tracking-wider text-sm transition-all duration-300 relative ${
//               activeTab === tab.id 
//                 ? 'text-cyan-400' 
//                 : 'text-gray-400 hover:text-gray-200'
//             }`}
//           >
//             {tab.label}
//             {activeTab === tab.id && (
//               <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_12px_rgba(8,145,178,1)]"></span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Content Area */}
//       {loading ? (
//         <div className="flex flex-col justify-center items-center h-64 space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 shadow-[0_0_15px_rgba(8,145,178,0.5)]"></div>
//         </div>
//       ) : (
//         <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
//           {tournaments.length === 0 ? (
//             <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-700 bg-black/40 backdrop-blur-sm rounded-xl">
//               <p className="text-xl italic text-gray-400 font-bold tracking-widest uppercase">No Intel Found</p>
//             </div>
//           ) : (
//             <>
//               {tournaments.map((tournament) => (
//                 <TournamentCard key={tournament.id} tournament={tournament} />
//               ))}
              
//               {/* THE "LOAD MORE" BUTTON */}
//               {hasMore && (
//                 <div className="flex justify-center mt-8">
//                   <button 
//                     onClick={() => setPage(prev => prev + 1)}
//                     disabled={loadingMore}
//                     className="px-8 py-3 bg-gray-900 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-400 font-bold uppercase tracking-widest text-sm rounded transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loadingMore && (
//                       <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-cyan-400"></div>
//                     )}
//                     {loadingMore ? 'Decrypting Data...' : 'Load More Tournaments'}
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TournamentDashboard;