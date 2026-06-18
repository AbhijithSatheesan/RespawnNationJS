import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast'; 

import api from '../../services/api';
import { GET_CHAT_ROOM, CHAT_ROOM_HISTORY, SEND_CHAT, DELETE_CHAT } from '../../services/apiRoutes';

import LoginModal from '../../features/auth/LoginModal';
import ChatMessage from './ChatMessage'; 

// Initialize Supabase Client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CommunitySidebar = ({ isOpen, onClose, roomType = 'GLOBAL', contextId = null }) => {
  
  // 1. SECURE REDUX EXTRACTION
  const { token, userInfo } = useSelector((state) => state.user);
  const currentUser = userInfo?.username;
  const currentUserId = userInfo?.id; 
  const isAdmin = userInfo?.is_admin; 

  // 2. CHAT & PAGINATION STATE
  const [roomId, setRoomId] = useState(null);
  const [roomName, setRoomName] = useState('Initializing Hub...');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 3. BOUNCER CONTROLS
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // 4. REF POINTERS (For Scroll Control Math)
  const messageEndRef = useRef(null);
  const chatFeedRef = useRef(null); 
  const onCloseRef = useRef(onClose);
  
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ==========================================
  // URL HISTORY & ACCESS BOUNCER
  // ==========================================
  useEffect(() => {
    if (!isOpen) return;

    if (!token) {
      setIsLoginModalOpen(true); 
      onCloseRef.current();      
      return;                    
    }

    window.history.pushState({ isSidebarOpen: true }, '');
    const handlePopState = () => { onCloseRef.current(); };
    const handleKeyDown = (e) => { if (e.key === 'Escape') requestClose(); };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      if (window.history.state?.isSidebarOpen) window.history.back();
    };
  }, [isOpen, token]);

  const requestClose = () => {
    if (window.history.state?.isSidebarOpen) window.history.back(); 
    else onCloseRef.current(); 
  };

  // ==========================================
  // PHASE 1: Fetch Room & Initial History
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

        // Access Archive Block 1 (Page 1)
        const historyRes = await api.get(`${CHAT_ROOM_HISTORY(targetRoomId)}?page=1`);
        setMessages(historyRes.data.results);
        setHasMore(historyRes.data.has_more); 
        setPage(1);
        
        setTimeout(scrollToBottom, 100);

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
  // PHASE 1.5: Pagination (Load Previous Records)
  // ==========================================
  const loadPreviousMessages = async () => {
    if (!roomId || !hasMore) return;
    
    setIsLoadingMore(true);
    const nextPage = page + 1;
    
    // Trap current scroll parameters to prevent visual screen jumping on render
    const currentScrollHeight = chatFeedRef.current.scrollHeight;

    try {
      const res = await api.get(`${CHAT_ROOM_HISTORY(roomId)}?page=${nextPage}`);
      const olderMessages = res.data.results;
      
      setMessages((prev) => [...olderMessages, ...prev]); 
      setHasMore(res.data.has_more);
      setPage(nextPage);

      // Readjust scroll anchors cleanly
      setTimeout(() => {
        if (chatFeedRef.current) {
          const newScrollHeight = chatFeedRef.current.scrollHeight;
          chatFeedRef.current.scrollTop = newScrollHeight - currentScrollHeight;
        }
      }, 0);

    } catch (err) {
      console.error("Pagination block processing failed", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // ==========================================
  // PHASE 2: WebSocket Tunnel (Realtime Listener)
  // ==========================================
  useEffect(() => {
    if (!roomId || !isOpen || !token) return;

    const channel = supabase
      .channel(`room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERTS and UPDATES natively
          schema: 'public',
          table: 'chat_chatmessage',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => {
              if (prev.some(m => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
            setTimeout(scrollToBottom, 100);
          } 
          else if (payload.eventType === 'UPDATE') {
            // SOFT DELETE INTERCEPT: Catch mutation event from other clients
            if (payload.new.is_deleted === true) {
              setMessages((prev) => prev.filter((m) => m.id !== payload.new.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, isOpen, token]);

  // ==========================================
  // PHASE 3: Transmission Dispatches
  // ==========================================
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !roomId) return;

    const currentText = inputText;
    setInputText(''); 

    try {
      await api.post(SEND_CHAT(roomId), { text: currentText });
    } catch (err) {
      console.error("Transmission dropped by network", err);
      toast?.error("Failed to route transmission.");
    }
  };

  // ==========================================
  // PHASE 4: Optimistic Data Purges
  // ==========================================
  const executeDelete = async (targetId) => {
    // OPTIMISTIC UPDATE: Instant execution feedback loop
    setMessages((prev) => prev.filter((m) => m.id !== targetId));
    
    try {
      await api.delete(DELETE_CHAT(targetId)); 
    } catch (err) {
      console.error("Purge instruction rejected by core engine", err);
      toast?.error("Purge failed. Access validation error.");
    } 
  };

  // ==========================================
  // VIEW ENGINE
  // ==========================================
  return (
    <>
      {/* BACKGROUND OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm z-[90] animate-fadeIn cursor-pointer" 
          onClick={requestClose} 
        />
      )}

      {/* PANEL INTERFACE */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#070b0d] border-l border-emerald-500/20 z-[100] transform transition-transform duration-500 ease-out flex flex-col font-mono text-white ${
        isOpen ? 'translate-x-0 shadow-[-10px_0_30px_rgba(16,185,129,0.1)]' : 'translate-x-full'
      }`}>
        
        {/* HEADER BLOCK */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0f12]">
          <div>
            <h2 className="text-emerald-400 font-black tracking-widest uppercase">{roomName}</h2>
            <p className="text-[10px] text-gray-500 tracking-wider uppercase">// SECURE_WEBSOCKET_TUNNEL</p>
          </div>
          <button onClick={requestClose} className="text-gray-500 hover:text-white transition-colors p-2 text-xl font-bold">
            ✕
          </button>
        </div>

        {/* MESSAGES VIEWPORT */}
        <div ref={chatFeedRef} className="flex-grow p-6 overflow-y-auto space-y-4 custom-scrollbar bg-[#05080a]">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
               <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
               <span className="text-xs text-emerald-500/50 animate-pulse uppercase tracking-widest">
                Initializing Secure Stream...
               </span>
            </div>
          ) : (
            <>
              {/* HISTORICAL RECORDS DISCOVERY ACTION */}
              {hasMore && (
                <div className="flex justify-center pb-4">
                  <button 
                    onClick={loadPreviousMessages}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 bg-[#0a0f12] border border-gray-800 hover:border-emerald-500/50 text-emerald-500/80 hover:text-emerald-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest transition-all"
                  >
                    {isLoadingMore ? "Accessing Archives..." : "↑ Load Previous"}
                  </button>
                </div>
              )}

              {/* DYNAMIC TIMELINE RECONSTRUCTION */}
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id} 
                    msg={msg} 
                    currentUserId={currentUserId}
                    currentUser={currentUser}
                    isAdmin={isAdmin}
                    onDelete={executeDelete} 
                  />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <span className="text-3xl mb-2 grayscale">💬</span>
                  <p className="text-xs uppercase tracking-widest font-bold">Channel Quiet</p>
                  <p className="text-[10px] mt-1 text-gray-400">Send a broadcast to initialize timeline.</p>
                </div>
              )}
              <div ref={messageEndRef} />
            </>
          )}
        </div>

        {/* INPUT INTERFACE */}
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

      {/* AUTH GATE */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default CommunitySidebar;