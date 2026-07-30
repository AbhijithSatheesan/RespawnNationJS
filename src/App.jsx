import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { loginFailure } from './features/auth/userSlice'; 

// --- Pages & Layout ---
import AppLayout from './services/TechBackGround/AppLayout';
import WelcomePage from './features/Welcome/WelcomePage';
import NotFound from './components/NotFound';

// --- Auth ---
import Register from './features/auth/Register';
import ActivateAccount from './features/auth/ActivateAccount';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPasswordConfirm from './features/auth/ResetPasswordConfirm';
import LoginModal from './features/auth/LoginModal'; 

// --- Features ---
import LivePage from './features/live/LivePage';
import GoLive from './features/live/GoLive';
import LiveFeed from './features/live/LiveFeed';
import LiveTournaments from './features/live/LiveTournaments';
import WatchLive from './features/live/WatchLive';
import TournamentDashboard from './features/tournaments/TournamentDashboard';
import TournamentDetails from './features/tournaments/TournamentDetails';
import BrowseGames from './features/games/BrowseGames';
import GamePage from './features/games/GamePage';
import CategoryGamesPage from './features/games/browsepagecomponents/CategoryGamesPage';
import Community from './features/community/Community';
import UserProfile from './features/User/Userprofile';

export default function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for the 'session-expired' event triggered by our api.js interceptor
    const handleSessionExpired = () => {
      // 1. Clear Redux state to reflect logged-out status
      dispatch(loginFailure("Session expired. Please log in again."));
      
      // 2. Pop open the modal right where the user is!
      setIsLoginModalOpen(true);
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [dispatch]);

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration : 10000,
          style: {
            background: '#0a0a0c',     
            color: '#ffffff',
            border: '1px solid #1f2937', 
            fontFamily: 'monospace',     
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
          success: {
            iconTheme: {
              primary: '#06b6d4',       
              secondary: '#050505',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',       
              secondary: '#050505',
            },
          },
        }}
      />

      {/* GLOBAL LOGIN MODAL */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <Routes>
        {/* Safety Catch: In case you have any stray <Link to="/login"> in your code, 
            this bounces them to home and opens the modal silently instead of showing an empty page */}
        <Route 
          path="/login" 
          element={
            <Navigate 
              to="/" 
              replace 
              // Using an inline function to trigger the modal state asynchronously to avoid React render warnings
              ref={() => setTimeout(() => setIsLoginModalOpen(true), 0)} 
            />
          } 
        />
        
        <Route path="/register" element={<Register />} />

        {/* Routes WITH background */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<WelcomePage />} />

          {/* Live Section */}
          <Route path="/live" element={<LivePage />} />
          <Route path="/live/golive" element={<GoLive />} />
          <Route path="/live/feed" element={<LiveFeed />} />
          <Route path="/live/tournaments" element={<LiveTournaments />} />
          <Route path="/live/watch/:id" element={<WatchLive />} />
          
          {/* Tournaments */}
          <Route path="/tournament" element={<TournamentDashboard />} />
          <Route path="/tournaments/:id" element={<TournamentDetails />} />
          
          {/* Games */}
          <Route path="/browse" element={<BrowseGames />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/category/:categoryName" element={<CategoryGamesPage />} />
          
          {/* Community & User */}
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<UserProfile />} />
          
          {/* Auth Verification/Reset */}
          <Route path="/activate/:uid/:token" element={<ActivateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />

          {/* 404 Fallback */}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}