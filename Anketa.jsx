import React from 'react'
// Standalone, unlisted page that embeds the Google Form full-screen — no
// header, no footer, just the form. It is not linked anywhere on the site and
// is marked noindex (see seo.jsx), so only people who receive the /anketa link
// reach it. Whether the form itself accepts a given visitor is controlled by
// the form's own sharing settings in Google Forms.
//
// Embed URL is the form's /viewform with ?embedded=true. If you ever swap the
// form, replace the id below with the one from its edit URL
// (docs.google.com/forms/d/<THIS_ID>/edit).
const FORM_ID = '1evibPRhpRyV626byAl4EIgCHZI0mK1E0TxLhxcJA_dw';
const FORM_SRC = `https://docs.google.com/forms/d/${FORM_ID}/viewform?embedded=true`;

export default function Anketa() {
  return (
    <iframe
      title="Анкета"
      src={FORM_SRC}
      loading="eager"
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        border: 0, background: '#fff',
      }}
    >
      Загрузка формы…
    </iframe>
  );
}
