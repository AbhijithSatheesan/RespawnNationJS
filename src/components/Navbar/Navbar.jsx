import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginModal from '../../features/auth/LoginModal';
// Make sure this path points to your actual userSlice!
import { logout } from '../../features/auth/userSlice'; 

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.user);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- THE FIXED LOGOUT FUNCTION ---
  const handleLogout = () => {
    // 1. Wipe the tokens from the browser memory
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    
    // 2. Tell Redux to clear the user state
    dispatch(logout());
    
    // 3. Close the menu and send them to the home page
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-gray-800 h-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_10px_rgba(8,145,178,0.5)]">
              RESPAWN<span className="text-cyan-500">NATION</span>
            </Link>
            
            <div className="hidden md:flex gap-6">
              <Link to="/browse" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors">Games</Link>
              <Link to="/tournament" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors">Tournaments</Link>
              <Link to="/live" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors">Live</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!userInfo ? (
              /* ONLY ONE BUTTON NOW */
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 text-xs font-black uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] hover:shadow-[0_0_20px_rgba(8,145,178,0.6)]"
              >
                Log In
              </button>
            ) : (
              <div className="flex items-center gap-4" ref={dropdownRef}>
                <div className="hidden sm:flex flex-col items-end mr-2">
                  {/* <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Wallet</span> */}
                  {/* <span className="text-sm font-black text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.3)]">
                    ₹{userInfo.wallet_balance || "0.00"}
                  </span> */}
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 rounded bg-gray-800 border border-gray-700 hover:border-cyan-500 flex items-center justify-center overflow-hidden transition-all duration-300 group"
                  >
                    <span className="text-cyan-500 font-black uppercase text-lg group-hover:scale-110 transition-transform">
                      {userInfo.username ? userInfo.username.charAt(0) : '?'}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-[#0a0a0c] border border-gray-800 rounded shadow-2xl py-2 animate-fadeIn origin-top-right">
                      <div className="px-4 py-2 border-b border-gray-800/50 mb-2">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{userInfo.username}</p>
                      </div>
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:bg-gray-800 hover:text-cyan-400">My Profile</Link>
                      <div className="border-t border-gray-800/50 mt-2 pt-2">
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-800 hover:text-red-500">Log Out</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;