import React from 'react';

const TrailerModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;

  // Helper inside the component
  const getEmbedUrl = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl aspect-video mt-10 md:mt-0">
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-gray-400 hover:text-cyan-400 font-black tracking-widest text-sm uppercase transition-colors"
        >
          Close ✕
        </button>
        
        <div className="w-full h-full bg-black border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,1)] rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={getEmbedUrl(trailerUrl)}
            title="Game Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;















// import React from 'react';

// const TrailerModal = ({ trailerUrl, onClose }) => {
//   if (!trailerUrl) return null;

//   // Helper inside the component
//   const getEmbedUrl = (url) => {
//     const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1];
//     return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
//       <div className="relative w-full max-w-5xl aspect-video mt-10 md:mt-0">
//         <button 
//           onClick={onClose}
//           className="absolute -top-10 right-0 text-gray-400 hover:text-cyan-400 font-black tracking-widest text-sm uppercase transition-colors"
//         >
//           Close ✕
//         </button>
        
//         <div className="w-full h-full bg-black border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,1)] rounded-lg overflow-hidden">
//           <iframe
//             className="w-full h-full"
//             src={getEmbedUrl(trailerUrl)}
//             title="Game Trailer"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           ></iframe>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrailerModal;