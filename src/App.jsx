import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <--- 1. IMPORT IT HERE
import Login from './features/auth/Login';
import WelcomePage from './features/Welcome/WelcomePage';
import LivePage from './features/live/LivePage';
import TournamentDashboard from './features/tournaments/TournamentDashboard';
import AppLayout from './services/TechBackGround/AppLayout';
import BrowseGames from './features/games/BrowseGames';
import Community from './features/community/Community';
import GoLive from './features/live/GoLive';
import LiveFeed from './features/live/LiveFeed';
import LiveTournaments from './features/live/LiveTournaments';
import WatchLive from './features/live/WatchLive';
import Register from './features/auth/Register';
import TournamentDetails from './features/tournaments/TournamentDetails';
import GamePage from './features/games/GamePage';
import UserProfile from './features/User/Userprofile';
import NotFound from './components/NotFound';
import ActivateAccount from './features/auth/ActivateAccount';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPasswordConfirm from './features/auth/ResetPasswordConfirm';
import CategoryGamesPage from './features/games/browsepagecomponents/CategoryGamesPage';

export default function App() {
  return (
    <>
      {/* 2. PLACE THE TOASTER OUTSIDE ROUTES, WRAPPED IN A FRAGMENT */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration : 10000,
          style: {
            background: '#0a0a0c',     
            color: '#ffffff',
            border: '1px solid #1f2937', // border-gray-800
            fontFamily: 'monospace',     
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
          success: {
            iconTheme: {
              primary: '#06b6d4',       // Sleek cyan-500 tint
              secondary: '#050505',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',       // Red-400 theme
              secondary: '#050505',
            },
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes WITH background */}
        <Route element={<AppLayout />}>
          <Route path = "/" element = {<WelcomePage />} />

          <Route path = "/live" element = {<LivePage />} />
          <Route path = "/live/golive" element = {<GoLive />} />
          <Route path = "/live/feed" element = {<LiveFeed />} />
          <Route path = "/live/tournaments" element = {<LiveTournaments />} />
          <Route path="/live/watch/:id" element={<WatchLive />} />
          
          <Route path = "/tournament" element = {<TournamentDashboard />} />
          
          <Route path = "/browse" element = {<BrowseGames />} />
          <Route path = "/community" element = {<Community />} />
          <Route path="/tournaments/:id" element={<TournamentDetails />} />
          <Route path="/game/:id" element={<GamePage />} />
          
          <Route path = "/profile" element = {<UserProfile />} />
          <Route path="/activate/:uid/:token" element={<ActivateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />
          <Route path="/category/:categoryName" element={<CategoryGamesPage />} />

          <Route path='*' element = {<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}