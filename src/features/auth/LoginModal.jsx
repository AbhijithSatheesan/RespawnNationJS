import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { loginStart, loginSuccess, loginFailure } from './userSlice';
import GoogleLoginButton from './GoogleLoginButton'; // Make sure this path is correct

const LoginModal = ({ isOpen, onClose }) => {
  const [isSignInForm, setSignInForm] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: loginLoading, error: loginError } = useSelector((state) => state.user);

  // Do not render anything if the modal is closed
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError(null);

    if (isSignInForm) {
      // --- STANDARD LOGIN LOGIC ---
      dispatch(loginStart());

      try {
        const response = await api.post('/accounts/login/', {
          email: formData.email,
          password: formData.password
        });
        
        // MATCHING THE DJANGO BACKEND UNDERSCORE FORMAT
        const { access_token, refresh_token, username } = response.data;

        localStorage.setItem('access_token', access_token); 
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user_info', JSON.stringify({ username }));

        dispatch(loginSuccess({ token: access_token, user: { username: username } }));
        
        onClose(); // Close the modal on success
        navigate('/browse'); // Send them into the app

      } catch (err) {
        console.error("Login Error:", err);
        const errorMessage = err.response?.data?.message || "Invalid email or password.";
        dispatch(loginFailure(errorMessage));
      }
    } else {
      // --- STANDARD REGISTER LOGIC ---
      setIsRegisterLoading(true);
      try {
        const dataToSend = {
          username: formData.username,
          email: formData.email,
          password: formData.password
        };

        await api.post('/accounts/register/', dataToSend);
        
        alert("Registration successful! Please log in.");
        setSignInForm(true);
        setFormData({ username: '', email: '', password: '' });

      } catch (err) {
        console.error("Registration Error:", err);
        setRegisterError(err.response?.data?.detail || "Registration failed. Try a different username/email.");
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
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose} // Closes modal when clicking the blurred background
    >
      <div 
        className="w-full max-w-sm bg-[#151a28] p-8 rounded-xl border border-gray-800 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the card from closing it
      >
        
        {/* Close Icon (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-cyan-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6 text-center mt-2">
          <h2 className="text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
            {isSignInForm ? 'Welcome Back' : 'Join the Game'}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            {isSignInForm ? 'Log in to continue your session' : 'Create an account to get started'}
          </p>
        </div>

        {displayError && (
          <div className="bg-red-900/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm text-center border border-red-800/50">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignInForm && (
            <div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="w-full px-4 py-3 bg-[#0b0f19] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>
          )}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full px-4 py-3 bg-[#0b0f19] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-3 bg-[#0b0f19] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-3 rounded-lg uppercase tracking-wide transition-all flex justify-center items-center mt-6
              ${isLoading 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)] hover:shadow-[0_0_25px_rgba(8,145,178,0.5)]'
              }`}
          >
            {isLoading 
              ? (isSignInForm ? 'Connecting...' : 'Registering...') 
              : (isSignInForm ? 'Login' : 'Create Account')
            }
          </button>
        </form>

        {/* --- DIVIDER AND GOOGLE LOGIN BUTTON --- */}
        <div className="mt-6 flex items-center justify-center space-x-2">
          <span className="h-[1px] w-full bg-gray-700"></span>
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">OR</span>
          <span className="h-[1px] w-full bg-gray-700"></span>
        </div>

        <div className="mt-4 flex justify-center">
          <GoogleLoginButton onClose={onClose} />
        </div>
        {/* --------------------------------------- */}

        <p className="mt-6 text-center text-sm text-gray-500">
          {isSignInForm ? "New player? " : 'Already registered? '}
          <button 
            type="button"
            onClick={toggleSignInForm}
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors uppercase tracking-wide"
          >
            {isSignInForm ? 'Sign Up' : 'Log In'}
          </button>
        </p>

      </div>
    </div>
  );
};

export default LoginModal;