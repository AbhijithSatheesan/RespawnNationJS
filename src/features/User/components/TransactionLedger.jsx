import React, { useState } from 'react';
import FullHistoryModal from './FullHistoryModal'; // <-- Import the modal

const TransactionLedger = ({ transactions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- Add state

  return (
    <>
      <div className="lg:col-span-2">
        <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-6 h-full flex flex-col">
          <div className="flex justify-between items-center border-b border-gray-800/50 pb-4 mb-4">
            <h2 className="text-white font-black uppercase tracking-widest">Financial Ledger</h2>
            
            {/* --- ADD ONCLICK EVENT HERE --- */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest cursor-pointer hover:text-cyan-400 transition-colors"
            >
              View Full History
            </button>
          </div>

          {transactions && transactions.length > 0 ? (
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
              {transactions.map((tx) => {
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
                  <div key={tx.id} className="flex justify-between items-center p-4 bg-black/40 border border-gray-800/50 rounded hover:border-gray-700 transition-colors group">
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

      {/* --- MOUNT THE MODAL HERE --- */}
      <FullHistoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default TransactionLedger;