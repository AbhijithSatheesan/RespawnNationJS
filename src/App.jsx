import { Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Routes WITH background */}
      <Route element={<AppLayout />}>
        <Route path = "/" element = {<WelcomePage />} />

        <Route path = "/live" element = {<LivePage />} />
        <Route path = "/live/golive" element = {<GoLive />} />
        <Route path = "/live/feed" element = {<LiveFeed />} />
        <Route path = "/live/golive" element = {<GoLive />} />
        <Route path = "/live/tournaments" element = {<LiveTournaments />} />
        <Route path="/live/watch/:id" element={<WatchLive />} />
        

        <Route path = "/tournament" element = {<TournamentDashboard />} />
        <Route path = "/browse" element = {<BrowseGames />} />
        <Route path = "/community" element = {<Community />} />
        <Route path = "/community" element = {<Community />} />
        <Route path="/tournaments/:id" element={<TournamentDetails />} />
        <Route path="/game/:id" element={<GamePage />} />
      </Route>
    </Routes>
  );
}
