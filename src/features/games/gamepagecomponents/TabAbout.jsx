import React from 'react';

const TabAbout = ({ game }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fadeIn">
      {/* Left Column: Description & Tags */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-black uppercase text-gray-400 tracking-wider mb-4 border-b border-gray-800 pb-2">Overview</h2>
        <p className="text-gray-300 leading-relaxed font-medium whitespace-pre-wrap mb-8">
          {game.description || "No description available for this title yet."}
        </p>

        {game.tags && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {game.tags.split(',').map((tag, index) => (
                <span key={index} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-900 border border-gray-800 text-gray-400 rounded hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-pointer">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Game Info & Stat Bars */}
      <div className="space-y-6">
        <div className="bg-[#0a0a0c] border border-gray-800 p-6 rounded-lg">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Game Info</h3>
          <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-800/50 pb-2">
                <span className="text-gray-400">Developer</span>
                <span className="font-bold text-white text-right">{game.developer || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/50 pb-2">
                <span className="text-gray-400">Publisher</span>
                <span className="font-bold text-white text-right">{game.publisher || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/50 pb-2">
                <span className="text-gray-400">Release</span>
                <span className="font-bold text-white">{game.release_year || '-'}</span>
              </div>
          </div>
        </div>

        <div className="bg-[#0a0a0c] border border-gray-800 p-6 rounded-lg">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Performance Stats</h3>
          <div className="space-y-4">
            {[
              { label: 'Action', value: game.action },
              { label: 'Graphics', value: game.graphics },
              { label: 'Story', value: game.story },
              { label: 'Gameplay', value: game.gameplay },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                  <span className="text-gray-400">{stat.label}</span>
                  <span className="text-cyan-400">{stat.value || 0}/10</span>
                </div>
                <div className="w-full bg-gray-900 rounded h-1.5 border border-gray-800 overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-1.5 shadow-[0_0_10px_rgba(8,145,178,0.8)]" 
                    style={{ width: `${(stat.value || 0) * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabAbout;