import React from 'react';

const BrowseShimmer = () => {
  return (
    <div className="bg-[#121212] min-h-screen w-full overflow-x-hidden flex flex-col">
      
      {/* Hero Section Shimmer */}
      <div className="relative w-full h-[65vh] md:h-[80vh] lg:h-[90vh] bg-[#1a1a1c] animate-pulse flex items-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent pointer-events-none" />
        
        <div className="w-full px-6 md:pl-16 lg:pl-24 max-w-3xl mt-12 md:mt-20 relative z-10">
          <div className="h-6 w-24 bg-gray-700/40 rounded-full mb-4"></div>
          <div className="h-12 md:h-20 w-3/4 bg-gray-700/40 rounded-lg mb-4"></div>
          
          <div className="space-y-3 mb-6 md:mb-8 w-full max-w-xl">
            <div className="h-4 w-full bg-gray-700/40 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700/40 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-700/40 rounded"></div>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <div className="h-10 md:h-12 w-32 md:w-40 bg-gray-700/40 rounded"></div>
            <div className="h-10 md:h-12 w-32 md:w-40 bg-gray-700/40 rounded"></div>
          </div>
        </div>
      </div>

      {/* Rows Section Shimmer (Overlapping the hero) */}
      <div className="relative z-20 flex flex-col gap-6 md:gap-10 -mt-16 sm:-mt-24 md:-mt-32 lg:-mt-52 pb-20 w-full overflow-hidden">
        {[1, 2, 3].map((row) => (
          <div key={row} className="pl-4 md:pl-12">
            <div className="h-6 w-40 bg-gray-800/60 rounded mb-4 ml-3 animate-pulse"></div>
            <div className="flex space-x-3 md:space-x-5 overflow-hidden py-2 md:py-4">
              {[1, 2, 3, 4, 5, 6].map((card) => (
                <div
                  key={card}
                  className="w-[140px] md:w-[200px] h-[200px] md:h-[290px] bg-gray-800/60 rounded-lg animate-pulse shrink-0 border border-gray-800/50"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default BrowseShimmer;