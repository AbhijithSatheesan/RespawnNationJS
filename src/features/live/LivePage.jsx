import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLive } from '../../services/TechBackGround/techBackgroundSlice';
import LoginModal from '../auth/LoginModal';

// Importing Images
import livesAvailableImg from './images/LivesAvailable.png';
import tournamentLivesImg from './images/TournnamentLives.png';

const LivePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Grab user info from Redux to verify authentication status
  const { userInfo } = useSelector((state) => state.user);
  
  // State to control the Login Modal visibility
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    dispatch(setLive());
  }, [dispatch]);

  // Handles the "Go Live" action, enforcing login requirements
  const handleGoLiveClick = () => {
    if (!userInfo) {
      setIsLoginModalOpen(true);
    } else {
      navigate('/live/golive');
    }
  };

  const LIVE_ITEMS = [
    {
      id: 'watch',
      title: 'WATCH STREAMS',
      desc: 'Browse active streams & creators',
      color: '#06f3ff',
      path: '/live/feed',
      image: livesAvailableImg,
      badge: 'LIVE FEED',
      isDisabled: false,
      onClick: () => navigate('/live/feed')
    },
    {
      id: 'tournaments',
      title: 'TOURNAMENTS',
      desc: 'Watch ongoing competitive events',
      color: '#F59E0B',
      path: '/live/tournaments',
      image: tournamentLivesImg,
      badge: 'COMING SOON',
      isDisabled: true,
      onClick: () => {}
    },
    {
      id: 'golive',
      title: 'START STREAMING',
      desc: 'Setup key & broadcast live',
      color: '#3B82F6',
      path: '#',
      image: livesAvailableImg,
      badge: 'BROADCAST',
      isDisabled: false,
      onClick: handleGoLiveClick
    }
  ];

  return (
    <>
      <div className="min-h-[85vh] flex items-center justify-center p-3 sm:p-6 md:p-8 relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Main Hub Container */}
        <div className="bg-[#0a0d14]/90 border border-neutral-800 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-6xl p-4 sm:p-8 md:p-12 relative overflow-hidden z-10">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black italic text-white tracking-tight uppercase">
              LIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">HUB</span>
            </h1>
            <p className="text-neutral-400 mt-1 text-xs sm:text-sm font-mono tracking-widest uppercase">
              SELECT YOUR DESTINATION
            </p>
          </div>

          {/* ========================================================= */}
          {/* MOBILE VIEW (< 768px): Welcome Page Horizontal Card Style */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {LIVE_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                disabled={item.isDisabled}
                className={`group relative w-full h-24 rounded-xl overflow-hidden bg-neutral-900/90 border border-neutral-800 p-3.5 flex items-center justify-between text-left transition-all ${
                  item.isDisabled 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'active:scale-[0.98] active:border-neutral-600 cursor-pointer'
                }`}
                style={{
                  boxShadow: `inset 4px 0 0 ${item.color}`
                }}
              >
                {/* HIGH VISIBILITY BACKGROUND IMAGE */}
                <div 
                  className={`absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center transition-opacity ${
                    item.isDisabled ? 'opacity-30 grayscale' : 'opacity-60 group-hover:opacity-80'
                  }`}
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                
                {/* GRADIENT OVERLAY FOR TEXT READABILITY */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-neutral-900 via-neutral-900/70 to-transparent" />

                {/* TEXT CONTENT */}
                <div className="relative z-10 flex flex-col justify-center max-w-[65%]">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded uppercase bg-neutral-950/90"
                      style={{ color: item.color }}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <h2 className="text-lg font-black italic tracking-tight text-white mt-1 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-[11px] text-neutral-300 tracking-wide line-clamp-1">
                    {item.desc}
                  </p>
                </div>

                {/* ACTION ARROW / LOCK ICON */}
                <div 
                  className="relative z-10 w-9 h-9 rounded-lg bg-neutral-950/80 border border-neutral-700/60 flex items-center justify-center text-base group-hover:translate-x-1 transition-transform shadow-lg"
                  style={{ color: item.color }}
                >
                  {item.isDisabled ? '🔒' : '➔'}
                </div>
              </button>
            ))}
          </div>

          {/* ========================================================= */}
          {/* DESKTOP VIEW (>= 768px): Original 3-Column Grid Layout  */}
          {/* ========================================================= */}
          <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8">
            
            {/* 1. Watch Streams */}
            <div 
              onClick={() => navigate('/live/feed')}
              className="group relative cursor-pointer h-full flex flex-col bg-[#050811] rounded-2xl border border-neutral-800 overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity z-10" />
                <img src={livesAvailableImg} alt="Watch Streams" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between text-center relative z-20">
                <div>
                  <h3 className="text-2xl font-black italic text-white mb-2 group-hover:text-cyan-400 transition-colors">WATCH STREAMS</h3>
                  <p className="text-neutral-400 text-xs leading-relaxed">Browse active streams and creators in real-time.</p>
                </div>
                <button className="w-full mt-6 py-2.5 bg-neutral-900 border border-neutral-700 group-hover:border-cyan-500 text-cyan-400 font-bold uppercase text-xs rounded-lg transition-all">
                  ENTER FEED
                </button>
              </div>
            </div>

            {/* 2. Tournaments */}
            <div className="group relative h-full flex flex-col bg-[#050811] rounded-2xl border border-neutral-800 overflow-hidden opacity-75 cursor-not-allowed">
              <div className="absolute inset-0 bg-[#050811]/80 z-30 flex flex-col items-center justify-center backdrop-blur-sm">
                <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black uppercase text-[10px] px-4 py-1.5 rounded-full">
                  COMING SOON
                </span>
              </div>
              <div className="h-48 overflow-hidden relative shrink-0">
                <img src={tournamentLivesImg} alt="Tournaments" className="w-full h-full object-cover grayscale" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between text-center">
                <div>
                  <h3 className="text-2xl font-black italic text-neutral-400 mb-2">TOURNAMENTS</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">Watch ongoing competitive esports events.</p>
                </div>
              </div>
            </div>

            {/* 3. Go Live */}
            <div 
              onClick={handleGoLiveClick}
              className="group relative cursor-pointer h-full flex flex-col justify-between items-center text-center p-6 bg-[#050811] rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:-translate-y-1"
            >
              <div className="flex flex-col items-center my-auto relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-all">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black italic text-white mb-2 group-hover:text-cyan-400 transition-colors">START STREAMING</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">Broadcast instantly to your audience.</p>
              </div>
              <button className="w-full mt-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black uppercase text-xs rounded-lg shadow-md hover:brightness-110 transition-all">
                GO LIVE NOW
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Global Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default LivePage;