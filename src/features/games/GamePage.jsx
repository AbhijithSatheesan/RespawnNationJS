import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'; // ADDED: For Auth Guard
import api from '../../services/api';
import { django_media_url } from '../../services/BackendConfig';
import { GAME_DETAILS } from '../../services/apiRoutes';
import TabTournaments from './gamepagecomponents/TabTournaments';
import TabStreams from './gamepagecomponents/TabStreams';

// Import our new components
import GameHero from './gamepagecomponents/GameHero';
import GameTabs from './gamepagecomponents/GameTabs';
import TabAbout from './gamepagecomponents/TabAbout';
import TrailerModal from './gamepagecomponents/TrailerModal';

// ADDED: Chat and Auth Components
import LoginModal from '../auth/LoginModal'; 
import CommunityBar from '../Welcome/Components/CommunityBar';
import CommunitySidebar from '../../components/Chat/CommunitySidebar';

const GamePage = () => {
  const { id } = useParams();
  
  // 1. Grab user auth state from Redux
  const { userInfo, token } = useSelector((state) => state.user);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('about');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // 2. Add state for the Modals
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await api.get(GAME_DETAILS(id)); 
        setGame(response.data);
      } catch (error) {
        console.error("Failed to fetch game details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGameDetails();
  }, [id]);

  // 3. Auth Guard Handler for Chat
  const handleCommunityClick = () => {
    if (!token && !userInfo) {
      setIsLoginModalOpen(true); // Pop login if not authenticated
    } else {
      setIsChatOpen(true);       // Open chat if authenticated
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith('http') ? imagePath : `${django_media_url}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!game) return <div className="text-white text-center mt-20">Game not found.</div>;

  const bgImage = getImageUrl(game.promo_background) || getImageUrl(game.cover_image);

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      
      <GameHero 
        game={game} 
        bgImage={bgImage} 
        onOpenTrailer={() => setIsTrailerOpen(true)} 
      />

      {/* GAME CHAT BAR */}
      {/* Placed sleekly between the Hero and the Tabs */}
      <div className="w-full max-w-4xl mx-auto px-6 mt-8 mb-4">
        <CommunityBar onClick={handleCommunityClick} />
      </div>

      <GameTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'about' && <TabAbout game={game} />}
        
        {/* Placeholders for future components */}
        {activeTab === 'tournaments' && (
          <>
          <TabTournaments gameId={game.id} />
          <div className="animate-fadeIn">
            <h2 className="text-xl font-black uppercase text-gray-400 tracking-wider mb-6">Active Tournaments</h2>
            <div className="bg-[#0a0a0c] border border-gray-800 rounded-lg p-12 text-center">
              <p className="text-gray-500 font-bold uppercase tracking-widest">Fetching tournament data...</p>
            </div>
          </div>
          </>
        )}

        {activeTab === 'streams' && (
          <>
          <TabStreams gameId = {game.id} game_image= {bgImage} />
          <div className="animate-fadeIn">
            <h2 className="text-xl font-black uppercase text-gray-400 tracking-wider mb-6">Live BroadCasts</h2>
            <div className="bg-[#0a0a0c] border border-gray-800 rounded-lg p-12 text-center">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse mb-4 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
              <p className="text-gray-500 font-bold uppercase tracking-widest">Connecting to live streams...</p>
            </div>
          </div>
          </>
        )}
      </div>

      {/* ========================================== */}
      {/* MODALS RENDERED HERE AT THE BOTTOM         */}
      {/* ========================================== */}
      
      {isTrailerOpen && game.trailer_1 && (
        <TrailerModal 
          trailerUrl={game.trailer_1} 
          onClose={() => setIsTrailerOpen(false)} 
        />
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <CommunitySidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        roomType='GAME'             // Triggers the Django GAME logic
        contextId={game.id}         // Passes the specific Game ID
      />

    </div>
  );
};

export default GamePage;