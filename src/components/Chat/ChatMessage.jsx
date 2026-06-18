import React, { useState, useRef, useEffect } from 'react';

const ChatMessage = ({ msg, currentUserId, currentUser, isAdmin, onDelete }) => {
  // 1. LOCAL STATE FOR THE POPOVER
  const [showConfirm, setShowConfirm] = useState(false);
  const confirmRef = useRef(null);

  // VERIFY OWNERSHIP
  const isOwnMessage = Boolean(
    (currentUser && msg.sender_username === currentUser) || 
    (currentUserId && msg.sender_id && String(msg.sender_id) === String(currentUserId)) ||
    (currentUserId && msg.sender && String(msg.sender) === String(currentUserId))
  );

  const canDelete = isOwnMessage || isAdmin;

  // 2. CLICK-OUTSIDE DETECTION
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the popup is open, and the click happened outside of our ref boundary...
      if (confirmRef.current && !confirmRef.current.contains(event.target)) {
        setShowConfirm(false); // Close it!
      }
    };

    if (showConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup the listener when the component unmounts or state changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showConfirm]);

  return (
    <div className={`flex flex-col animate-fadeIn ${isOwnMessage ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[85%] rounded p-3 space-y-1 relative group ${
        isOwnMessage 
          ? 'bg-emerald-600/20 border border-emerald-500/30' 
          : 'bg-black/40 border border-gray-800'
      }`}>
        
        {/* Header Metadata */}
        <div className="flex justify-between items-center gap-4 text-[10px] font-bold pr-5">
          <span className={isOwnMessage ? 'text-emerald-400' : 'text-cyan-500/80'}>
            @{isOwnMessage ? 'You' : (msg.sender_username || `User_${msg.sender_id || msg.sender}`)}
          </span>
          <span className="text-gray-500">
            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Message Content */}
        <p className="text-sm text-gray-200 leading-relaxed break-words mt-1">
          {msg.text}
        </p>

        {/* 3. CONDITIONAL UI: Show Trash Icon OR the Confirm Popover */}
        {canDelete && !showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1 bg-[#0a0f12]/90 border border-gray-800 rounded shadow-md"
            title="Delete Message"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        {/* THE INLINE POPOVER */}
        {showConfirm && (
          <div 
            ref={confirmRef}
            className="absolute -top-2 right-0 bg-[#0a0f12] border border-red-500/40 p-2 rounded shadow-[0_5px_20px_rgba(0,0,0,0.8)] z-20 flex flex-col gap-1.5 min-w-[100px] animate-fadeIn backdrop-blur-md"
          >
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center border-b border-gray-800 pb-1">
              Purge?
            </span>
            <div className="flex justify-between gap-1.5 mt-0.5">
              <button 
                onClick={() => setShowConfirm(false)} 
                className="flex-1 py-1 bg-gray-800 hover:bg-gray-700 rounded text-[10px] text-white font-bold transition-colors"
              >
                No
              </button>
              <button 
                onClick={() => {
                  setShowConfirm(false);
                  onDelete(msg.id); // Execute the deletion
                }} 
                className="flex-1 py-1 bg-red-500/20 hover:bg-red-500 hover:text-black rounded text-[10px] text-red-500 font-black uppercase tracking-wider border border-red-500/30 hover:border-red-500 transition-all"
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;