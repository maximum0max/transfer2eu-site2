// Bilingual core (RU default, UK on the /uk/ URL prefix).
//
// Language is DERIVED FROM THE URL, exactly like `view` is — /uk/... is
// Ukrainian, everything else is Russian. That keeps each language independently
// linkable, bookmarkable and crawlable (Russian stays on its existing URLs, so
// no ranking regression; Ukrainian lives under /uk/ with its own hreflang).
//
// This module is imported by BOTH the browser bundle and the Node prerenderer
// (via Vite SSR), so it must not touch the DOM at import time — only inside
// functions guarded for `window`/`navigator`/`localStorage`.

import React from 'react';

export const LANGS = ['ru', 'uk'];
export const DEFAULT_LANG = 'ru';
export const LANG_PREFIX = { ru: '', uk: '/uk' };
const STORAGE_KEY = 't2_lang';

// Master switch for the Ukrainian version. While the translations are being
// filled in, this stays false so production is unchanged: no /uk pages are
// prerendered, the auto-redirect and the language switcher are inert, and no
// uk hreflang is advertised. Flipped to true in the final commit once every
// page has genuine Ukrainian content — then the whole /uk site goes live at once.
export const UK_ENABLED = true;

// Split a pathname into { lang, path } where `path` is the language-agnostic
// route (what router.parsePath resolves). "/uk/madrid" -> {uk, "/madrid"};
// "/uk" -> {uk, "/"}; "/madrid" -> {ru, "/madrid"}.
export function splitLang(pathname) {
  const p = pathname || '/';
  const m = p.match(/^\/uk(\/.*)?$/);
  if (m) return { lang: 'uk', path: m[1] || '/' };
  return { lang: 'ru', path: p };
}

// Prepend the language prefix. RU keeps bare paths; UK gets "/uk".
export function localizePath(path, lang) {
  const clean = path || '/';
  if (lang !== 'uk') return clean;
  return clean === '/' ? '/uk' : '/uk' + clean;
}

// Swap the language on a full pathname, keeping the same page.
export function switchLangPath(pathname, lang) {
  const { path } = splitLang(pathname);
  return localizePath(path, lang);
}

// First-visit language for the auto-switch: a saved manual choice wins; else the
// device's ordered language preferences decide (uk vs ru — whichever the user
// lists first). Everything else falls back to Russian. Guarded for SSR.
export function detectLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'ru' || saved === 'uk') return saved;
  } catch (_) { /* private mode / disabled storage */ }
  const nav = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language])) || [];
  for (const raw of nav) {
    const s = String(raw || '').toLowerCase();
    if (s.startsWith('uk')) return 'uk';
    if (s.startsWith('ru')) return 'ru';
  }
  return DEFAULT_LANG;
}

export function saveLang(lang) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(STORAGE_KEY, lang === 'uk' ? 'uk' : 'ru'); } catch (_) { /* ignore */ }
}

export function hasSavedLang() {
  if (typeof window === 'undefined') return false;
  try { const v = window.localStorage.getItem(STORAGE_KEY); return v === 'ru' || v === 'uk'; }
  catch (_) { return false; }
}

// --- React plumbing: current language flows down through context ------------
export const LangContext = React.createContext(DEFAULT_LANG);
export const useLang = () => React.useContext(LangContext);

// Pick the right string bundle for the current language, with RU fallback.
// Usage in a component:  const t = useT(STR);  ...  {t.book_now}
export function useT(bundles) {
  const lang = useLang();
  return (bundles && (bundles[lang] || bundles[DEFAULT_LANG])) || {};
}

// Non-hook variant for the prerenderer and helpers that already know the lang.
export const pick = (bundles, lang) =>
  (bundles && (bundles[lang] || bundles[DEFAULT_LANG])) || {};
