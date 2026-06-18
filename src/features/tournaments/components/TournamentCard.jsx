import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import JoinTournamentModal from './JoinTournamentModal';
import LoginModal from '../../auth/LoginModal';

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const progressPct = tournament.max_players > 0 
    ? Math.min((tournament.current_participants / tournament.max_players) * 100, 100) 
    : 0;

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCardClick = () => {
    navigate(`/tournaments/${tournament.id}`, { state: { tournamentData: tournament } });
  };

  const handleActionClick = (e) => {
    e.stopPropagation(); 
    if (tournament.status === 'REGISTRATION') {
      if (!userInfo) setIsLoginModalOpen(true); 
      else setIsJoinModalOpen(true); 
    } else {
      navigate(`/tournaments/${tournament.id}`, { state: { tournamentData: tournament } });
    }
  };

  const handlePaymentSuccess = () => {
    setIsJoinModalOpen(false);
    window.location.reload(); 
  };

  const frontImage = tournament.custom_banner || tournament.promo_background;

  // ==========================================
  // SIDE 1: FRONT OF TICKET (Identity)
  // ==========================================
  const FrontFace = () => (
    <div 
      onClick={handleCardClick}
      className="absolute inset-0 w-full h-full bg-[#0d1317] border border-gray-800 rounded-lg overflow-hidden shadow-xl flex cursor-pointer hover:border-cyan-500/50 transition-colors z-10 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translateZ(1px)]"
    >
      {/* Left stub with perforations */}
      <div className="w-12 md:w-16 bg-[#05080a] border-r border-gray-800/50 flex flex-col justify-center items-center py-3 relative z-20">
         <span className="text-[8px] text-gray-600 tracking-[0.2em] font-mono -rotate-90 whitespace-nowrap opacity-50">
           TKT-{String(tournament.id || '0000').padStart(4, '0')}
         </span>
         <div className="absolute top-3 -left-2.5 w-5 h-5 bg-black rounded-full"></div>
         <div className="absolute bottom-3 -left-2.5 w-5 h-5 bg-black rounded-full"></div>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative p-4 md:p-6 flex flex-col justify-between overflow-hidden">
        {frontImage && (
          <img src={frontImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1317] via-[#0d1317]/50 to-transparent opacity-90"></div>

        <div className="relative z-10 flex justify-between items-start gap-3">
          <span className="text-cyan-400 font-black text-[9px] md:text-xs uppercase tracking-widest bg-black/80 px-2 py-0.5 border border-cyan-800/50 backdrop-blur-sm">
            {tournament.game_name}
          </span>
          <div className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 bg-black/80 px-2 py-0.5 border border-gray-700/50 backdrop-blur-sm">
            {tournament.status === 'REGISTRATION' && <span className="text-green-500">● Open</span>}
            {tournament.status === 'GENERATING' && <span className="text-yellow-500">Building</span>}
            {tournament.status === 'LIVE' && <span className="text-red-500 animate-pulse">● Live</span>}
            {tournament.status === 'COMPLETED' && <span className="text-gray-500">Ended</span>}
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2">
            {tournament.title}
          </h3>
          <p className="text-[8px] md:text-xs text-gray-300 font-mono uppercase tracking-widest drop-shadow-md mt-1">
            {formatDate(tournament.registration_deadline)}
          </p>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // SIDE 2: BACK OF TICKET (Details)
  // ==========================================
  const BackFace = () => (
    <div className="absolute inset-0 w-full h-full bg-[#0a0f12] border border-cyan-500/50 rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.2)] flex items-stretch z-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)] overflow-hidden">
      
      {/* Left stub (matches front) */}
      <div className="w-12 md:w-16 bg-[#060a0c] border-r border-gray-800/50 flex flex-col justify-center items-center relative z-20">
        <span className="text-[8px] text-gray-600 tracking-[0.2em] font-mono -rotate-90 whitespace-nowrap opacity-50">
          DETAILS
        </span>
        <div className="absolute top-3 -left-2.5 w-5 h-5 bg-black rounded-full"></div>
        <div className="absolute bottom-3 -left-2.5 w-5 h-5 bg-black rounded-full"></div>
      </div>

      {/* Format Overlay Background */}
      {tournament.format_overlay && (
        <img src={tournament.format_overlay} alt="Format" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      )}
      
      {/* Main content - organized with clear sections */}
      <div className="flex-1 relative p-3 md:p-5 flex flex-col justify-between gap-1">
        
        {/* Top Row: Prize & Entry (side by side) */}
        <div className="flex gap-4 md:gap-6 items-start">
          <div className="flex-1">
            <span className="text-[7px] md:text-[8px] uppercase text-gray-500 font-bold tracking-widest block mb-1 drop-shadow-md">Prize Pool</span>
            <span className="text-base md:text-lg font-black text-emerald-400 drop-shadow-md leading-none">
              ₹{Number(tournament.current_prize_pool || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex-1">
            <span className="text-[7px] md:text-[8px] uppercase text-gray-500 font-bold tracking-widest block mb-1 drop-shadow-md">Entry Fee</span>
            <span className="text-base md:text-lg font-bold text-white drop-shadow-md">
              {Number(tournament.entry_fee) > 0 ? `₹${tournament.entry_fee}` : <span className="text-amber-400">Free</span>}
            </span>
          </div>
        </div>

        {/* Middle Row: Capacity Info */}
        <div className="py-0.5">
          <div className="flex justify-between text-[7px] md:text-[8px] uppercase text-gray-500 font-bold mb-1.5 drop-shadow-md">
            <span>Capacity</span>
            <span>
              <span className="text-cyan-400">{tournament.current_participants}</span>
              <span className="text-gray-600"> / {tournament.max_players}</span>
            </span>
          </div>
          <div className="w-full bg-gray-900 border border-gray-800 h-1 rounded-full overflow-hidden shadow-inner">
            <div className="bg-cyan-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(8,145,178,0.8)]" style={{ width: `${progressPct}%` }}></div>
          </div>
        </div>

        {/* Status text */}
        {tournament.status === 'REGISTRATION' && (
          <div className="text-[7px] md:text-[8px] text-gray-600 uppercase tracking-widest font-bold drop-shadow-md">
            {Math.round(progressPct)}% Filled
          </div>
        )}

        {/* Bottom: Action button */}
        <button 
          onClick={tournament.is_registered ? null : handleActionClick}
          disabled={tournament.is_registered && tournament.status === 'REGISTRATION'}
          className={`w-full py-1.5 md:py-2 text-[8px] md:text-xs font-black uppercase tracking-widest rounded transition-all shadow-lg mt-auto ${
            tournament.is_registered && tournament.status === 'REGISTRATION' 
              ? 'bg-gray-800 text-emerald-500 border border-emerald-500/30 cursor-not-allowed' :
            tournament.status === 'REGISTRATION' 
              ? 'bg-cyan-600 border border-cyan-500 text-white hover:bg-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.4)]' :
            'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
          }`}>
          {tournament.status === 'REGISTRATION' && tournament.is_registered ? 'Claimed ✓' :
           tournament.status === 'REGISTRATION' ? 'Claim Ticket' :
           tournament.status === 'GENERATING' ? 'Brackets' :
           tournament.status === 'LIVE' ? 'Standings' :
           'Results'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* WIDE TICKET LAYOUT: Full width with max-width container */}
      <div className="flex flex-col items-center bg-transparent w-full shrink-0">
        
        {/* Ticket dimensions: Wider landscape with better vertical space */}
        <div className="relative w-full max-w-4xl px-4 md:px-0 h-[160px] md:h-[200px] [perspective:1000px]">
          <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            <FrontFace />
            <BackFace />
          </div>
        </div>

        {/* Flip button */}
        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#0a0f12] border border-gray-800 hover:border-cyan-500 rounded-full text-gray-400 hover:text-cyan-400 text-[9px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-md group"
        >
          <svg 
            className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-500 ${isFlipped ? '-rotate-180 text-cyan-400' : 'group-hover:rotate-180'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isFlipped ? 'View Front' : 'Flip Ticket'}
        </button>

      </div>

      {isJoinModalOpen && (
        <JoinTournamentModal 
          tournamentId={tournament.id}
          tournamentTitle={tournament.title}
          entryFee={tournament.entry_fee}
          onClose={() => setIsJoinModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      )}
    </>
  );
};

export default TournamentCard;




