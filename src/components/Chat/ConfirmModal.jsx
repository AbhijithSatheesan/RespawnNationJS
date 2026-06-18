import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0a0f12] border border-gray-800 p-6 rounded-lg max-w-sm w-full shadow-2xl">
        <h3 className="text-red-400 font-black uppercase tracking-widest mb-2">
          {title || "Confirm Action"}
        </h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          {message || "Are you sure you want to proceed?"}
        </p>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded text-gray-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="px-4 py-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black text-xs font-black uppercase tracking-wider border border-red-500/20 hover:border-red-500 transition-all shadow-[0_0_10px_rgba(239,68,68,0)] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            Purge Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;