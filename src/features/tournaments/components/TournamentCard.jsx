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

  const isFull = progressPct >= 100 && tournament.status === 'REGISTRATION';

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
    navigate(`/tournaments/${tournament.id}`, { state: { tournamentData: tournament } });
  };

  const frontImage = tournament.custom_banner || tournament.promo_background;

  // --- DYNAMIC STATUS COLORS ---
  const getStatusTheme = (status) => {
    switch(status) {
      case 'REGISTRATION': 
        return { hover: 'hover:border-green-500/40 hover:shadow-[0_0_8px_rgba(34,197,94,0.15)]', text: 'text-green-500', bg: 'bg-green-500' };
      case 'LIVE': 
        return { hover: 'hover:border-amber-500/40 hover:shadow-[0_0_8px_rgba(245,158,11,0.15)]', text: 'text-amber-500', bg: 'bg-amber-500' };
      case 'COMPLETED': 
        return { hover: 'hover:border-cyan-500/40 hover:shadow-[0_0_8px_rgba(6,182,212,0.15)]', text: 'text-cyan-500', bg: 'bg-cyan-500' };
      case 'GENERATING': 
        return { hover: 'hover:border-orange-500/40 hover:shadow-[0_0_8px_rgba(249,115,22,0.15)]', text: 'text-orange-500', bg: 'bg-orange-500' };
      default: 
        return { hover: 'hover:border-gray-500/40 hover:shadow-none', text: 'text-gray-400', bg: 'bg-gray-500' };
    }
  };

  const theme = getStatusTheme(tournament.status);

  // ==========================================
  // SIDE 1: FRONT OF TICKET (Identity)
  // ==========================================
  const FrontFace = () => (
    <div 
      onClick={handleCardClick}
      className={`absolute inset-0 w-full h-full bg-[#0d1317] border border-transparent rounded-lg overflow-hidden flex cursor-pointer transition-all duration-300 z-10 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translateZ(1px)] ${theme.hover}`}
    >
      <div className="w-12 md:w-16 bg-[#05080a] border-r border-gray-800/50 flex flex-col justify-end items-center pb-8 pt-3 relative z-20 shrink-0">
         <span 
           className="text-[8px] md:text-[10px] text-white font-black uppercase tracking-widest opacity-80 whitespace-nowrap overflow-hidden text-ellipsis px-2"
           style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: '100%' }}
           title={tournament.game_name}
         >
           {tournament.game_name}
         </span>
         <div className="absolute top-3 -left-2.5 w-5 h-5 bg-black rounded-full"></div>
         <div className="absolute bottom-3 -left-2.5 w-5 h-5 bg-black rounded-full"></div>
      </div>

      <div className="flex-1 relative p-4 md:p-6 flex flex-col justify-between overflow-hidden">
        {frontImage && (
          <img src={frontImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1317] via-[#0d1317]/40 to-transparent opacity-90"></div>

        <div></div> 

        <div className="relative z-10 mt-auto flex flex-col items-start">
          <h3 className="text-[11px] md:text-sm font-black text-white uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)] line-clamp-2">
            {tournament.title}
          </h3>
          {/* Inject "SOLD OUT" badge right under the title if full */}
          {isFull && (
            <span className="mt-1 bg-red-600/90 text-white px-1.5 py-0.5 text-[8px] md:text-[9px] font-black tracking-widest rounded-sm border border-red-500 shadow-[0_0_8px_rgba(220,38,38,0.5)]">
              SOLD OUT
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // ==========================================
  // SIDE 2: BACK OF TICKET (Details)
  // ==========================================
  const BackFace = () => (
    <div className={`absolute inset-0 w-full h-full bg-[#0a0f12] border border-transparent rounded-lg flex items-stretch z-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)] overflow-hidden transition-all duration-300 ${theme.hover}`}>
      
      <div className="w-12 md:w-16 bg-[#060a0c] border-r border-gray-800/50 flex flex-col justify-center items-center relative z-20 shrink-0">
        <span 
          className="text-[10px] md:text-xs text-gray-500 tracking-[0.2em] font-mono whitespace-nowrap opacity-70 px-2 py-4"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: '100%' }}
        >
          TKT-{String(tournament.id || '0000').padStart(4, '0')}
        </span>
        <div className="absolute top-3 -left-2.5 w-5 h-5 bg-black rounded-full"></div>
        <div className="absolute bottom-3 -left-2.5 w-5 h-5 bg-black rounded-full"></div>
      </div>

      {tournament.format_overlay && (
        <img src={tournament.format_overlay} alt="Format" className="absolute inset-0 w-full h-full object-cover opacity-20 z-0" />
      )}
      
      <div className="flex-1 relative z-10 p-3 md:p-4 flex flex-col justify-between">
        
        <div className="mb-2">
            <h4 className="text-xs md:text-sm font-black text-gray-300 uppercase tracking-tight truncate line-clamp-1 border-b border-gray-800/80 pb-1">
                {tournament.type_name || "Tournament"}
            </h4>
        </div>

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
              {Number(tournament.entry_fee) > 0 ? `₹${Number(tournament.entry_fee).toLocaleString('en-IN')}` : <span className="text-amber-400">Free</span>}
            </span>
          </div>
        </div>

        <div className="py-1">
          <div className="flex justify-between text-[7px] md:text-[8px] uppercase text-gray-500 font-bold mb-1.5 drop-shadow-md">
            <span>Capacity</span>
            <span>
              <span className="text-cyan-400">{tournament.current_participants}</span>
              <span className="text-gray-600"> / {tournament.max_players}</span>
            </span>
          </div>
          <div className="w-full bg-gray-900 border border-gray-800 h-1.5 rounded-full overflow-hidden shadow-inner">
            <div className={`${theme.bg} h-full transition-all duration-500 shadow-sm`} style={{ width: `${progressPct}%` }}></div>
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-1 shrink-0">
          <div className="text-[7px] md:text-[8px] text-gray-400 font-mono uppercase font-bold text-center tracking-widest">
            Deadline: <span className="text-gray-200">{formatDate(tournament.registration_deadline)}</span>
          </div>
          
          <button 
            onClick={tournament.is_registered || isFull ? null : handleActionClick}
            disabled={(tournament.is_registered || isFull) && tournament.status === 'REGISTRATION'}
            className={`w-full py-1.5 md:py-2 text-[8px] md:text-xs font-black uppercase tracking-widest rounded transition-all shadow-lg ${
              tournament.is_registered && tournament.status === 'REGISTRATION' 
                ? 'bg-gray-800 text-emerald-500 border border-emerald-500/30 cursor-not-allowed' :
              isFull
                ? 'bg-gray-800 text-red-500 border border-red-500/30 cursor-not-allowed' :
              tournament.status === 'REGISTRATION' 
                ? 'bg-cyan-600 border border-cyan-500 text-white hover:bg-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.4)]' :
              'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}>
            {tournament.status === 'REGISTRATION' && tournament.is_registered ? 'Claimed ✓' :
             isFull ? 'FULL' :
             tournament.status === 'REGISTRATION' ? 'Claim Ticket' :
             tournament.status === 'GENERATING' ? 'Brackets' :
             tournament.status === 'LIVE' ? 'Standings' :
             'Results'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col items-center bg-transparent w-full shrink-0">
        
        <div className="relative w-full max-w-5xl px-4 md:px-0 h-[150px] md:h-[180px] [perspective:1000px]">
          <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            <FrontFace />
            <BackFace />
          </div>
        </div>

        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`mt-4 flex items-center gap-2 px-4 py-2 bg-[#0a0f12] border border-gray-800 hover:border-gray-600 rounded-full text-gray-400 hover:text-white text-[9px] md:text-xs uppercase font-bold tracking-widest transition-all shadow-md group`}
        >
          <svg 
            className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-500 ${isFlipped ? '-rotate-180' : 'group-hover:rotate-180'}`} 
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