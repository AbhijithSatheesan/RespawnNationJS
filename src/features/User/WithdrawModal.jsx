import React, { useState } from 'react';
import api from '../../services/api'; 
import { WALLET_WITHDRAW } from '../../services/apiRoutes'; 

const WithdrawModal = ({ isOpen, onClose, onSuccess, maxAmount }) => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // Convert maxAmount to a whole number immediately (e.g., 500.50 becomes 500)
  const numericMax = Math.floor(Number(maxAmount) || 0);
  
  // Safely parse the user's input into an integer
  const numericAmount = parseInt(amount, 10) || 0;

  // The button should be disabled if loading, amount is invalid, or UPI is empty
  const isButtonDisabled = isLoading || numericAmount <= 0 || numericAmount > numericMax || !upiId.trim();

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError(null);

    // Double-check validation before sending to Django
    if (numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (numericAmount > numericMax) {
      setError("You cannot withdraw more than your available balance.");
      return;
    }
    if (!upiId.trim()) {
      setError("Please enter your UPI ID.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post(WALLET_WITHDRAW, {
        amount: numericAmount, // Send the clean integer to the backend
        upi_id: upiId
      });

      onSuccess();
      onClose();
      // Reset form states after successful withdrawal
      setAmount('');
      setUpiId('');
    } catch (err) {
      setError(err.response?.data?.error || "Failed to process withdrawal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    // Fill the input with the rounded-down whole number
    setAmount(numericMax.toString());
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 animate-fadeIn">
      <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl relative">
        
        <button 
          onClick={onClose} 
          disabled={isLoading} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors disabled:opacity-50"
        >
          ✕
        </button>

        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-1">Cash Out</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">
          Transfer winnings to your bank
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded text-sm mb-4 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleWithdraw} className="space-y-5">
          {/* Amount Input */}
          <div>
            <div className="flex justify-between items-end mb-2">
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest">
                Amount (₹)
                </label>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    Available: ₹{numericMax}
                </span>
            </div>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">₹</span>
                <input 
                    type="number" 
                    step="1" // Prevents user from typing decimals using the up/down arrows
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))} // Strips out periods/decimals if typed manually
                    disabled={isLoading}
                    className="w-full bg-[#050505] border border-gray-700 rounded p-3 pl-8 text-white font-bold focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="0"
                />
                <button 
                    type="button"
                    onClick={handleMaxClick}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-cyan-400 text-[10px] px-2 py-1 rounded font-black uppercase hover:bg-gray-700 transition-colors"
                >
                    Max
                </button>
            </div>
          </div>

          {/* UPI ID Input */}
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
              UPI ID
            </label>
            <input 
              type="text" 
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#050505] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="username@bank"
            />
          </div>

          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mt-2">
            Transfers are manually verified and processed within 24 hours to prevent fraud.
          </p>

          <button 
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full py-4 font-black uppercase tracking-widest text-sm rounded transition-all mt-4 ${
              isButtonDisabled
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
            }`}
          >
            {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default WithdrawModal;