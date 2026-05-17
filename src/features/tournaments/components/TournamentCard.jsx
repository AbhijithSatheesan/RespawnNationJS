import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import JoinTournamentModal from './JoinTournamentModal';
import LoginModal from '../../auth/LoginModal';

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate();
  
  // Get user info from Redux store
  const { userInfo } = useSelector((state) => state.user);

  // States to control modals
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const progressPct = tournament.max_players > 0 
    ? Math.min((tournament.current_participants / tournament.max_players) * 100, 100) 
    : 0;

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // PASSING ENTIRE OBJECT IN STATE
  const handleCardClick = () => {
    navigate(`/tournaments/${tournament.id}`, { 
      state: { tournamentData: tournament } 
    });
  };

  // PASSING ENTIRE OBJECT IN STATE
  const handleActionClick = (e) => {
    e.stopPropagation(); 
    
    if (tournament.status === 'REGISTRATION') {
      if (!userInfo) {
        setIsLoginModalOpen(true); 
      } else {
        setIsJoinModalOpen(true); 
      }
    } else {
      navigate(`/tournaments/${tournament.id}`, { 
        state: { tournamentData: tournament } 
      });
    }
  };

  const handlePaymentSuccess = () => {
    setIsJoinModalOpen(false);
    window.location.reload(); 
  };

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

      <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none mb-6 line-clamp-2 drop-shadow-lg">
        {tournament.title}
      </h3>

      <div className="mt-auto border-t border-gray-700/60 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {tournament.status === 'REGISTRATION' && (
          <div className="w-full">
            <div className="flex justify-between items-end mb-3 bg-black/40 p-2 rounded border border-gray-800/50">
               <div>
                  <span className="text-[10px] uppercase text-gray-400 font-bold block mb-0.5 tracking-widest">Prize Pool</span>
                  <span className="text-xl font-black text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]">
                    ₹{tournament.current_prize_pool || "0.00"}
                  </span>
               </div>
               <div className="text-right">
                  <span className="text-[10px] uppercase text-gray-400 font-bold block mb-0.5 tracking-widest">Entry Fee</span>
                  <span className="text-sm font-bold text-white">
                    {tournament.entry_fee > 0 ? `₹${tournament.entry_fee}` : <span className="text-yellow-400 tracking-widest uppercase">Free</span>}
                  </span>
               </div>
            </div>

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

        {/* Action Button */}
        <button 
          onClick={tournament.is_registered ? null : handleActionClick}
          disabled={tournament.is_registered && tournament.status === 'REGISTRATION'}
          className={`w-full md:w-32 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border shadow-lg backdrop-blur-sm z-20 relative ${
            tournament.is_registered && tournament.status === 'REGISTRATION' 
              ? 'bg-gray-800 text-green-500 border-green-500/30 cursor-not-allowed' :
            tournament.status === 'REGISTRATION' 
              ? 'bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-500' :
            tournament.status === 'GENERATING' 
              ? 'bg-black/50 text-yellow-500 border-yellow-500/50' :
            tournament.status === 'LIVE' 
              ? 'bg-black/50 text-red-500 border-red-500/50' :
            'bg-gray-800/80 text-gray-300 border-gray-600'
        }`}>
          {tournament.status === 'REGISTRATION' && tournament.is_registered ? 'Joined ✓' :
           tournament.status === 'REGISTRATION' ? 'Join Now' :
           tournament.status === 'GENERATING' ? 'Brackets' :
           tournament.status === 'LIVE' ? 'Standings' :
           'Results'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {tournament.custom_banner ? (
        <div 
          onClick={handleCardClick}
          className="relative w-full rounded-lg min-h-[220px] bg-black border border-gray-800 hover:border-cyan-500/60 transition-colors duration-300 group overflow-hidden shadow-lg flex items-center cursor-pointer"
        >
          <img src={tournament.custom_banner} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 w-full p-6">
            <TournamentDetails />
          </div>
        </div>
      ) : (
        <div 
          onClick={handleCardClick}
          className="w-full rounded-lg min-h-[220px] bg-black border border-gray-800 hover:border-cyan-500/60 transition-colors duration-300 group grid grid-cols-1 md:grid-cols-4 overflow-hidden shadow-lg cursor-pointer"
        >
          <div className="col-span-1 border-b md:border-b-0 md:border-r border-gray-800 relative h-48 md:h-full bg-[#050505]">
            {tournament.format_overlay && <img src={tournament.format_overlay} className="absolute inset-0 w-full h-full object-cover" />}
          </div>
          <div className="col-span-1 md:col-span-2 bg-[#08080a] p-6 flex flex-col justify-center relative z-10">
            <TournamentDetails />
          </div>
          <div className="col-span-1 border-t md:border-t-0 md:border-l border-gray-800 relative h-48 md:h-full bg-[#050505]">
            {tournament.promo_background && <img src={tournament.promo_background} className="absolute inset-0 w-full h-full object-cover" />}
          </div>
        </div>
      )}

      {/* RENDER MODALS */}
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
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      )}
    </>
  );
};

export default TournamentCard;
