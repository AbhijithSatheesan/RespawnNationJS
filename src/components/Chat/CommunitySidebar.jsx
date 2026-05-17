import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { createClient } from '@supabase/supabase-js';
import api from '../../services/api';
import { GET_CHAT_ROOM, CHAT_ROOM_HISTORY, SEND_CHAT } from '../../services/apiRoutes';

// Import Login Modal so the Sidebar can act as its own security bouncer
import LoginModal from '../../features/auth/LoginModal';

// Initialize Supabase Client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CommunitySidebar = ({ isOpen, onClose, roomType = 'GLOBAL', contextId = null }) => {
  
  // 1. GRAB FULL AUTH STATE FROM REDUX
  const { token, userInfo } = useSelector((state) => state.user);
  const currentUser = userInfo?.username;
  const currentUserId = userInfo?.id; // Now safely populated by your Redux update!

  const [roomId, setRoomId] = useState(null);
  const [roomName, setRoomName] = useState('Initializing Hub...');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for the intercepted Login Modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const messageEndRef = useRef(null);
  
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ==========================================
  // THE MASTER HISTORY & AUTH CONTROLLER
  // ==========================================
  useEffect(() => {
    if (!isOpen) return;

    // THE BOUNCER: If user isn't logged in, intercept the open request!
    if (!token) {
      setIsLoginModalOpen(true); 
      onCloseRef.current();      
      return;                    
    }

    // 1. When sidebar opens, push a "fake" page to the browser history
    window.history.pushState({ isSidebarOpen: true }, '');

    const handlePopState = (event) => {
      onCloseRef.current();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') requestClose();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      
      if (window.history.state?.isSidebarOpen) {
        window.history.back();
      }
    };
  }, [isOpen, token]);

  const requestClose = () => {
    if (window.history.state?.isSidebarOpen) {
      window.history.back(); 
    } else {
      onCloseRef.current(); 
    }
  };

  // ==========================================
  // PHASE 1: Fetch Room & History
  // ==========================================
  useEffect(() => {
    if (!isOpen || !token) return; 

    const initializeChat = async () => {
      setIsLoading(true);
      try {
        const params = { type: roomType };
        if (roomType === 'GAME') params.game_id = contextId;
        if (roomType === 'TOURNAMENT') params.tournament_id = contextId;

        const roomRes = await api.get(GET_CHAT_ROOM, { params });
        const targetRoomId = roomRes.data.room_id;
        
        setRoomId(targetRoomId);
        setRoomName(roomRes.data.name);

        const historyRes = await api.get(CHAT_ROOM_HISTORY(targetRoomId));
        setMessages(historyRes.data);

      } catch (err) {
        console.error("Failed to load secure chat environment", err);
        setRoomName("ACCESS ERROR");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [isOpen, roomType, contextId, token]);

  // ==========================================
  // PHASE 2: Open WebSocket Tunnel
  // ==========================================
  useEffect(() => {
    if (!roomId || !isOpen || !token) return;

    const channel = supabase
      .channel(`room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_chatmessage',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          setMessages((prev) => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, isOpen, token]);

  // ==========================================
  // PHASE 3: Send Messages
  // ==========================================
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !roomId) return;

    const currentText = inputText;
    setInputText(''); 

    try {
      await api.post(SEND_CHAT(roomId), { text: currentText });
    } catch (err) {
      console.error("Message drop detected", err);
    }
  };

  return (
    <>
      {/* BACKGROUND BLUR OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm z-[90] animate-fadeIn cursor-pointer" 
          onClick={requestClose} 
          aria-label="Close sidebar overlay"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#070b0d] border-l border-emerald-500/20 z-[100] transform transition-transform duration-500 ease-out flex flex-col font-mono text-white ${
        isOpen ? 'translate-x-0 shadow-[-10px_0_30px_rgba(16,185,129,0.1)]' : 'translate-x-full'
      }`}>
        
        {/* HEADER */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0f12]">
          <div>
            <h2 className="text-emerald-400 font-black tracking-widest uppercase">{roomName}</h2>
            <p className="text-[10px] text-gray-500 tracking-wider uppercase">// SECURE_WEBSOCKET_TUNNEL</p>
          </div>
          <button onClick={requestClose} className="text-gray-500 hover:text-white transition-colors p-2 text-xl font-bold">
            ✕
          </button>
        </div>

        {/* CHAT MESSAGES DISPLAY */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4 custom-scrollbar bg-[#05080a]">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
               <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
               <span className="text-xs text-emerald-500/50 animate-pulse uppercase tracking-widest">
                Initializing Secure Stream...
               </span>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              
              // =========================================================
              // THE BULLETPROOF ID FIX
              // =========================================================
              // By checking if currentUserId/currentUser actually exist first, 
              // we prevent 'undefined === undefined' from matching true.
              const isOwnMessage = Boolean(
                (currentUser && msg.sender_username === currentUser) || 
                (currentUserId && msg.sender_id && String(msg.sender_id) === String(currentUserId)) ||
                (currentUserId && msg.sender && String(msg.sender) === String(currentUserId))
              );

              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col animate-fadeIn ${isOwnMessage ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded p-3 space-y-1 ${
                    isOwnMessage 
                      ? 'bg-emerald-600/20 border border-emerald-500/30' 
                      : 'bg-black/40 border border-gray-800'
                  }`}>
                    <div className="flex justify-between items-center gap-4 text-[10px] font-bold">
                      <span className={isOwnMessage ? 'text-emerald-400' : 'text-cyan-500/80'}>
                        @{isOwnMessage ? 'You' : (msg.sender_username || `User_${msg.sender_id || msg.sender}`)}
                      </span>
                      <span className="text-gray-500">
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed break-words mt-1">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <span className="text-3xl mb-2 grayscale">💬</span>
              <p className="text-xs uppercase tracking-widest font-bold">Channel Quiet</p>
              <p className="text-[10px] mt-1 text-gray-400">Send a broadcast to initialize timeline.</p>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>

        {/* FOOTER INTERFACE */}
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-800 bg-[#0a0f12] flex gap-3">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your transmission..."
            className="flex-grow bg-black border border-gray-800 rounded px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-emerald-500/50 transition-colors"
            disabled={isLoading || !roomId}
          />
          <button 
            type="submit"
            disabled={isLoading || !roomId || !inputText.trim()}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-800 disabled:text-gray-500 text-black font-black uppercase text-xs tracking-widest px-6 rounded shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
          >
            Send
          </button>
        </form>
      </div>

      {/* THE BOUNCER MODAL */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default CommunitySidebar;