import React from 'react';

const TournamentDashboardShimmer = () => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Grid matching TournamentDashboard layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="flex flex-col items-center bg-transparent w-full shrink-0">
            
            {/* Ticket Card Container (150px mobile / 180px desktop) */}
            <div className="relative w-full h-[150px] md:h-[180px] bg-[#0d1317] border border-gray-800/80 rounded-lg overflow-hidden flex">
              
              {/* Left Ticket Stub (Matching TournamentCard w-12 / w-16) */}
              <div className="w-12 md:w-16 bg-[#05080a] border-r border-gray-800/50 flex flex-col justify-end items-center pb-8 pt-3 relative z-20 shrink-0">
                {/* Vertical Text Skeleton Placeholder */}
                <div className="w-2 h-16 bg-neutral-800/60 rounded animate-pulse" />
                
                {/* Circular Ticket Notches */}
                <div className="absolute top-3 -left-2.5 w-5 h-5 bg-black rounded-full"></div>
                <div className="absolute bottom-3 -left-2.5 w-5 h-5 bg-black rounded-full"></div>
              </div>

              {/* Main Ticket Body */}
              <div className="flex-1 relative p-4 md:p-6 flex flex-col justify-between overflow-hidden bg-neutral-900/40">
                
                {/* Top Badge Placeholder */}
                <div className="flex justify-between items-center z-10">
                  <div className="h-3.5 w-16 bg-neutral-800 rounded animate-pulse" />
                  <div className="h-3.5 w-10 bg-neutral-800/70 rounded animate-pulse" />
                </div>

                {/* Bottom Title & Details Placeholder */}
                <div className="relative z-10 mt-auto space-y-2">
                  <div className="h-4 md:h-5 w-5/6 bg-neutral-800/90 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-neutral-800/60 rounded animate-pulse" />
                </div>

                {/* Shimmer Sweep Animation */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Bottom "Flip Ticket" Button Placeholder */}
            <div className="mt-4 h-8 md:h-9 w-28 md:w-32 bg-[#0a0f12] border border-gray-800/70 rounded-full animate-pulse shrink-0" />

          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentDashboardShimmer;