import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../../services/api';
import { loginStart, loginSuccess, loginFailure } from './userSlice';
import GoogleLoginButton from './GoogleLoginButton'; 
import { AUTH_LOGIN, AUTH_REGISTER } from '../../services/apiRoutes'; 

const LoginModal = ({ isOpen, onClose }) => {
  const [isSignInForm, setSignInForm] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: loginLoading, error: loginError } = useSelector((state) => state.user);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError(null);

    if (isSignInForm) {
      // --- DJOSER JWT LOGIN EXECUTION ---
      dispatch(loginStart());

      try {
        const response = await api.post(AUTH_LOGIN, {
          email: formData.email,
          password: formData.password
        });
        
        const { access, refresh, is_admin } = response.data;

        localStorage.setItem('access_token', access); 
        localStorage.setItem('refresh_token', refresh);

        const userResponse = await api.get('auth/users/me/', {
            headers: {
                Authorization: `Bearer ${access}`
            }
        });
        
        const { username, id, profile_picture } = userResponse.data;

        localStorage.setItem('user_info', JSON.stringify({ username, profile_picture, is_admin }));
        localStorage.setItem('id', id);

        dispatch(loginSuccess({ 
          token: access, 
          user: { username, id, profile_picture, is_admin } 
        }));
        
        onClose(); 
        navigate('/'); 

      } catch (err) {
        console.error("Login Failure Event:", err);
        const errorMessage = err.response?.data?.detail || "Invalid credential alignment. Check verification state.";
        dispatch(loginFailure(errorMessage));
      }
    } else {
      // --- DJOSER SECURE REGISTRATION ENGINE ---
      setIsRegisterLoading(true);
      try {
        const dataToSend = {
          username: formData.username,
          email: formData.email,
          password: formData.password
        };

        await api.post(AUTH_REGISTER, dataToSend);
        
        toast.success("Registration sequence initiated! Check your inbox.");

        setSignInForm(true);
        setFormData({ username: '', email: '', password: '' });

      } catch (err) {
        console.error("Registration Failure Event:", err);
        
        let processedError = "Registration rejected.";
        if (err.response?.data) {
          const firstKey = Object.keys(err.response.data)[0];
          const rawError = err.response.data[firstKey];
          processedError = Array.isArray(rawError) ? rawError[0] : rawError;
        }
        setRegisterError(processedError);
      } finally {
        setIsRegisterLoading(false);
      }
    }
  };

  const toggleSignInForm = () => {
    setSignInForm(!isSignInForm);
    setRegisterError(null);
    if (loginError) dispatch(loginFailure(null)); 
  };

  const displayError = isSignInForm ? loginError : registerError;
  const isLoading = isSignInForm ? loginLoading : isRegisterLoading;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur-md p-4 transition-all duration-300"
      onClick={onClose} 
    >
      {/* Modal Container */}
      <div 
        className="w-full max-w-md bg-[#0a0d14]/90 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Background Radial Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-cyan-400 p-1.5 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-cyan-500/40 transition-all duration-300 hover:rotate-90"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Tag & Title */}
        <div className="mb-6 text-center mt-1">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 border border-cyan-500/30 rounded-full bg-cyan-500/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
              {isSignInForm ? 'AUTHENTICATION' : 'NEW ACCESS PROTOCOL'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_10px_rgba(6,182,212,0.3)]">
            {isSignInForm ? (
              <>Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Back</span></>
            ) : (
              <>Join The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Network</span></>
            )}
          </h2>
          <p className="text-xs text-gray-400 font-medium tracking-wide mt-1">
            {isSignInForm ? 'Verify credentials to initialize session' : 'Create an account to join tournaments & stream'}
          </p>
        </div>

        {/* Error Feedback */}
        {displayError && (
          <div className="bg-red-950/40 text-red-400 px-4 py-3 rounded-lg mb-6 text-xs text-center border border-red-500/40 backdrop-blur-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{displayError}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignInForm && (
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="w-full px-4 py-3 bg-[#050811] border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
              />
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full px-4 py-3 bg-[#050811] border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-3 bg-[#050811] border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
            />
            
            {/* Forgot Password Link */}
            {isSignInForm && (
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose(); 
                    navigate('/forgot-password'); 
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-black py-3.5 rounded-lg uppercase tracking-wider text-xs transition-all duration-300 flex justify-center items-center mt-6 cursor-pointer
              ${isLoading 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.99]'
              }`}
          >
            {isLoading 
              ? (isSignInForm ? 'Connecting...' : 'Registering...') 
              : (isSignInForm ? 'Login' : 'Create Account')
            }
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center justify-center space-x-3">
          <span className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent"></span>
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-2">OR</span>
          <span className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent"></span>
        </div>

        {/* Google OAuth Provider Button */}
        <div className="mt-4 flex justify-center">
          <GoogleLoginButton onClose={onClose} />
        </div>

        {/* Toggle Mode */}
        <p className="mt-6 text-center text-xs text-gray-400 font-medium">
          {isSignInForm ? "New player? " : 'Already registered? '}
          <button 
            type="button"
            onClick={toggleSignInForm}
            className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors uppercase tracking-wider ml-1"
          >
            {isSignInForm ? 'Sign Up' : 'Log In'}
          </button>
        </p>

      </div>
    </div>
  );
};

export default LoginModal;