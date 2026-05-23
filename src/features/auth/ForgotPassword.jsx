import React, { useState } from 'react';
import api from '../../services/api';
import { AUTH_PASSWORD_RESET } from '../../services/apiRoutes';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // Djoser expects just the email to send the reset link
      await api.post(AUTH_PASSWORD_RESET, { email });
      setStatus('success');
    } catch (err) {
      console.error("Password reset request failed:", err);
      setStatus('error');
      setErrorMessage("If this email exists in our system, a reset link has been sent.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#151a28] p-8 rounded-xl border border-gray-800 shadow-2xl relative">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-gray-400">
            Enter your email to receive a recovery link.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-900/30 text-green-400 px-4 py-4 rounded-lg text-center border border-green-800/50">
            <p className="font-bold uppercase tracking-wider mb-1">Transmission Sent</p>
            <p className="text-sm">Check your inbox for the password reset link.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
              <div className="bg-red-900/30 text-red-400 px-4 py-3 rounded-lg text-sm border border-red-800/50">
                {errorMessage}
              </div>
            )}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Account Email"
                required
                className="w-full px-4 py-3 bg-[#0b0f19] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full font-bold py-3 rounded-lg uppercase tracking-wide transition-all
                ${status === 'loading' 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)]'
                }`}
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;