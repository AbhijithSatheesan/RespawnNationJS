import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 
import { WALLET_DEPOSIT_ORDER, WALLET_DEPOSIT_VERIFY } from '../../services/apiRoutes'; 

const DepositModal = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // NEW: Bulletproof state reset. Every time the modal opens, wipe the memory clean!
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Utility to load the Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const numericAmount = parseInt(amount, 10) || 0;
  const isButtonDisabled = isLoading || numericAmount <= 0;

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError(null);

    if (numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Load Razorpay Script
      const res = await loadRazorpayScript();
      if (!res) {
        setError("Razorpay SDK failed to load. Are you online?");
        setIsLoading(false);
        return;
      }

      // 2. Hit Django to generate the Order ID
      const orderResponse = await api.post(WALLET_DEPOSIT_ORDER, {
        amount: numericAmount
      });
      
      const { order_id, amount: amountInPaise, currency } = orderResponse.data;

      // 3. Configure Razorpay Popup Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE", 
        amount: amountInPaise,
        currency: currency,
        name: "Respawn Nation",
        description: "Wallet Top-Up",
        order_id: order_id,
        theme: {
          color: "#0891b2",
        },
        handler: async function (response) {
          try {
            // 4. Send the success signature back to Django for verification
            await api.post(WALLET_DEPOSIT_VERIFY, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            // 5. If verified, refresh profile and close!
            onSuccess();
            onClose();
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.error || "Payment verification failed.");
          } finally {
            // THE FIX: Always turn off the loading spinner, even if it succeeds or fails!
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false); 
          }
        }
      };

      // Open the Razorpay Payment Window
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      setError(err.response?.data?.error || "Failed to initialize payment.");
      setIsLoading(false);
    }
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

        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-1">Add Funds</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">
          Top up your wallet securely via Razorpay
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded text-sm mb-4 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleDeposit} className="space-y-5">
          
          {/* Quick Select Buttons */}
          <div className="flex gap-2">
            {[100, 500, 1000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className="flex-1 bg-[#050505] border border-gray-700 text-gray-300 py-2 rounded text-xs font-black hover:border-cyan-500 hover:text-cyan-400 transition-colors"
              >
                +₹{preset}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
              Custom Amount (₹)
            </label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">₹</span>
                <input 
                    type="number" 
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    disabled={isLoading}
                    className="w-full bg-[#050505] border border-gray-700 rounded p-3 pl-8 text-white font-bold focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="0"
                />
            </div>
          </div>

          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center mt-2 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Secured by Razorpay
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
            {isLoading ? 'Processing...' : 'Proceed to Pay'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default DepositModal;