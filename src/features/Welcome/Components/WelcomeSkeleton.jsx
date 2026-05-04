import React from 'react';

const WelcomeSkeleton = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-[#050505] overflow-hidden">
      {/* Hero Text Skeleton */}
      <div className="text-center mb-10 mt-12 md:mt-0">
        <div className="h-12 md:h-20 w-64 md:w-[500px] bg-white/5 rounded-lg mx-auto animate-pulse" />
        <div className="h-3 w-40 bg-white/5 rounded mt-4 mx-auto animate-pulse" />
      </div>

      {/* Card Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-10 max-w-7xl w-full mb-8">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="relative h-48 sm:h-60 md:h-80 lg:h-96 bg-white/5 overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}
          >
            {/* The Shimmering Light Effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        ))}
      </div>

      {/* Community Bar Skeleton */}
      <div className="w-full max-w-4xl h-20 bg-white/5 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
};

export default WelcomeSkeleton;