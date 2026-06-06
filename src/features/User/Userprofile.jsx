import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';

// --- SUB-COMPONENTS ---
import ProfileHeader from './components/ProfileHeader';
import WalletCard from './components/WalletCard';
import TransactionLedger from './components/TransactionLedger';
import TournamentDashboard from './TournamentDashboard';
import WithdrawModal from './WithdrawModal'; 
import DepositModal from './DepositModal'; 

const UserProfile = () => {
  const { userInfo } = useSelector((state) => state.user);
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false); 

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
    if (userInfo) fetchProfile();
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
        
        {/* HEADER COMPONENT */}
        <ProfileHeader profileData={profileData} fetchProfile={fetchProfile} />

        {/* TAB NAVIGATION */}
        <div className="flex gap-8 border-b border-gray-800 mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors ${
              activeTab === 'overview' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-gray-500 hover:text-white'
            }`}
          >
            Financial Ledger
          </button>
          <button 
            onClick={() => setActiveTab('tournaments')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors ${
              activeTab === 'tournaments' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-gray-500 hover:text-white'
            }`}
          >
            Tournament HQ
          </button>
        </div>

        {/* TAB CONTENT */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <WalletCard 
              walletBalance={profileData.wallet_balance} 
              totalEarnings={profileData.total_earnings} 
              bio={profileData.bio} 
              onDepositClick={() => setIsDepositOpen(true)}
              onWithdrawClick={() => setIsWithdrawOpen(true)}
            />
            <TransactionLedger transactions={profileData.recent_transactions} />
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="animate-fadeIn">
            <TournamentDashboard />
          </div>
        )}

      </div>

      {/* MODALS */}
      <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} onSuccess={fetchProfile} maxAmount={profileData.wallet_balance} />
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} onSuccess={fetchProfile} />
    </div>
  );
};

export default UserProfile;