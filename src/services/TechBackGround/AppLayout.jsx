// src/services/TechBackGround/AppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import TechBackground from './TechBackground';
import Navbar from '../../components/Navbar/Navbar';

const AppLayout = () => {
  return (
    <TechBackground>
      {/* 1. The Navbar sits at the top of the entire app */}
      <Navbar />

      {/* 2. pt-16 pushes the child pages down so the Navbar doesn't cover their titles */}
      <main className="pt-16"> 
        <Outlet />
      </main>
    </TechBackground>
  );
};

export default AppLayout;




// // services/TechBackGround/AppLayout.js
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import TechBackground from './TechBackground';

// const AppLayout = () => {
//   return (
//     /* We wrap the Outlet inside TechBackground.
//       This puts the page content into the specific "z-10" layer 
//       we created inside TechBackground, fixing the scroll issue.
//     */
//     <TechBackground>
//       <Outlet />
//     </TechBackground>
//   );
// };

// export default AppLayout;