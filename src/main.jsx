import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import { Provider } from 'react-redux';           
import { GoogleOAuthProvider } from '@react-oauth/google'; // 1. IMPORT THE PROVIDER
import store from './app/store';                  
import App from './App';
import './index.css';


const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {/* 3. WRAP THE APP IN THE PROVIDER AND PASS THE ID */}
        <GoogleOAuthProvider clientId={googleClientId}>
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);