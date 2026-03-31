import React from 'react';
import { useNavigate } from 'react-router-dom';

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate();

  const progressPct = tournament.max_players > 0 
    ? Math.min((tournament.current_participants / tournament.max_players) * 100, 100) 
    : 0;

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleActionClick = () => {
    // Navigates to a specific tournament detail/standings page
    navigate(`/tournaments/${tournament.id}`);
  };

  // =========================================================================
  // THE DETAILS WIDGET (Reused in both layouts so we don't duplicate code)
  // =========================================================================
  const TournamentDetails = () => (
    <div className="flex flex-col h-full w-full justify-between">
      {/* Top Header: Game & Status */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-cyan-400 font-black text-xs uppercase tracking-widest bg-black/60 px-2 py-1 border border-cyan-800/50 backdrop-blur-sm shadow-md">
          {tournament.game_name}
        </span>
        <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 bg-black/60 px-2 py-1 border border-gray-700/50 backdrop-blur-sm shadow-md">
          {tournament.status === 'REGISTRATION' && <span className="text-green-500">● Open</span>}
          {tournament.status === 'GENERATING' && <span className="text-yellow-500">Building</span>}
          {tournament.status === 'LIVE' && <span className="text-red-500 animate-pulse">● Live</span>}
          {tournament.status === 'COMPLETED' && <span className="text-gray-500">Completed</span>}
        </div>
      </div>

      {/* Tournament Title */}
      <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none mb-6 line-clamp-2 drop-shadow-lg">
        {tournament.title}
      </h3>

      {/* Dynamic Stats Area */}
      <div className="mt-auto border-t border-gray-700/60 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Registration Stats */}
        {tournament.status === 'REGISTRATION' && (
          <div className="w-full">
            <div className="flex justify-between text-[10px] uppercase text-gray-300 font-bold mb-1.5 drop-shadow-md">
              <span>Slots Filled</span>
              <span className="text-white"><span className="text-cyan-400">{tournament.current_participants}</span> / {tournament.max_players}</span>
            </div>
            <div className="w-full bg-gray-900/80 border border-gray-800 h-1.5 mb-2">
              <div className="bg-cyan-500 h-1.5 transition-all duration-500 shadow-[0_0_10px_rgba(8,145,178,0.8)]" style={{ width: `${progressPct}%` }}></div>
            </div>
            <div className="text-[10px] text-gray-400 font-mono uppercase font-bold drop-shadow-md">
              Starts: <span className="text-gray-200">{formatDate(tournament.registration_deadline)}</span>
            </div>
          </div>
        )}

        {/* Live Stats */}
        {(tournament.status === 'LIVE' || tournament.status === 'GENERATING') && (
          <div className="w-full flex justify-between items-center">
            <span className="text-[10px] uppercase text-gray-300 font-bold drop-shadow-md">Total Players Active</span>
            <span className="text-white font-mono font-black text-2xl drop-shadow-lg">{tournament.current_participants}</span>
          </div>
        )}

        {/* Completed Stats */}
        {tournament.status === 'COMPLETED' && (
          <div className="w-full flex items-center gap-3">
            <span className="text-yellow-500 font-black uppercase text-[10px] bg-yellow-900/40 px-2 py-1 border border-yellow-700/50 backdrop-blur-sm">Winner</span>
            <span className="text-white font-bold text-sm truncate uppercase tracking-wider drop-shadow-md">{tournament.winner_name}</span>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={handleActionClick}
          className={`w-full md:w-32 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border shadow-lg backdrop-blur-sm ${
          tournament.status === 'REGISTRATION' ? 'bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(8,145,178,0.6)]' :
          tournament.status === 'GENERATING' ? 'bg-black/50 text-yellow-500 border-yellow-500/50 hover:bg-yellow-900/40' :
          tournament.status === 'LIVE' ? 'bg-black/50 text-red-500 border-red-500/50 hover:bg-red-900/40' :
          'bg-gray-800/80 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white'
        }`}>
          {tournament.status === 'REGISTRATION' ? 'Join Now' :
           tournament.status === 'GENERATING' ? 'Brackets' :
           tournament.status === 'LIVE' ? 'Standings' :
           'Results'}
        </button>
      </div>
    </div>
  );

  // =========================================================================
  // LAYOUT A: THE SPECIAL EVENT (Custom Banner overrides everything)
  // =========================================================================
  if (tournament.custom_banner) {
    return (
      <div className="relative w-full rounded-lg min-h-[220px] bg-black border border-gray-800 hover:border-cyan-500/60 transition-colors duration-300 group overflow-hidden shadow-lg flex items-center">
        {/* Full Card Background Image */}
        <img 
          src={tournament.custom_banner} 
          alt="Special Event" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
        />
        {/* Heavy dark overlay so the text remains readable over the image */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500"></div>
        
        {/* Details floating in the center */}
        <div className="relative z-10 w-full p-6">
          <TournamentDetails />
        </div>
      </div>
    );
  }

  // =========================================================================
  // LAYOUT B: THE 4-PART GRID (No Custom Banner)
  // =========================================================================
  return (
    <div className="w-full rounded-lg min-h-[220px] bg-black border border-gray-800 hover:border-cyan-500/60 transition-colors duration-300 group grid grid-cols-1 md:grid-cols-4 overflow-hidden shadow-lg">
      
      {/* 1. LEFT IMAGE (Format Overlay - Exactly 25%) */}
      {/* object-cover ensures it fills the box completely with no padding */}
      <div className="col-span-1 border-b md:border-b-0 md:border-r border-gray-800 relative h-48 md:h-full overflow-hidden bg-[#050505]">
        {tournament.format_overlay ? (
          <img 
            src={tournament.format_overlay} 
            alt="Format" 
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold uppercase tracking-widest text-[10px]">No Format</div>
        )}
      </div>

      {/* 2 & 3. TEXT DETAILS (Center 50%) */}
      <div className="col-span-1 md:col-span-2 bg-[#08080a] p-6 flex flex-col justify-center relative z-10">
        <TournamentDetails />
      </div>

      {/* 4. RIGHT IMAGE (Game Promo - Exactly 25%) */}
      <div className="col-span-1 border-t md:border-t-0 md:border-l border-gray-800 relative h-48 md:h-full overflow-hidden bg-[#050505]">
        {tournament.promo_background ? (
          <img 
            src={tournament.promo_background} 
            alt="Game Promo" 
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold uppercase tracking-widest text-[10px]">No Promo</div>
        )}
      </div>

    </div>
  );
};

export default TournamentCard;


















// import React from 'react';

// const TournamentCard = ({ tournament }) => {
//   const progressPct = tournament.max_players > 0 
//     ? Math.min((tournament.current_participants / tournament.max_players) * 100, 100) 
//     : 0;

//   const formatDate = (dateString) => {
//     const options = { month: 'short', day: 'numeric', year: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const mainBackgroundImage = tournament.custom_banner 
//     ? tournament.custom_banner 
//     : tournament.promo_background;

//   return (
//     // The main container is pure black (bg-black)
//     <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-gray-800 hover:border-cyan-500/60 bg-black transition-all duration-500 group min-h-[340px] flex items-center justify-center">
      
//       {/* OVERRIDE: Custom Banner */}
//       {tournament.custom_banner && (
//         <div className="absolute inset-0 z-0">
//           <img src={tournament.custom_banner} alt="Special Event" className="w-full h-full object-cover opacity-60" />
//           <div className="absolute inset-0 bg-black/50"></div>
//         </div>
//       )}

//       {/* ========================================= */}
//       {/* 1. LEFT SIDE (Format Overlay fading to center) */}
//       {/* ========================================= */}
//       {!tournament.custom_banner && tournament.format_overlay && (
//         <div className="absolute top-0 left-0 w-full md:w-1/2 h-1/2 md:h-full z-0 pointer-events-none">
//           <img 
//             src={tournament.format_overlay} 
//             alt="Format Icon" 
//             className="w-full h-full object-contain md:object-cover object-center md:object-left opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700 p-4 md:p-0"
//           />
//           {/* THE FADE: Transparent on left, solid black on right (bottom for mobile) */}
//           <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-black/40 to-black"></div>
//         </div>
//       )}

//       {/* ========================================= */}
//       {/* 4. RIGHT SIDE (Game Promo fading to center) */}
//       {/* ========================================= */}
//       {!tournament.custom_banner && (
//         <div className="absolute bottom-0 md:top-0 right-0 w-full md:w-1/2 h-1/2 md:h-full z-0 pointer-events-none">
//           <img 
//             src={mainBackgroundImage || ''} 
//             alt="Game Background"
//             className="w-full h-full object-cover object-center md:object-right opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-transform duration-1000"
//           />
//           {/* THE FADE: Transparent on right, solid black on left (top for mobile) */}
//           <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent via-black/50 to-black"></div>
//         </div>
//       )}

//       {/* ========================================= */}
//       {/* 2 & 3. THE BLACK CENTER (Details)         */}
//       {/* ========================================= */}
//       <div className="relative z-10 w-full max-w-xl p-6 flex flex-col items-center text-center">
        
//         {/* Badges & Game Title */}
//         <div className="flex flex-col items-center gap-3 mb-3">
//           <div className="bg-black/90 px-4 py-1.5 rounded border border-gray-700 text-[10px] font-bold uppercase tracking-widest shadow-lg">
//             {tournament.status === 'REGISTRATION' && <span className="text-green-400">● Registration Open</span>}
//             {tournament.status === 'GENERATING' && <span className="text-yellow-400">Building Brackets</span>}
//             {tournament.status === 'LIVE' && <span className="text-red-500 animate-pulse">● Live Now</span>}
//             {tournament.status === 'COMPLETED' && <span className="text-gray-400">Tournament Finished</span>}
//           </div>
//           <span className="text-cyan-400 font-black text-sm uppercase tracking-widest drop-shadow-md">
//             {tournament.game_name}
//           </span>
//         </div>
        
//         {/* Tournament Title */}
//         <h3 className="text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,1)] line-clamp-2 mb-6">
//           {tournament.title}
//         </h3>

//         {/* Dynamic Stats Panel */}
//         <div className="w-full mb-6">
//           {tournament.status === 'REGISTRATION' && (
//             <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Slots Filled</span>
//                 <span className="text-white text-xs font-bold">
//                   <span className="text-cyan-400">{tournament.current_participants}</span> / {tournament.max_players}
//                 </span>
//               </div>
//               <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden mb-3">
//                 <div 
//                   className="bg-cyan-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(8,145,178,0.8)] transition-all duration-1000" 
//                   style={{ width: `${progressPct}%` }}
//                 ></div>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Starts:</span>
//                 <span className="text-gray-200 text-xs font-semibold">{formatDate(tournament.registration_deadline)}</span>
//               </div>
//             </div>
//           )}

//           {(tournament.status === 'LIVE' || tournament.status === 'GENERATING') && (
//             <div className="flex flex-col items-center bg-black/60 backdrop-blur-md p-4 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
//               <span className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Total Players Competing</span>
//               <span className="text-white font-black text-3xl drop-shadow-md">{tournament.current_participants}</span>
//             </div>
//           )}

//           {tournament.status === 'COMPLETED' && (
//             <div className="flex flex-col items-center justify-center bg-gradient-to-t from-yellow-900/40 to-black/80 backdrop-blur-md p-4 rounded-xl border-b-4 border-yellow-500 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
//               <span className="text-yellow-500 font-black uppercase text-[10px] tracking-widest mb-1">🏆 Grand Champion</span>
//               <span className="text-white font-black text-2xl drop-shadow-md truncate w-full text-center">{tournament.winner_name}</span>
//             </div>
//           )}
//         </div>

//         {/* Action Button */}
//         <button className={`w-full py-3.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all backdrop-blur-md ${
//           tournament.status === 'REGISTRATION' ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_25px_rgba(8,145,178,0.8)]' :
//           tournament.status === 'GENERATING' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-500 hover:text-white' :
//           tournament.status === 'LIVE' ? 'bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600 hover:text-white hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]' :
//           'bg-gray-800/80 hover:bg-gray-700 text-gray-300 border border-gray-500 hover:border-gray-400'
//         }`}>
//           {tournament.status === 'REGISTRATION' ? 'Join Tournament' :
//            tournament.status === 'GENERATING' ? 'View Bracket' :
//            tournament.status === 'LIVE' ? 'Watch Live' :
//            'Final Results'}
//         </button>

//       </div>
//     </div>
//   );
// };

// export default TournamentCard;