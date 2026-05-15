import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import WithdrawModal from './WithdrawModal'; 
import DepositModal from './DepositModal'; // <--- IMPORT THE NEW MODAL

const UserProfile = () => {
  const { userInfo } = useSelector((state) => state.user);
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false); // <--- ADD DEPOSIT STATE

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get('/accounts/profile/me/'); 
      setProfileData(response.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetchProfile();
    }
  }, [userInfo, fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(8,145,178,0.5)]"></div>
          <span className="text-cyan-500 font-bold uppercase tracking-widest text-xs animate-pulse">
            Accessing Operative Database...
          </span>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center bg-[#050505]">
        <div className="text-center text-red-500 font-bold uppercase tracking-widest border border-red-500/30 bg-red-900/10 p-6 rounded">
          Connection Lost. Error loading profile data.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono pt-8 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* =========================================
            1. HEADER / BANNER SECTION
        ========================================= */}
        <div className="relative w-full h-48 md:h-64 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl group">
          {profileData.banner_image ? (
            <img 
              src={profileData.banner_image} 
              alt="Banner" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500" 
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 to-[#050505]"></div>
          )}
          
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex items-end gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-[#0a0a0c] border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(8,145,178,0.4)] overflow-hidden relative group-hover:border-cyan-400 transition-colors duration-300">
              <span className="text-5xl md:text-7xl font-black text-cyan-500 uppercase z-10 group-hover:scale-110 transition-transform duration-300">
                {profileData.username.charAt(0)}
              </span>
              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="mb-2">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest drop-shadow-lg">
                {profileData.username}
              </h1>
              <p className="text-cyan-400 text-sm md:text-base font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Registered Operative
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            2. MAIN GRID (Wallet & Ledger)
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: Wallet & Stats --- */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-colors duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors"></div>
              
              <h2 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Available Balance</h2>
              <div className="text-4xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.2)] mb-6">
                ₹{profileData.wallet_balance}
              </div>
              
              <div className="flex gap-3 relative z-10">
                {/* WIRING UP THE DEPOSIT BUTTON */}
                <button 
                  onClick={() => setIsDepositOpen(true)}
                  className="flex-1 bg-white text-black py-2.5 rounded text-xs font-black uppercase tracking-widest hover:bg-gray-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"
                >
                  Deposit
                </button>
                <button 
                  onClick={() => setIsWithdrawOpen(true)}
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
                ₹{profileData.total_earnings}
              </div>
            </div>

            <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-6">
              <h2 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-4">Operative Bio</h2>
              <p className="text-sm text-gray-300 leading-relaxed italic">
                {profileData.bio || "No bio provided yet. Update your settings to let competitors know who they are facing."}
              </p>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Transaction Ledger --- */}
          <div className="lg:col-span-2">
            <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-6 h-full flex flex-col">
              
              <div className="flex justify-between items-center border-b border-gray-800/50 pb-4 mb-4">
                <h2 className="text-white font-black uppercase tracking-widest">Financial Ledger</h2>
                <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest cursor-pointer hover:text-cyan-400 transition-colors">
                  View Full History
                </span>
              </div>

              {profileData.recent_transactions && profileData.recent_transactions.length > 0 ? (
                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                  {profileData.recent_transactions.map((tx) => {
                    const isPositive = ['DEPOSIT', 'PRIZE', 'REFUND'].includes(tx.transaction_type);
                    const isPending = tx.transaction_type === 'WITHDRAWAL_PENDING';
                    
                    let textColor = 'text-red-400';
                    let sign = '-';
                    
                    if (isPositive) {
                      textColor = 'text-green-400';
                      sign = '+';
                    } else if (isPending) {
                      textColor = 'text-yellow-400';
                      sign = '-'; 
                    }

                    return (
                      <div 
                        key={tx.id} 
                        className="flex justify-between items-center p-4 bg-black/40 border border-gray-800/50 rounded hover:border-gray-700 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-bold text-white mb-1 group-hover:text-cyan-100 transition-colors">
                            {tx.description}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                            {new Date(tx.created_at).toLocaleDateString()} • {tx.transaction_type_display}
                          </p>
                        </div>
                        <div className={`text-lg font-black ${textColor}`}>
                          {sign}₹{tx.amount}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 flex-grow opacity-50">
                  <span className="text-5xl mb-4 grayscale">🧾</span>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    No financial activity detected.
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase mt-2">
                    Join a tournament to initialize ledger.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* =========================================
          MODALS
      ========================================= */}
      <WithdrawModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        onSuccess={fetchProfile} 
        maxAmount={profileData.wallet_balance} 
      />

      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        onSuccess={fetchProfile} 
      />

    </div>
  );
};

export default UserProfile;