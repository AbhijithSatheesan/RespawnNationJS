import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { RAZORPAY_GENERATE_ORDER, REGISTER_TOURNAMENT } from '../../../services/apiRoutes';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const JoinTournamentModal = ({ tournamentId, tournamentTitle, entryFee, onClose, onSuccess }) => {
  const [gameId, setGameId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Real-time wallet states
  const [walletBalance, setWalletBalance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  
  const isFree = parseFloat(entryFee || 0) === 0;
  const hasEnoughBalance = walletBalance >= parseFloat(entryFee || 0);
  
  // Default to Razorpay until we verify they have enough wallet money
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');

  // FETCH LIVE WALLET BALANCE WHEN MODAL OPENS
  useEffect(() => {
    if (isFree) {
        setIsBalanceLoading(false);
        return;
    }

    const fetchLiveBalance = async () => {
      try {
        const response = await api.get('/accounts/profile/me/');
        const liveBalance = parseFloat(response.data.wallet_balance || 0);
        setWalletBalance(liveBalance);
        
        // Auto-switch to WALLET pay if they have enough money!
        if (liveBalance >= parseFloat(entryFee || 0)) {
            setPaymentMethod('WALLET');
        }
      } catch (err) {
        console.error("Failed to fetch live balance", err);
      } finally {
        setIsBalanceLoading(false);
      }
    };

    fetchLiveBalance();
  }, [isFree, entryFee]);

  const handlePayment = async () => {
    if (!gameId.trim()) {
      setError('Please enter your In-Game ID.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isFree) {
        await api.post(REGISTER_TOURNAMENT(tournamentId), { game_id: gameId });
        onSuccess(); 
        return; 
      }

      if (paymentMethod === 'WALLET') {
        if (!hasEnoughBalance) {
            setError("Insufficient Wallet Balance.");
            setIsLoading(false);
            return;
        }

        await api.post(REGISTER_TOURNAMENT(tournamentId), {
          game_id: gameId,
          payment_method: 'WALLET' 
        });

        onSuccess();
        return;
      }

      if (paymentMethod === 'RAZORPAY') {
        const res = await loadRazorpayScript();
        if (!res) {
          setError('Razorpay SDK failed to load. Check your connection.');
          setIsLoading(false);
          return;
        }

        const orderResponse = await api.post(RAZORPAY_GENERATE_ORDER(tournamentId));
        const orderData = orderResponse.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Respawn Nation',
          description: `Entry Fee: ${tournamentTitle}`,
          order_id: orderData.order_id,
          theme: { color: '#0891b2' },
          handler: async function (response) {
            try {
              await api.post(REGISTER_TOURNAMENT(tournamentId), {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                game_id: gameId,
                payment_method: 'RAZORPAY' 
              });
              onSuccess(); 
            } catch (err) {
              setError(err.response?.data?.error || 'Server error during verification.');
              setIsLoading(false);
            }
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
          setError(response.error.description);
          setIsLoading(false);
        });
        paymentObject.open();
      }

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to initialize payment.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 animate-fadeIn">
      <div className="bg-[#0a0a0c] border border-cyan-900/50 rounded-xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(8,145,178,0.15)] relative">
        
        <button onClick={onClose} disabled={isLoading} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors disabled:opacity-50">
          ✕
        </button>

        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Join Tournament</h2>
        <p className="text-cyan-400 text-sm font-bold mb-6 line-clamp-1">{tournamentTitle}</p>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded text-sm mb-4 font-bold">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
            Your In-Game ID
          </label>
          <input 
            type="text" 
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            disabled={isLoading}
            className="w-full bg-[#050505] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="SniperGod#NA1"
          />
        </div>

        {/* --- PAYMENT METHOD SELECTOR --- */}
        {!isFree && (
          <div className="mb-6">
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
              Payment Method
            </label>
            {isBalanceLoading ? (
               <div className="text-cyan-500 text-xs font-bold uppercase animate-pulse">Scanning Secure Wallet...</div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setPaymentMethod('WALLET')}
                    className={`cursor-pointer border rounded p-3 flex flex-col items-center justify-center transition-all ${
                      paymentMethod === 'WALLET' 
                        ? 'border-cyan-500 bg-cyan-900/20' 
                        : 'border-gray-700 bg-[#050505] hover:border-gray-500'
                    }`}
                  >
                    <span className="text-white font-bold text-sm mb-1">Wallet Pay</span>
                    <span className={`text-xs ${hasEnoughBalance ? 'text-green-400' : 'text-red-400'}`}>
                      Bal: ₹{walletBalance}
                    </span>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('RAZORPAY')}
                    className={`cursor-pointer border rounded p-3 flex flex-col items-center justify-center transition-all ${
                      paymentMethod === 'RAZORPAY' 
                        ? 'border-blue-500 bg-blue-900/20' 
                        : 'border-gray-700 bg-[#050505] hover:border-gray-500'
                    }`}
                  >
                    <span className="text-white font-bold text-sm mb-1">Razorpay</span>
                    <span className="text-xs text-gray-400">Card / UPI</span>
                  </div>
                </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-800 pt-4 mb-6 mt-2">
          <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Entry Fee</span>
          <span className={`text-2xl font-black ${isFree ? 'text-yellow-400 uppercase tracking-widest' : 'text-white'}`}>
            {isFree ? 'Free' : `₹${entryFee}`}
          </span>
        </div>

        <button 
          onClick={handlePayment}
          disabled={isLoading || isBalanceLoading || (paymentMethod === 'WALLET' && !hasEnoughBalance && !isFree)}
          className={`w-full py-4 font-black uppercase tracking-widest text-sm rounded transition-all ${
            isLoading || isBalanceLoading || (paymentMethod === 'WALLET' && !hasEnoughBalance && !isFree)
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]'
          }`}
        >
          {isLoading ? 'Processing...' : 
           isFree ? 'Register For Free' : 
           (paymentMethod === 'WALLET' && !hasEnoughBalance) ? 'Insufficient Balance' : 
           `Pay ₹${entryFee} & Join`}
        </button>

      </div>
    </div>
  );
};

export default JoinTournamentModal;












// import React, { useState } from 'react';
// import api from '../../../services/api';
// import { RAZORPAY_GENERATE_ORDER, REGISTER_TOURNAMENT } from '../../../services/apiRoutes';

// // Utility function to dynamically load the Razorpay SDK safely
// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// const JoinTournamentModal = ({ tournamentId, tournamentTitle, entryFee, onClose, onSuccess }) => {
//   const [gameId, setGameId] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Check if it's free. If entryFee is undefined, default to 0 just in case.
//   const isFree = parseFloat(entryFee || 0) === 0;

//   const handlePayment = async () => {
//     if (!gameId.trim()) {
//       setError('Please enter your In-Game ID.');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // ==========================================
//       // SCENARIO A: FREE TOURNAMENT BYPASS
//       // ==========================================
//       if (isFree) {
//         await api.post(REGISTER_TOURNAMENT(tournamentId), {
//           game_id: gameId
//         });
        
//         onSuccess(); // Close modal and refresh UI
//         return; // Stop here, no Razorpay needed!
//       }

//       // ==========================================
//       // SCENARIO B: PAID TOURNAMENT FLOW
//       // ==========================================
      
//       // 1. Load the Razorpay script dynamically
//       const res = await loadRazorpayScript();
//       if (!res) {
//         setError('Razorpay SDK failed to load. Check your connection.');
//         setIsLoading(false);
//         return;
//       }

//       // 2. Hit our Django View 1 to generate the order
//       const orderResponse = await api.post(RAZORPAY_GENERATE_ORDER(tournamentId));
//       const orderData = orderResponse.data;

//       // 3. Configure the Razorpay Popup
//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: 'Respawn Nation',
//         description: `Entry Fee: ${tournamentTitle}`,
//         order_id: orderData.order_id,
//         theme: {
//           color: '#0891b2', // Cyan to match your theme
//         },
//         handler: async function (response) {
//           try {
//             // 4. Hit our Django View 2: Verify and Register
//             await api.post(REGISTER_TOURNAMENT(tournamentId), {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//               game_id: gameId 
//             });

//             onSuccess(); 

//           } catch (err) {
//             const errorMessage = err.response?.data?.error || 'Server error during verification.';
//             setError(errorMessage);
//             setIsLoading(false);
//           }
//         },
//       };

//       // 5. Open the Razorpay Window
//       const paymentObject = new window.Razorpay(options);
      
//       paymentObject.on('payment.failed', function (response) {
//         setError(response.error.description);
//         setIsLoading(false);
//       });

//       paymentObject.open();

//     } catch (err) {
//       const errorMessage = err.response?.data?.error || err.message || 'Failed to initialize payment.';
//       setError(errorMessage);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn">
//       <div className="bg-[#0a0a0c] border border-cyan-900/50 rounded-xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(8,145,178,0.15)] relative">
        
//         {/* Close Button */}
//         <button onClick={onClose} disabled={isLoading} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors disabled:opacity-50">
//           ✕
//         </button>

//         <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Join Tournament</h2>
//         <p className="text-cyan-400 text-sm font-bold mb-6">{tournamentTitle}</p>

//         {error && (
//           <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded text-sm mb-4 font-bold">
//             {error}
//           </div>
//         )}

//         <div className="mb-6">
//           <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
//             Your In-Game ID (e.g., Riot ID, Steam Name)
//           </label>
//           <input 
//             type="text" 
//             value={gameId}
//             onChange={(e) => setGameId(e.target.value)}
//             disabled={isLoading}
//             className="w-full bg-[#050505] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
//             placeholder="SniperGod#NA1"
//           />
//         </div>

//         <div className="flex items-center justify-between border-t border-gray-800 pt-6 mb-6">
//           <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Entry Fee</span>
//           {/* Dynamically show Free or the actual Price */}
//           <span className={`text-2xl font-black ${isFree ? 'text-yellow-400 uppercase tracking-widest' : 'text-white'}`}>
//             {isFree ? 'Free' : `₹${entryFee}`}
//           </span>
//         </div>

//         <button 
//           onClick={handlePayment}
//           disabled={isLoading}
//           className={`w-full py-4 font-black uppercase tracking-widest text-sm rounded transition-all ${
//             isLoading 
//               ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
//               : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]'
//           }`}
//         >
//           {isLoading ? 'Processing...' : (isFree ? 'Register For Free' : 'Pay & Join Now')}
//         </button>

//       </div>
//     </div>
//   );
// };

// export default JoinTournamentModal;







