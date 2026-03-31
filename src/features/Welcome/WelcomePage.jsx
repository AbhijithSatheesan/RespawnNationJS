import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setWelcome } from '../../services/TechBackGround/techBackgroundSlice';

// --- COMPONENTS ---
import WelcomeCard from './Components/WelcomeCard';
import CommunityBar from './Components/CommunityBar';
import LoginModal from '../auth/LoginModal'; // Adjust the import path if needed

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
  
  // State to control the visibility of the login modal
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    dispatch(setWelcome());
  }, [dispatch]);

  const handleHover = (color) => {
    // Dispatch global background color change if needed
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center z-10 text-white font-mono p-4">
      
      {/* --- TOP RIGHT LOGIN BUTTON --- */}
      <div className="absolute top-6 right-6 z-40">
        <button 
          onClick={() => setIsLoginOpen(true)}
          className="px-6 py-2 bg-[#151a28] border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-wider rounded hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Login
        </button>
      </div>

      {/* --- HERO TEXT --- */}
      <div className="text-center mb-10 animate-fade-in-down mt-16 md:mt-0">
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

      {/* --- RENDER MODAL --- */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />

    </div>
  );
};

export default WelcomePage;










// import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setWelcome } from '../../services/TechBackGround/techBackgroundSlice';

// // --- COMPONENTS ---
// import WelcomeCard from './Components/WelcomeCard';
// import CommunityBar from './Components/CommunityBar';

// // --- ASSETS ---
// import browseImg from './assets/BrowseCard.png';
// import liveImg from './assets/LiveCard.png';
// import tournamentImg from './assets/Tournament.png';




// // --- MENU DATA ---
// const MENU_ITEMS = [
//   { 
//     id: 'browse', 
//     title: 'BROWSE GAMES', 
//     desc: 'Access the database', 
//     color: '#06f3ffff', 
//     path: '/browse',
//     image: browseImg
//   },
//   { 
//     id: 'tournament', 
//     title: 'TOURNAMENTS', 
//     desc: 'Competitive Brackets', 
//     color: '#F59E0B', 
//     path: '/tournament',
//     image: tournamentImg
//   },
//   { 
//     id: 'live', 
//     title: 'LIVE STREAMS', 
//     desc: 'Signal Detected', 
//     color: '#EF4444', 
//     path: '/live',
//     image: liveImg
//   }
// ];

// const WelcomePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

  

//   useEffect(() => {
//     dispatch(setWelcome());
//   }, [dispatch]);

//   const handleHover = (color) => {
//     // Dispatch global background color change if needed
//   };

//   return (
//     <div className="relative w-full min-h-screen flex flex-col items-center justify-center z-10 text-white font-mono p-4">
      
//       {/* --- HERO TEXT --- */}
//       <div className="text-center mb-10 animate-fade-in-down">
//         <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter" style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}>
//           RESPAWN<span className="text-red-400">NATION</span>
//         </h1>
//         <div className="flex items-center justify-center gap-4 mt-4 opacity-70">
//             <div className="h-[1px] w-12 bg-white"></div>
//             <p className="tracking-[0.3em] text-xs md:text-sm">COMPETITIVE GAMING TERMINAL</p>
//             <div className="h-[1px] w-12 bg-white"></div>
//         </div>
//       </div>

//       {/* --- MAIN CARD GRID --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-10 max-w-6xl w-full mb-8">
//         {MENU_ITEMS.map((item) => (
//           <WelcomeCard 
//             key={item.id}
//             title={item.title}
//             desc={item.desc}
//             color={item.color}
//             image={item.image}
//             onClick={() => navigate(item.path)}
//             onMouseEnter={() => handleHover(item.color)}
//           />
//         ))}
//       </div>

//       {/* --- COMMUNITY BAR --- */}
//       <CommunityBar 
//         onClick={() => navigate('/community')}
//         onMouseEnter={() => handleHover('#1a2e2e')}
//       />

//     </div>
//   );
// };

// export default WelcomePage;