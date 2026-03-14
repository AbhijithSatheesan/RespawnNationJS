// services/TechBackGround/AppLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import TechBackground from './TechBackground';

const AppLayout = () => {
  return (
    /* We wrap the Outlet inside TechBackground.
      This puts the page content into the specific "z-10" layer 
      we created inside TechBackground, fixing the scroll issue.
    */
    <TechBackground>
      <Outlet />
    </TechBackground>
  );
};

export default AppLayout;