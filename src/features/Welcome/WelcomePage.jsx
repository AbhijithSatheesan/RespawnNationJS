import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setWelcome } from '../../services/TechBackGround/techBackgroundSlice';

// --- COMPONENTS ---
import WelcomeCard from './Components/WelcomeCard';
import CommunityBar from './Components/CommunityBar';

// --- ASSETS ---
import browseImg from './assets/BrowseCard.png';
import liveImg from './assets/LiveCard.png';
import tournamentImg from './assets/Tournament.png';




// --- MENU DATA ---
const MENU_ITEMS = [
  { 
    id: 'browse', 
    title: 'BROWSE GAMES', 
    desc: 'Access the database', 
    color: '#06f3ffff', 
    path: '/browse',
    image: browseImg
  },
  { 
    id: 'tournament', 
    title: 'TOURNAMENTS', 
    desc: 'Competitive Brackets', 
    color: '#F59E0B', 
    path: '/tournament',
    image: tournamentImg
  },
  { 
    id: 'live', 
    title: 'LIVE STREAMS', 
    desc: 'Signal Detected', 
    color: '#EF4444', 
    path: '/live',
    image: liveImg
  }
];

const WelcomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  useEffect(() => {
    dispatch(setWelcome());
  }, [dispatch]);

  const handleHover = (color) => {
    // Dispatch global background color change if needed
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center z-10 text-white font-mono p-4">
      
      {/* --- HERO TEXT --- */}
      <div className="text-center mb-10 animate-fade-in-down">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter" style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}>
          RESPAWN<span className="text-red-400">NATION</span>
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4 opacity-70">
            <div className="h-[1px] w-12 bg-white"></div>
            <p className="tracking-[0.3em] text-xs md:text-sm">COMPETITIVE GAMING TERMINAL</p>
            <div className="h-[1px] w-12 bg-white"></div>
        </div>
      </div>

      {/* --- MAIN CARD GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-10 max-w-6xl w-full mb-8">
        {MENU_ITEMS.map((item) => (
          <WelcomeCard 
            key={item.id}
            title={item.title}
            desc={item.desc}
            color={item.color}
            image={item.image}
            onClick={() => navigate(item.path)}
            onMouseEnter={() => handleHover(item.color)}
          />
        ))}
      </div>

      {/* --- COMMUNITY BAR --- */}
      <CommunityBar 
        onClick={() => navigate('/community')}
        onMouseEnter={() => handleHover('#1a2e2e')}
      />

    </div>
  );
};

export default WelcomePage;