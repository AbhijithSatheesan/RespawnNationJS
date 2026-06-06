import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginModal from '../../features/auth/LoginModal';
import { logout } from '../../features/auth/userSlice'; 
import SearchBar from '../../features/games/SearchBar';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.user);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('id');
    
    dispatch(logout());
    
    setIsDropdownOpen(false);
    navigate('/');
  };

  // --- ONSITE CLOUDINARY IMAGE OPTIMIZER ---
  const getOptimizedAvatar = (url) => {
    if (!url) return null;
    
    // Check if it's a Cloudinary asset and contains the standard /upload/ segment
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      const parts = url.split('/upload/');
      // Inject parameters: width 80, height 80, crop fill, smart face gravity, auto quality & format
      return `${parts[0]}/upload/w_80,h_80,c_fill,g_face,q_auto,f_auto/${parts[1]}`;
    }
    
    return url; // Fallback to original url if local or untransformed
  };

  const optimizedAvatarUrl = userInfo ? getOptimizedAvatar(userInfo.profile_picture) : null;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          
          {/* --- LEFT SIDE: LOGO & LINKS --- */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_10px_rgba(8,145,178,0.5)]">
              RESPAWN<span className="text-cyan-500">NATION</span>
            </Link>
            
            <div className="hidden lg:flex gap-6">
              <Link to="/browse" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors">Games</Link>
              <Link to="/tournament" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors">Tournaments</Link>
              <Link to="/live" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors">Live</Link>
            </div>
          </div>

          {/* --- CENTER: DESKTOP SEARCH BAR --- */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
          </div>

          {/* --- RIGHT SIDE: AUTH, PROFILE, & MOBILE SEARCH TOGGLE --- */}
          <div className="flex items-center gap-4">
            
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden text-gray-400 hover:text-cyan-400 p-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {!userInfo ? (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 md:px-6 py-2 text-xs font-black uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] hover:shadow-[0_0_20px_rgba(8,145,178,0.6)]"
              >
                Log In
              </button>
            ) : (
              <div className="flex items-center gap-4" ref={dropdownRef}>
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-8 h-8 md:w-10 md:h-10 rounded bg-gray-800 border border-gray-700 hover:border-cyan-500 flex items-center justify-center overflow-hidden transition-all duration-300 group shadow-lg"
                  >
                    {/* --- CONDITIONALLY RENDER IMAGE OR TEXT FALBACK --- */}
                    {optimizedAvatarUrl ? (
                      <img 
                        src={optimizedAvatarUrl} 
                        alt={userInfo.username} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-cyan-500 font-black uppercase text-base md:text-lg group-hover:scale-110 transition-transform duration-300">
                        {userInfo.username ? userInfo.username.charAt(0) : '?'}
                      </span>
                    )}
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

        {/* --- MOBILE SEARCH DROPDOWN ROW --- */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-4 animate-fadeIn">
            <SearchBar />
          </div>
        )}

      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;