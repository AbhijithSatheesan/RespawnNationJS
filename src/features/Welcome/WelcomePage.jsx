import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setWelcome } from '../../services/TechBackGround/techBackgroundSlice';

import WelcomeCard from './Components/WelcomeCard';
import CommunityBar from './Components/CommunityBar';
import WelcomeSkeleton from './Components/WelcomeSkeleton';

import browseImg from './assets/BrowseCard.png';
import liveImg from './assets/LiveCard.png';
import tournamentImg from './assets/Tournament.png';

const MENU_ITEMS = [
  { id: 'browse', title: 'BROWSE GAMES', desc: 'Access the database', color: '#06f3ffff', path: '/browse', image: browseImg },
  { id: 'tournament', title: 'TOURNAMENTS', desc: 'Competitive Brackets', color: '#F59E0B', path: '/tournament', image: tournamentImg },
  { id: 'live', title: 'LIVE STREAMS', desc: 'Signal Detected', color: '#EF4444', path: '/live', image: liveImg }
];

const WelcomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(setWelcome());
    document.body.style.backgroundColor = "#050505";
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); 

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center z-10 text-white font-mono p-4 overflow-x-hidden md:p-6 bg-transparent mt-[-4rem] md:mt-0">
      
      {isLoading && (
        <div className="absolute inset-0 z-50">
          <WelcomeSkeleton />
        </div>
      )}

      <div className={`flex flex-col items-center justify-center w-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* HERO TEXT */}
        <div className="text-center mb-6 md:mb-10 animate-fade-in-down mt-12 md:mt-0">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter">
            RESPAWN<span className="text-red-400">NATION</span>
          </h1>
          <div className="flex items-center justify-center gap-2 md:gap-4 mt-2 md:mt-4 opacity-70">
              <div className="h-[1px] w-6 md:w-12 bg-white"></div>
              <p className="tracking-[0.2em] text-[10px] md:text-sm">COMPETITIVE GAMING TERMINAL</p>
              <div className="h-[1px] w-6 md:w-12 bg-white"></div>
          </div>
        </div>

        {/* MAIN CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-10 max-w-7xl w-full mb-6 md:mb-8">
          {MENU_ITEMS.map((item) => (
            <WelcomeCard 
              key={item.id}
              title={item.title}
              desc={item.desc}
              color={item.color}
              image={item.image}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        {/* COMMUNITY BAR */}
        <div className="w-full max-w-4xl px-2">
          <CommunityBar onClick={() => navigate('/community')} />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;




