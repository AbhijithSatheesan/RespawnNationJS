import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { loginStart, loginSuccess, loginFailure } from './userSlice';

const GoogleLoginButton = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    // credentialResponse.credential contains the actual JWT token from Google
    dispatch(loginStart());

    try {
      // Send the token to your Django GoogleLoginView
      const response = await api.post('/accounts/googlelogin/', {
        token: credentialResponse.credential
      });

      // Match the exact keys returned by your Django view
      const { access_token, refresh_token, username } = response.data;

      // Save to Local Storage
      localStorage.setItem('access_token', access_token); 
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_info', JSON.stringify({ username }));

      // Update Redux
      dispatch(loginSuccess({ token: access_token, user: { username: username } }));
      
      // Close the modal and redirect
      if (onClose) onClose();
      navigate('/browse');

    } catch (err) {
      console.error("Google Login Backend Error:", err);
      const errorMessage = err.response?.data?.message || "Google authentication failed on our server.";
      dispatch(loginFailure(errorMessage));
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed at the popup");
    dispatch(loginFailure("Google popup was closed or failed."));
  };

  return (
    <div className="w-full flex justify-center mt-4">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="filled_black" // Looks great on dark backgrounds
        shape="rectangular"
        size="large"
        text="continue_with"
      />
    </div>
  );
};

export default GoogleLoginButton;