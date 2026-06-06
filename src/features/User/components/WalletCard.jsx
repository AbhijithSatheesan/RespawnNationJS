import React from 'react';

const WalletCard = ({ walletBalance, totalEarnings, bio, onDepositClick, onWithdrawClick }) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors"></div>
        
        <h2 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Available Balance</h2>
        <div className="text-4xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.2)] mb-6">
          ₹{walletBalance}
        </div>
        
        <div className="flex gap-3 relative z-10">
          <button 
            onClick={onDepositClick}
            className="flex-1 bg-white text-black py-2.5 rounded text-xs font-black uppercase tracking-widest hover:bg-gray-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"
          >
            Deposit
          </button>
          <button 
            onClick={onWithdrawClick}
            className="flex-1 bg-transparent border border-gray-600 text-white py-2.5 rounded text-xs font-black uppercase tracking-widest hover:border-white transition-colors"
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <h2 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Lifetime Winnings</h2>
        <div className="text-2xl font-black text-yellow-500 relative z-10">
          ₹{totalEarnings}
        </div>
      </div>

      <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-6">
        <h2 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-4">Operative Bio</h2>
        <p className="text-sm text-gray-300 leading-relaxed italic">
          {bio || "No bio provided yet. Update your settings to let competitors know who they are facing."}
        </p>
      </div>
    </div>
  );
};

export default WalletCard;