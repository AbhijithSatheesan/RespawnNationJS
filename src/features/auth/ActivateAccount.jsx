import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AUTH_ACTIVATE } from '../../services/apiRoutes';

const ActivateAccount = () => {
  // Grab the UID and Token from the browser's URL bar
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleActivation = async () => {
    setStatus('loading');
    try {
      // Send the exact payload Djoser expects
      await api.post(AUTH_ACTIVATE, {
        uid: uid,
        token: token,
      });
      
      setStatus('success');
      
      // Send them to the homepage after 3 seconds so they can log in
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      console.error("Activation failed:", err);
      setStatus('error');
      setErrorMessage(
        err.response?.data?.detail || 
        "Verification failed. The link may have expired or already been used."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#151a28] p-8 rounded-xl border border-gray-800 shadow-2xl text-center">
        
        <div className="mb-6">
          <div className="w-16 h-16 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/50">
            <span className="text-3xl">🛡️</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-2">
            Verify Your Account
          </h2>
          <p className="text-sm text-gray-400">
            Secure your Respawn Nation wallet and access tournaments.
          </p>
        </div>

        {status === 'error' && (
          <div className="bg-red-900/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm border border-red-800/50">
            {errorMessage}
          </div>
        )}

        {status === 'success' ? (
          <div className="bg-green-900/30 text-green-400 px-4 py-4 rounded-lg mb-6 border border-green-800/50">
            <p className="font-bold uppercase tracking-wider mb-1">Account Activated!</p>
            <p className="text-xs">Redirecting to headquarters...</p>
          </div>
        ) : (
          <button
            onClick={handleActivation}
            disabled={status === 'loading'}
            className={`w-full font-bold py-3 rounded-lg uppercase tracking-wide transition-all
              ${status === 'loading' 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)]'
              }`}
          >
            {status === 'loading' ? 'Verifying Identity...' : 'Confirm Activation'}
          </button>
        )}

      </div>
    </div>
  );
};

export default ActivateAccount;