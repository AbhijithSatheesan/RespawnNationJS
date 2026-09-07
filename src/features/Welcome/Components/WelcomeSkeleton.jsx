import React from 'react';

const WelcomeSkeleton = () => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 md:p-6 bg-[#050505] overflow-x-hidden text-white font-mono mt-[-4rem] md:mt-0">
      
      {/* HERO TEXT SKELETON */}
      <div className="text-center mb-6 md:mb-10 mt-12 md:mt-0 flex flex-col items-center">
        {/* Title skeleton */}
        <div className="h-10 sm:h-14 md:h-20 w-64 sm:w-96 md:w-[540px] bg-neutral-800/60 rounded-xl animate-pulse" />
        
        {/* Subtitle skeleton with side lines */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mt-3 md:mt-5 opacity-50">
          <div className="h-[1px] w-6 md:w-12 bg-neutral-700" />
          <div className="h-3 w-40 md:w-56 bg-neutral-800/80 rounded animate-pulse" />
          <div className="h-[1px] w-6 md:w-12 bg-neutral-700" />
        </div>
      </div>

      {/* NAVIGATION DECK SKELETON */}
      <div className="w-full max-w-7xl px-2 md:px-10 mb-6 md:mb-8">
        
        {/* MOBILE VIEW SKELETON (< 768px): Horizontal cards matching h-24 */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="relative w-full h-24 rounded-xl overflow-hidden bg-neutral-900/90 border border-neutral-800/80 p-3.5 flex items-center justify-between"
            >
              {/* Text content placeholders */}
              <div className="flex flex-col justify-center space-y-2 w-1/2">
                <div className="h-2.5 w-16 bg-neutral-800 rounded animate-pulse" />
                <div className="h-5 w-32 bg-neutral-800/90 rounded animate-pulse" />
                <div className="h-2 w-24 bg-neutral-800/60 rounded animate-pulse" />
              </div>

              {/* Arrow button placeholder */}
              <div className="w-9 h-9 rounded-lg bg-neutral-800/80 border border-neutral-700/50 animate-pulse" />

              {/* Ambient Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW SKELETON (>= 768px): 3-Column Grid matching WelcomeCards */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="relative h-60 md:h-80 lg:h-96 bg-neutral-900/80 rounded-2xl border border-neutral-800/80 overflow-hidden"
            >
              {/* Image area placeholder */}
              <div className="h-2/3 bg-neutral-800/40 w-full" />
              
              {/* Content area placeholder */}
              <div className="p-4 flex flex-col justify-end h-1/3 space-y-2">
                <div className="h-3 w-20 bg-neutral-800 rounded animate-pulse" />
                <div className="h-6 w-36 bg-neutral-800/90 rounded animate-pulse" />
                <div className="h-2.5 w-28 bg-neutral-800/60 rounded animate-pulse" />
              </div>

              {/* Ambient Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
          ))}
        </div>

      </div>

      {/* COMMUNITY BAR SKELETON */}
      <div className="w-full max-w-4xl px-2">
        <div className="w-full h-16 md:h-20 bg-neutral-900/80 border border-neutral-800/80 rounded-xl relative overflow-hidden flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse" />
              <div className="h-2.5 w-24 bg-neutral-800/60 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-24 bg-neutral-800/80 rounded-lg animate-pulse" />

          {/* Ambient Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </div>

    </div>
  );
};

export default WelcomeSkeleton;