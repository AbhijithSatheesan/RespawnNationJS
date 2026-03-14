import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLive } from '../../services/TechBackGround/techBackgroundSlice';

// Importing Images (Assumes you renamed folder to 'images')
import goLiveImg from './images/GoLive.png';
import livesAvailableImg from './images/LivesAvailable.png';
import tournamentLivesImg from './images/TournnamentLives.png';

const LivePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setLive());
  }, [dispatch]);

  const menuOptions = [
    {
      id: 1,
      title: "Start Streaming",
      description: "Setup your key and go live now.",
      image: goLiveImg,
      path: "/live/golive", // Route to your GoLiveDashboard
      color: "from-blue-600 to-cyan-500"
    },
    {
      id: 2,
      title: "Watch Streams",
      description: "Browse active streams and creators.",
      image: livesAvailableImg,
      path: "/live/feed", // Route to your Feed/Search page
      color: "from-purple-600 to-pink-500"
    },
    {
      id: 3,
      title: "Tournaments",
      description: "Watch ongoing competitive events.",
      image: tournamentLivesImg,
      path: "/live/tournaments", // Route to Tournament page
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    // 1. Outer Container: Invisible, full height, flex-centered
    // This ensures the TechBackground behind it is fully visible
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      
      {/* 2. The "Big Card" (Hub) */}
      {/* bg-opacity-90 ensures it pops out but feels connected to the background */}
      <div className="bg-[#121212]/95 border border-gray-700 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-6xl p-8 md:p-12 relative overflow-hidden">
        
        {/* Decorative Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Hub</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Select your destination</p>
        </div>

        {/* 3. The Grid Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuOptions.map((option) => (
            <div 
              key={option.id}
              onClick={() => navigate(option.path)}
              className="group relative cursor-pointer"
            >
              {/* Card Container */}
              <div className="h-full bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                
                {/* Image Area (Top Half) */}
                <div className="h-48 overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-t ${option.color} opacity-20 group-hover:opacity-10 transition-opacity z-10`}></div>
                    <img 
                        src={option.image} 
                        alt={option.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                </div>

                {/* Text Area (Bottom Half) */}
                <div className="p-6 text-center relative z-20">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {option.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        {option.description}
                    </p>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 border-2 border-transparent group-hover:border-white/10 rounded-2xl pointer-events-none`}></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default LivePage;