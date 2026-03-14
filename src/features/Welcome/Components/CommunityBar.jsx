import React from 'react';

// --- INTERNAL ICONS ---
const UsersIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

const CommunityBar = ({ onClick, onMouseEnter }) => {
  const accentColor = '#10B981'; // Using a brighter Emerald/Teal for high contrast

  return (
    <div 
      onClick={onClick}
      className="relative group w-full max-w-4xl cursor-pointer mt-8" // Added margin top for spacing
      onMouseEnter={onMouseEnter}
    >
      {/* 1. BACKING GLOW (Pulsing) */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-700" />

      {/* 2. MAIN CONTAINER */}
      <div className="relative flex items-center justify-between p-1 overflow-hidden rounded-lg bg-[#050505] border border-white/5 group-hover:border-emerald-500/50 transition-colors duration-500">
          
          {/* 3. ANIMATED SCANNER BACKGROUND */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
            style={{
                backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)`,
                backgroundSize: '4px 4px'
            }}
          />
          
          {/* 4. INNER CONTENT BOX */}
          <div className="relative flex items-center justify-between w-full p-6 bg-[#0a0f11] rounded-md z-10">
              
              {/* LEFT SIDE: Icon & Text */}
              <div className="flex items-center gap-6">
                  {/* Hexagon Icon Wrapper */}
                  <div className="relative flex items-center justify-center w-14 h-14">
                      {/* Spinning Ring */}
                      <div className="absolute inset-0 border-2 border-dashed border-gray-700 rounded-full group-hover:border-emerald-500/50 group-hover:animate-spin-slow transition-colors duration-700" />
                      <UsersIcon className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 transition-colors duration-300" />
                  </div>

                  <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black italic tracking-widest text-white group-hover:text-emerald-400 transition-colors duration-300">
                            COMMUNITY HUB
                        </h3>
                        {/* Status Dot */}
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      </div>
                      <p className="text-xs font-mono text-gray-500 group-hover:text-gray-300">
                          // CONNECT_TO_NETWORK [1,240 ONLINE]
                      </p>
                  </div>
              </div>

              {/* RIGHT SIDE: Action Button Style */}
              <div className="flex items-center gap-4">
                  <div className="hidden md:flex flex-col items-end text-[10px] font-mono text-gray-600 group-hover:text-emerald-500/70 transition-colors">
                      <span>SYS.VER.4.0</span>
                      <span>ACCESS: GRANTED</span>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded group-hover:bg-emerald-500/20 group-hover:translate-x-1 transition-all duration-300">
                      <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </div>
              </div>
          </div>

          {/* 5. DECORATIVE CORNER BRACKETS */}
          {/* Top Left */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-700 group-hover:border-emerald-400 transition-colors duration-500 rounded-tl-lg" />
          {/* Bottom Right */}
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-700 group-hover:border-emerald-400 transition-colors duration-500 rounded-br-lg" />

      </div>
    </div>
  );
};

export default CommunityBar;