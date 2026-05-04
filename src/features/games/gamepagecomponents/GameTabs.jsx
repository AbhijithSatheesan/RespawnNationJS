import React from 'react';

const GameTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ['about', 'tournaments', 'streams'];

  return (
    <div className="border-b border-gray-800 sticky top-0 bg-[#050505]/90 backdrop-blur-md z-30">
      <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto gap-8 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 text-xs font-black uppercase tracking-widest transition-colors relative whitespace-nowrap ${
              activeTab === tab ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.replace('_', ' ')}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_10px_rgba(8,145,178,0.8)]"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameTabs;







