import React from 'react';

const WelcomeCard = ({ title, desc, color, image, onClick, onMouseEnter }) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="group relative cursor-pointer transition-all duration-300 hover:-translate-y-2 h-72 md:h-80 lg:h-96"
    >
      {/* HOVER GLOW */}
          <div 
        className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl" 
        style={{ backgroundColor: color }} 
      />

      {/* CARD CONTAINER */}
      <div 
        className="relative h-full flex flex-col justify-end border border-white/10 bg-black/80 overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)' }}
      >
        {/* --- A. BACKGROUND IMAGE --- */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-50"
          style={{ backgroundImage: `url(${image})` }}
        />
        
        {/* --- B. GRADIENT OVERLAY --- */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* --- C. TOP BORDER ACCENT --- */}
        <div 
          className="absolute top-0 left-0 w-full h-[2px] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10"
          style={{ backgroundColor: color }} 
        />

        {/* --- D. CONTENT --- */}
        <div className="relative z-10 p-6">
          <h3 className="text-2xl font-black italic uppercase mb-1 tracking-tight text-white transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            {title}
          </h3>

          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase group-hover:text-white transition-colors">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;