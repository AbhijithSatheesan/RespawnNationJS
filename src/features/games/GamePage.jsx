import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom'; 
import { useSelector } from 'react-redux'; 
import api from '../../services/api';
import { django_media_url } from '../../services/BackendConfig';
import { GAME_DETAILS } from '../../services/apiRoutes';
import TabTournaments from './gamepagecomponents/TabTournaments';
import TabStreams from './gamepagecomponents/TabStreams';

import GameHero from './gamepagecomponents/GameHero';
import GameTabs from './gamepagecomponents/GameTabs';
import TabAbout from './gamepagecomponents/TabAbout';
import TrailerModal from './gamepagecomponents/TrailerModal';

import LoginModal from '../auth/LoginModal'; 
import CommunityBar from '../Welcome/Components/CommunityBar';
import CommunitySidebar from '../../components/Chat/CommunitySidebar';

const GamePage = () => {
  const { id } = useParams();
  
  // URL-Bound Tab State
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'about';

  const { userInfo, token } = useSelector((state) => state.user);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Modal States
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

  // Safely update the URL when changing tabs without trapping the Back button
  const handleTabChange = (tabId) => {
    if (activeTab === tabId) return;
    
    // { replace: true } prevents adding a new page to the browser history!
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const handleCommunityClick = () => {
    if (!token && !userInfo) {
      setIsLoginModalOpen(true); 
    } else {
      setIsChatOpen(true);       
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
      <div className="w-full max-w-4xl mx-auto px-6 mt-8 mb-4">
        <CommunityBar onClick={handleCommunityClick} />
      </div>

      {/* Pass the URL-bound state handlers to GameTabs */}
      <GameTabs activeTab={activeTab} setActiveTab={handleTabChange} />

      <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        {activeTab === 'about' && <TabAbout game={game} />}
        
        {activeTab === 'tournaments' && (
          <TabTournaments gameId={game.id} />
        )}

        {activeTab === 'streams' && (
          <TabStreams gameId={game.id} game_image={bgImage} />
        )}
      </div>

      {/* MODALS RENDERED AT THE BOTTOM */}
      
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
        roomType='GAME'             
        contextId={game.id}         
      />

    </div>
  );
};

export default GamePage;