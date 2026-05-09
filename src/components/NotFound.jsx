import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-white font-mono px-4 text-center">
      
      {/* Glitchy Hero Section */}
      <div className="relative mb-8">
        <h1 className="text-8xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-gray-800 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          404
        </h1>
        {/* Absolute positioned overlay for that "cyberpunk" effect */}
        <h1 className="absolute top-1 -left-1 text-8xl md:text-9xl font-black italic tracking-tighter text-cyan-500/50 mix-blend-screen pointer-events-none">
          404
        </h1>
        <h1 className="absolute -top-1 left-1 text-8xl md:text-9xl font-black italic tracking-tighter text-red-500/50 mix-blend-screen pointer-events-none">
          404
        </h1>
      </div>

      <div className="inline-flex items-center gap-3 px-4 py-1 mb-6 border border-red-500/50 rounded bg-red-500/10 backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        <span className="text-xs md:text-sm font-bold tracking-widest text-red-400 uppercase">
          Signal Lost - Connection Terminated
        </span>
      </div>

      <p className="text-gray-400 max-w-md mb-10 text-sm md:text-base leading-relaxed">
        The sector you are trying to access does not exist in our database. It may have been deleted, or you typed the coordinates incorrectly.
      </p>

      {/* Return to Base Button */}
      <button 
        onClick={() => navigate('/')}
        className="group relative px-8 py-3 bg-transparent overflow-hidden rounded border border-cyan-500 transition-all duration-300"
      >
        <div className="absolute inset-0 w-0 bg-cyan-500 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
        <span className="relative text-cyan-400 group-hover:text-black font-black uppercase tracking-widest text-sm transition-colors duration-300 flex items-center gap-2">
          ← Return to Base
        </span>
      </button>

    </div>
  );
};

export default NotFound;