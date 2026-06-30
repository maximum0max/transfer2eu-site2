import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './colors_and_type.css'

// The legacy /#registro link now opens the standalone form page (/anketa).
// Rewrite it before mount so the app renders the form straight away.
if (window.location.hash === '#registro') {
  window.history.replaceState({}, '', '/anketa');
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
