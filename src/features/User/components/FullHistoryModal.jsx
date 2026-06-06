import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const FullHistoryModal = ({ isOpen, onClose }) => {
  const [fullHistory, setFullHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Ensure this matches the URL you just created in Django
      api.get('/accounts/transactions/history/') 
        .then((response) => {
          setFullHistory(response.data);
        })
        .catch((error) => console.error("Failed to load history:", error))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex justify-center items-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#0a0a0c] rounded-xl border border-gray-800 shadow-2xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-black uppercase tracking-widest text-white">Full Financial Ledger</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-cyan-400 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : fullHistory.length > 0 ? (
            <div className="space-y-3">
              {fullHistory.map((tx) => {
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
                  <div key={tx.id} className="flex justify-between items-center p-4 bg-[#151a28] border border-gray-800 rounded">
                    <div>
                      <p className="text-sm font-bold text-white mb-1">
                        {tx.description}
                      </p>
                      <div className="flex gap-2 items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        <span>{new Date(tx.created_at).toLocaleString()}</span>
                        <span>•</span>
                        <span className="text-cyan-600">{tx.transaction_type_display}</span>
                        <span>•</span>
                        {/* If it's a normal database ID, just show the whole number with a hashtag */}
                            <span>ID: #{tx.id}</span>
                      </div>
                    </div>
                    <div className={`text-lg font-black ${textColor}`}>
                      {sign}₹{tx.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest text-sm">
              No transaction history found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullHistoryModal;