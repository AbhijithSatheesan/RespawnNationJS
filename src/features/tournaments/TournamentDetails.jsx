import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { TOURNAMENT_DETAILS } from '../../services/apiRoutes';

import WorldCupFormat from './components/WorldCupFormat';
import BattleRoyaleFormat from './components/BattleRoyaleFormat';
import JoinTournamentModal from './components/JoinTournamentModal';
import LoginModal from '../auth/LoginModal';
import CommunityBar from '../Welcome/Components/CommunityBar';
import CommunitySidebar from '../../components/Chat/CommunitySidebar';

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the lightweight data passed from the Card
  const passedTournamentData = location.state?.tournamentData;
  
  const { userInfo, token } = useSelector((state) => state.user);
  
  // 1. Initialize state with card data for instant top-half load
  const [tournament, setTournament] = useState(passedTournamentData || null);
  
  // 2. MAIN page loader (only shows if no card data exists, like on a hard refresh)
  const [isPageLoading, setIsPageLoading] = useState(!passedTournamentData);
  
  // 3. SECONDARY loader specifically for the heavy bracket/standings data
  const [isFetchingBrackets, setIsFetchingBrackets] = useState(true);
  
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // ALWAYS fetch the full details in the background to get engine_code and brackets
    const fetchDetails = async () => {
      try {
        const response = await api.get(TOURNAMENT_DETAILS(id));
        
        // SMART MERGE: Protect the is_registered state!
        // If the card already knew we were registered, don't let the API overwrite it to false
        setTournament(prev => {
          const wasRegistered = prev?.is_registered === true;
          return {
            ...response.data,
            is_registered: wasRegistered ? true : response.data.is_registered
          };
        });

      } catch (error) {
        console.error("Error fetching full tournament details:", error);
      } finally {
        setIsPageLoading(false);
        setIsFetchingBrackets(false); // Turn off the secondary spinner
      }
    };
    
    fetchDetails();
  }, [id]);

  const handleJoinClick = () => {
    if (!token && !userInfo) {
      setIsLoginModalOpen(true);
    } else {
      setIsJoinModalOpen(true);
    }
  };

  const handleCommunityClick = () => {
    setIsChatOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsJoinModalOpen(false);
    window.location.reload(); 
  };

  // If hard-refreshed, show the full screen loader
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
      </div>
    );
  }

  if (!tournament) return <div className="text-white text-center mt-20">Tournament not found.</div>;

  const isRegistered = tournament.is_registered || false;

  const progressPct = tournament.max_players > 0 
    ? Math.min((tournament.current_participants / tournament.max_players) * 100, 100) 
    : 0;

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono pt-24 px-4 sm:px-8 lg:px-16 pb-20 overflow-x-hidden">
      
      {/* GLOBAL HEADER */}
      <div className="mb-8 border-b border-gray-800 pb-8">
        <button onClick={() => navigate(-1)} className="text-cyan-500 hover:text-cyan-400 mb-6 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          ← Back to Dashboard
        </button>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          {/* Left Side: Title and Status */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-cyan-900/30 text-cyan-400 px-3 py-1 border border-cyan-800/50 text-[10px] font-black uppercase tracking-widest shadow-md">
                {tournament.game_name}
              </span>
              <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 px-2 py-1 border border-gray-700/50 bg-black/60 shadow-md">
                {tournament.status === 'REGISTRATION' && <span className="text-green-500">● Open</span>}
                {tournament.status === 'GENERATING' && <span className="text-yellow-500">Building</span>}
                {tournament.status === 'LIVE' && <span className="text-red-500 animate-pulse">● Live</span>}
                {tournament.status === 'COMPLETED' && <span className="text-gray-500">Completed</span>}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,1)] mb-6">
              {tournament.title}
            </h1>

            {/* Tournament Format & Description */}
            <div className="mb-6 max-w-2xl bg-black/20 p-4 rounded border border-gray-800/50">
              <h3 className="text-cyan-400 font-black text-sm uppercase tracking-widest border-l-2 border-cyan-500 pl-3 mb-2 drop-shadow-md">
                {tournament.type_name || "Standard Format"}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed drop-shadow-md">
                {tournament.type_description || "Standard competitive tournament ruleset."}
              </p>
            </div>
          </div>

          {/* Right Side: Stats & Action Card */}
          <div className="w-full lg:w-96 bg-[#0a0f12] border border-gray-800 p-6 shadow-xl flex-shrink-0">
            <div className="flex justify-between items-end mb-4 bg-black/40 p-3 rounded border border-gray-800/50">
              <div>
                <span className="text-[10px] uppercase text-gray-400 font-bold block mb-0.5 tracking-widest">Prize Pool</span>
                <span className="text-2xl font-black text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]">
                  ₹{Number(tournament.current_prize_pool || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-gray-400 font-bold block mb-0.5 tracking-widest">Entry Fee</span>
                <span className="text-lg font-bold text-white">
                  {/* FIX: Properly parsing the Entry Fee to prevent "Free" showing incorrectly */}
                  {Number(tournament.entry_fee) > 0 ? (
                    `₹${Number(tournament.entry_fee).toLocaleString('en-IN')}`
                  ) : (
                    <span className="text-yellow-400 tracking-widest uppercase">Free</span>
                  )}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-[10px] uppercase text-gray-300 font-bold mb-2 drop-shadow-md">
                <span>Slots Filled</span>
                <span className="text-white"><span className="text-cyan-400">{tournament.current_participants}</span> / {tournament.max_players}</span>
              </div>
              <div className="w-full bg-gray-900/80 border border-gray-800 h-2 mb-2">
                <div className="bg-cyan-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(8,145,178,0.8)]" style={{ width: `${progressPct}%` }}></div>
              </div>
              <div className="text-[10px] text-gray-400 font-mono uppercase font-bold drop-shadow-md">
                Starts: <span className="text-gray-200">{formatDate(tournament.registration_deadline)}</span>
              </div>
            </div>

            <button 
              onClick={isRegistered || progressPct >= 100 ? null : handleJoinClick}
              disabled={
                (isRegistered || progressPct >= 100) && tournament.status === 'REGISTRATION' || 
                tournament.status !== 'REGISTRATION' 
              }
              className={`w-full py-4 font-black uppercase tracking-widest text-sm rounded transition-all shadow-lg ${
                isRegistered && tournament.status === 'REGISTRATION' 
                  ? 'bg-gray-800 text-green-500 border border-green-500/30 cursor-not-allowed shadow-[0_0_10px_rgba(34,197,94,0.2)]' :
                progressPct >= 100 && tournament.status === 'REGISTRATION'
                  ? 'bg-gray-800 text-red-500 border border-red-500/30 cursor-not-allowed' :
                tournament.status === 'REGISTRATION' 
                  ? 'bg-cyan-600 border border-cyan-500 text-white hover:bg-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.4)]' :
                tournament.status === 'GENERATING' 
                  ? 'bg-black/50 text-yellow-500 border border-yellow-500/50 cursor-default' :
                tournament.status === 'LIVE' 
                  ? 'bg-black/50 text-red-500 border border-red-500/50 cursor-default' :
                'bg-gray-800/80 text-gray-300 border border-gray-600 cursor-default'
            }`}>
              {tournament.status === 'REGISTRATION' && isRegistered ? 'Joined ✓' :
               tournament.status === 'REGISTRATION' && progressPct >= 100 ? 'FULL' :
               tournament.status === 'REGISTRATION' ? 'Join Now' :
               tournament.status === 'GENERATING' ? 'Brackets' :
               tournament.status === 'LIVE' ? 'Standings' :
               'Results'}
            </button>
          </div>
        </div>
      </div>

      {/* CONDITIONAL CHAT BAR */}
      {token && (isRegistered || userInfo?.is_admin ) && (
        <div className="w-full max-w-4xl mx-auto mb-10">
          <CommunityBar onClick={handleCommunityClick} />
        </div>
      )}

      {/* DYNAMIC FORMAT ROUTER: Brackets, Standings, and Results */}
      <div className="mt-12 w-full max-w-7xl mx-auto min-h-[300px]">
        {isFetchingBrackets ? (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-800/50 rounded-lg bg-black/20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">
              Decypting Standings...
            </p>
          </div>
        ) : (
          <>
            {tournament.engine_code === 'world_cup' && <WorldCupFormat tournament={tournament} />}
            {tournament.engine_code === 'battle_royale' && <BattleRoyaleFormat tournament={tournament} />}
            
            {tournament.engine_code !== 'world_cup' && tournament.engine_code !== 'battle_royale' && (
              <div className="py-12 text-center border border-dashed border-gray-800 rounded-lg max-w-4xl mx-auto bg-black/30">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Standings layout pending for {tournament.engine_code}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      {isJoinModalOpen && (
        <JoinTournamentModal 
          tournamentId={tournament.id}
          tournamentTitle={tournament.title}
          entryFee={tournament.entry_fee}
          onClose={() => setIsJoinModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <CommunitySidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        roomType='TOURNAMENT'            
        contextId={tournament.id}        
      />

    </div>
  );
};

export default TournamentDetails;