import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './colors_and_type.css'
import { splitLang, localizePath, detectLang, hasSavedLang, UK_ENABLED } from './i18n.jsx'

// The legacy /#registro link now opens the standalone form page (/anketa).
// Rewrite it before mount so the app renders the form straight away.
if (window.location.hash === '#registro') {
  window.history.replaceState({}, '', '/anketa');
}

// First-visit language auto-switch — done before mount so there's no flash of
// the wrong language. Only when the visitor is on a bare (RU) URL, hasn't picked
// a language before, and their device prefers Ukrainian. A crawler (device lang
// en/none) stays on RU and reaches /uk via hreflang, so nothing is hidden.
(() => {
  if (!UK_ENABLED) return;
  const { lang, path } = splitLang(window.location.pathname);
  if (lang === 'ru' && path !== '/anketa' && !hasSavedLang() && detectLang() === 'uk') {
    window.history.replaceState({}, '', localizePath(path, 'uk') + window.location.search + window.location.hash);
  }
})();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
