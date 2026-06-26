import React from 'react';

const BrowseShimmer = () => {
  return (
    <div className="bg-[#121212] min-h-screen w-full overflow-x-hidden flex flex-col">
      
      {/* 1. Hero / Trailer Section Shimmer */}
      <div className="relative w-full h-[65vh] md:h-[80vh] lg:h-[90vh] bg-[#1a1a1c] animate-pulse flex items-center">
        {/* Gradients matching the Trailer component */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/70 via-[#121212]/30 to-transparent w-full md:w-[60%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-[#121212]/10 to-transparent" />
        
        {/* Content Block mimicking the Trailer text */}
        <div className="absolute inset-0 flex flex-col justify-end md:justify-center pb-8 sm:pb-12 md:pb-0 pt-20 z-10">
          <div className="w-full px-4 sm:px-6 md:pl-16 lg:pl-24 max-w-3xl">
            {/* Tag */}
            <div className="h-6 w-24 bg-gray-700/40 rounded-full mb-3 md:mb-5"></div>
            {/* Title */}
            <div className="h-12 md:h-20 w-3/4 bg-gray-700/40 rounded-lg mb-4 md:mb-6"></div>
            {/* Buttons */}
            <div className="flex flex-wrap gap-2.5 md:gap-4">
              <div className="h-10 md:h-12 w-32 md:w-40 bg-gray-700/40 rounded"></div>
              <div className="h-10 md:h-12 w-32 md:w-40 bg-gray-700/40 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Rows Container (Overlapping the hero via exact negative margins) */}
      <div className="relative z-20 flex flex-col gap-6 md:gap-10 -mt-16 sm:-mt-24 md:-mt-32 lg:-mt-52 pb-20 w-full overflow-hidden">
        
        {/* ROW 1: Large Row (Mimics "Trending Now" isLargeRow={true}) */}
        <div className="mb-4 md:mb-8 pl-4 md:pl-12">
          {/* Title Placeholder */}
          <div className="h-6 md:h-8 w-48 bg-gray-800/60 rounded mb-3 md:mb-4 ml-3 animate-pulse border-l-4 border-gray-700"></div>
          
          {/* Large Cards */}
          <div className="flex space-x-3 md:space-x-5 overflow-hidden py-2 md:py-4">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div
                key={`large-${card}`}
                // Using exact dimensions from GameCard where isLarge=true
                className="w-[160px] md:w-[260px] h-[240px] md:h-[380px] bg-gray-800/50 rounded-lg animate-pulse shrink-0 border border-gray-800/50"
              ></div>
            ))}
          </div>
        </div>

        {/* ROW 2 & 3: Standard Rows (Mimics "Top Rated" and standard Categories) */}
        {[1, 2].map((row) => (
          <div key={`normal-row-${row}`} className="mb-4 md:mb-8 pl-4 md:pl-12">
            {/* Title Placeholder */}
            <div className="h-6 md:h-8 w-40 bg-gray-800/60 rounded mb-3 md:mb-4 ml-3 animate-pulse border-l-4 border-gray-700"></div>
            
            {/* Normal Cards */}
            <div className="flex space-x-3 md:space-x-5 overflow-hidden py-2 md:py-4">
              {[1, 2, 3, 4, 5, 6, 7].map((card) => (
                <div
                  key={`normal-${row}-${card}`}
                  // Using exact dimensions from GameCard where isLarge=false
                  className="w-[140px] md:w-[200px] h-[200px] md:h-[290px] bg-gray-800/50 rounded-lg animate-pulse shrink-0 border border-gray-800/50"
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