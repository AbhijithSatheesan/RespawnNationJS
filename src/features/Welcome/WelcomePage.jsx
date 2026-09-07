import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setWelcome } from '../../services/TechBackGround/techBackgroundSlice';

import WelcomeCard from './Components/WelcomeCard';
import CommunityBar from './Components/CommunityBar';
import WelcomeSkeleton from './Components/WelcomeSkeleton';
import LoginModal from '../auth/LoginModal';

import browseImg from './assets/BrowseCard.png';
import liveImg from './assets/LiveCard.png';
import tournamentImg from './assets/Tournament.png';
import CommunitySidebar from '../../components/Chat/CommunitySidebar';

const MENU_ITEMS = [
  { 
    id: 'browse', 
    title: 'BROWSE', 
    fullTitle: 'BROWSE GAMES',
    desc: 'Database & Titles', 
    color: '#06f3ff', 
    path: '/browse', 
    image: browseImg,
    badge: 'EXPLORE'
  },
  { 
    id: 'tournament', 
    title: 'TOURNAMENTS', 
    fullTitle: 'TOURNAMENTS',
    desc: 'Competitive Brackets', 
    color: '#F59E0B', 
    path: '/tournament', 
    image: tournamentImg,
    badge: 'LIVE BRACKETS'
  },
  { 
    id: 'live', 
    title: 'STREAMS', 
    fullTitle: 'LIVE STREAMS',
    desc: 'Active Broadcasts', 
    color: '#EF4444', 
    path: '/live', 
    image: liveImg,
    badge: 'SIGNAL ON'
  }
];

const WelcomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const token = useSelector((state) => state.user?.token);

  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    dispatch(setWelcome());
    document.body.style.backgroundColor = "#050505";
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); 

    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleCommunityClick = () => {
    if (token) {
      setIsChatOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center z-10 text-white font-mono p-4 overflow-x-hidden md:p-6 bg-transparent mt-[-4rem] md:mt-0">
      
      {/* SKELETON OVERLAY */}
      {isLoading && (
        <div className="absolute inset-0 z-50">
          <WelcomeSkeleton />
        </div>
      )}

      {/* MAIN CONTAINER */}
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

        {/* 
          NAVIGATION DECK
          - Mobile (< 768px): Compact touch cards with vibrant background images
          - Desktop (>= 768px): Original 3-column WelcomeCard grid
        */}
        <div className="w-full max-w-7xl px-2 md:px-10 mb-6 md:mb-8">
          
          {/* MOBILE VIEW */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="group relative w-full h-24 rounded-xl overflow-hidden bg-neutral-900/90 border border-neutral-800 p-3.5 flex items-center justify-between text-left transition-all active:scale-[0.98] active:border-neutral-600"
                style={{
                  boxShadow: `inset 4px 0 0 ${item.color}`
                }}
              >
                {/* HIGH VISIBILITY BACKGROUND IMAGE */}
                <div 
                  className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center opacity-65 group-hover:opacity-85 transition-opacity"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                
                {/* LIGHT GRADIENT OVERLAY TO MAINTAIN TEXT READABILITY */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-neutral-900 via-neutral-900/60 to-transparent" />

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
                  <h2 className="text-xl font-black italic tracking-tight text-white mt-1 group-hover:text-red-400 transition-colors">
                    {item.fullTitle}
                  </h2>
                  <p className="text-[11px] text-neutral-300 tracking-wide line-clamp-1">
                    {item.desc}
                  </p>
                </div>

                {/* ACTION ARROW */}
                <div 
                  className="relative z-10 w-9 h-9 rounded-lg bg-neutral-950/80 border border-neutral-700/60 flex items-center justify-center text-base group-hover:translate-x-1 transition-transform shadow-lg"
                  style={{ color: item.color }}
                >
                  ➔
                </div>
              </button>
            ))}
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {MENU_ITEMS.map((item) => (
              <WelcomeCard 
                key={item.id}
                title={item.fullTitle}
                desc={item.desc}
                color={item.color}
                image={item.image}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>

        </div>

        {/* COMMUNITY BAR */}
        <div className="w-full max-w-4xl px-2">
          <CommunityBar onClick={handleCommunityClick} />

          <CommunitySidebar
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              roomType='GLOBAL'
          />
          
          <LoginModal 
              isOpen={isLoginModalOpen} 
              onClose={() => setIsLoginModalOpen(false)} 
          />
        </div>

      </div>
    </div>
  );
};

export default WelcomePage;

















// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux'; // Added useSelector
// import { useNavigate } from 'react-router-dom';
// import { setWelcome } from '../../services/TechBackGround/techBackgroundSlice';

// import WelcomeCard from './Components/WelcomeCard';
// import CommunityBar from './Components/CommunityBar';
// import WelcomeSkeleton from './Components/WelcomeSkeleton';
// import LoginModal from '../auth/LoginModal'; // Already imported by you

// import browseImg from './assets/BrowseCard.png';
// import liveImg from './assets/LiveCard.png';
// import tournamentImg from './assets/Tournament.png';
// import CommunitySidebar from '../../components/Chat/CommunitySidebar';

// const MENU_ITEMS = [
//   { id: 'browse', title: 'BROWSE GAMES', desc: 'Access the database', color: '#06f3ffff', path: '/browse', image: browseImg },
//   { id: 'tournament', title: 'TOURNAMENTS', desc: 'Competitive Brackets', color: '#F59E0B', path: '/tournament', image: tournamentImg },
//   { id: 'live', title: 'LIVE STREAMS', desc: 'Signal Detected', color: '#EF4444', path: '/live', image: liveImg }
// ];

// const WelcomePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   // 1. Get the user token from Redux state
//   const token = useSelector((state) => state.user?.token);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isChatOpen, setIsChatOpen] = useState(false);
  
//   // 2. Add state to control the Login Modal
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

//   useEffect(() => {
//     dispatch(setWelcome());
//     document.body.style.backgroundColor = "#050505";
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 600); 

//     return () => clearTimeout(timer);
//   }, [dispatch]);

//   // 3. Create a handler to check auth before opening chat
//   const handleCommunityClick = () => {
//     if (token) {
//       // User is logged in -> Open Chat
//       setIsChatOpen(true);
//     } else {
//       // User is NOT logged in -> Open Login Modal
//       setIsLoginModalOpen(true);
//     }
//   };

//   return (
//     <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center z-10 text-white font-mono p-4 overflow-x-hidden md:p-6 bg-transparent mt-[-4rem] md:mt-0">
      
//       {isLoading && (
//         <div className="absolute inset-0 z-50">
//           <WelcomeSkeleton />
//         </div>
//       )}

//       <div className={`flex flex-col items-center justify-center w-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
//         {/* HERO TEXT */}
//         <div className="text-center mb-6 md:mb-10 animate-fade-in-down mt-12 md:mt-0">
//           <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter">
//             RESPAWN<span className="text-red-400">NATION</span>
//           </h1>
//           <div className="flex items-center justify-center gap-2 md:gap-4 mt-2 md:mt-4 opacity-70">
//               <div className="h-[1px] w-6 md:w-12 bg-white"></div>
//               <p className="tracking-[0.2em] text-[10px] md:text-sm">COMPETITIVE GAMING TERMINAL</p>
//               <div className="h-[1px] w-6 md:w-12 bg-white"></div>
//           </div>
//         </div>

//         {/* MAIN CARD GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-10 max-w-7xl w-full mb-6 md:mb-8">
//           {MENU_ITEMS.map((item) => (
//             <WelcomeCard 
//               key={item.id}
//               title={item.title}
//               desc={item.desc}
//               color={item.color}
//               image={item.image}
//               onClick={() => navigate(item.path)}
//             />
//           ))}
//         </div>

//         {/* COMMUNITY BAR */}
//         <div className="w-full max-w-4xl px-2">
//           {/* 4. Use the new handler here instead of setting chat state directly */}
//           <CommunityBar onClick={handleCommunityClick} />

//           {/* 5. Render both modals, controlled by their respective states */}
//           <CommunitySidebar
//               isOpen={isChatOpen}
//               onClose={() => setIsChatOpen(false)}
//               roomType='GLOBAL'
//           />
          
//           <LoginModal 
//               isOpen={isLoginModalOpen} 
//               onClose={() => setIsLoginModalOpen(false)} 
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomePage;
