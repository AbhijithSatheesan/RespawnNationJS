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

  // Content for the standard image-based cards
  const standardOptions = [
    {
      id: 'watch',
      title: "Watch Streams",
      description: "Browse active streams and creators.",
      image: livesAvailableImg,
      path: "/live/feed", 
      color: "from-purple-600 to-pink-500",
      hoverColor: "group-hover:text-pink-400",
      isDisabled: false
    },
    {
      id: 'tournaments',
      title: "Tournaments",
      description: "Watch ongoing competitive events.",
      image: tournamentLivesImg,
      path: "/live/tournaments", 
      color: "from-orange-500 to-red-500",
      hoverColor: "group-hover:text-orange-400",
      isDisabled: true, // Marked as disabled for construction
      badgeText: "Coming Soon"
    }
  ];

  return (
    <>
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        
        {/* Main Hub Card */}
        <div className="bg-[#0a0f12]/95 border border-gray-800 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-6xl p-8 md:p-12 relative overflow-hidden">
          
          {/* Decorative Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase drop-shadow-lg">
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Hub</span>
            </h1>
            <p className="text-gray-400 mt-3 text-lg font-mono tracking-wide uppercase text-sm">
              Select your destination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* 1 & 2. Standard View Cards */}
            {standardOptions.map((option) => (
              <div 
                key={option.id}
                onClick={() => !option.isDisabled && navigate(option.path)}
                className={`group relative h-full ${option.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`h-full flex flex-col bg-[#0d1317] rounded-2xl border border-gray-800 overflow-hidden transition-all duration-300 ${!option.isDisabled ? 'hover:border-gray-600 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:-translate-y-1' : 'opacity-80'}`}>
                  
                  {/* Under Construction Overlay */}
                  {option.isDisabled && (
                    <div className="absolute inset-0 bg-[#050505]/70 z-30 flex flex-col items-center justify-center backdrop-blur-sm rounded-2xl border border-dashed border-gray-600">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-yellow-500 mb-2 opacity-80">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                       </svg>
                       <span className="bg-yellow-500 text-black font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded shadow-lg shadow-yellow-500/20">
                          {option.badgeText}
                       </span>
                    </div>
                  )}

                  {/* Image Header */}
                  <div className="h-48 overflow-hidden relative shrink-0">
                      <div className={`absolute inset-0 bg-gradient-to-t ${option.color} opacity-20 ${!option.isDisabled ? 'group-hover:opacity-40 transition-opacity duration-500' : ''} z-10`}></div>
                      <img 
                          src={option.image} 
                          alt={option.title} 
                          className={`w-full h-full object-cover ${!option.isDisabled ? 'group-hover:scale-110 transition-transform duration-700 ease-out' : 'grayscale-[50%]'}`}
                      />
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-center text-center relative z-20">
                      <h3 className={`text-2xl font-black text-white mb-2 transition-colors duration-300 ${!option.isDisabled ? option.hoverColor : 'text-gray-500'}`}>
                          {option.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                          {option.description}
                      </p>
                  </div>
                </div>
              </div>
            ))}

            {/* 3. "Go Live" Action Button Card */}
            <div 
              onClick={handleGoLiveClick}
              className="group relative cursor-pointer h-full flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-[#0a0f12] to-[#111820] rounded-2xl border-2 border-dashed border-gray-700 hover:border-cyan-500 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1"
            >
               {/* Pulsing background glow on hover */}
               <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

               {/* Icon */}
               <div className="w-20 h-20 rounded-full bg-black/40 border border-gray-800 flex items-center justify-center mb-6 group-hover:bg-cyan-900/30 group-hover:border-cyan-500/50 transition-all duration-500 shadow-inner group-hover:scale-110">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-10 h-10 text-gray-500 group-hover:text-cyan-400 transition-colors duration-500"
                  >
                    <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
               </div>

               {/* Typography */}
               <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 relative z-10">
                   Start Streaming
               </h3>
               <p className="text-gray-400 text-sm mb-8 relative z-10">
                   Setup your key and start broadcasting instantly.
               </p>

               {/* Button */}
               <button className="relative z-10 px-8 py-3 bg-gray-800 border border-gray-600 group-hover:border-cyan-500 text-white font-black tracking-widest uppercase text-sm rounded-full transition-all duration-300 group-hover:bg-cyan-600 group-hover:shadow-[0_0_20px_rgba(8,145,178,0.5)]">
                   GO LIVE
               </button>
            </div>

          </div>
        </div>
      </div>

      {/* Global Login Modal for unauthenticated users */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  )
}

export default LivePage;