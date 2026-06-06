import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../../services/api';
import { updateProfilePicture } from '../../../features/auth/userSlice';

const ProfileHeader = ({ profileData, fetchProfile }) => {
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const profilePicRef = useRef(null);
  const bannerPicRef = useRef(null);

  const handleImageUpload = async (event, fieldName) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const response = await api.patch('/accounts/profile/me/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      await fetchProfile(); 
      
      if (fieldName === 'profile_picture' && response.data.profile_picture) {
        dispatch(updateProfilePicture(response.data.profile_picture));
      }
    } catch (error) {
      console.error(`Failed to upload ${fieldName}`, error);
      alert("Image upload failed. Check the file size and format.");
    } finally {
      setIsUploading(false);
      event.target.value = null; 
    }
  };

  return (
    <>
      <input type="file" accept="image/*" ref={profilePicRef} className="hidden" onChange={(e) => handleImageUpload(e, 'profile_picture')} />
      <input type="file" accept="image/*" ref={bannerPicRef} className="hidden" onChange={(e) => handleImageUpload(e, 'banner_image')} />

      <div 
        onClick={() => !isUploading && bannerPicRef.current.click()}
        className="relative w-full h-48 md:h-64 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl group cursor-pointer"
      >
        {profileData.banner_image ? (
          <img src={profileData.banner_image} alt="Banner" className="w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 to-[#050505] group-hover:opacity-50 transition-opacity duration-500"></div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-black/70 px-4 py-2 rounded text-cyan-400 font-bold uppercase tracking-widest text-sm border border-cyan-500/50 backdrop-blur-sm">
            {isUploading ? 'Uploading...' : 'Update Banner Image'}
          </span>
        </div>
        
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex items-end gap-6">
          <div 
            onClick={(e) => { e.stopPropagation(); if (!isUploading) profilePicRef.current.click(); }}
            className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-[#0a0a0c] border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(8,145,178,0.4)] overflow-hidden relative group/avatar cursor-pointer hover:border-cyan-300 transition-colors duration-300 z-10"
          >
            {profileData.profile_picture ? (
              <img src={profileData.profile_picture} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:opacity-30 transition-opacity duration-300" />
            ) : (
              <span className="text-5xl md:text-7xl font-black text-cyan-500 uppercase z-10 group-hover/avatar:opacity-10 transition-opacity duration-300">
                {profileData.username.charAt(0)}
              </span>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 z-20">
              <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          
          <div className="mb-2 z-10">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest drop-shadow-lg">{profileData.username}</h1>
            <p className="text-cyan-400 text-sm md:text-base font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Registered Operative
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;