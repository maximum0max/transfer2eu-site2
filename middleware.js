// Vercel Edge Middleware — runs before the static/SPA response.
//
// Two jobs:
//   1. Recover / retire URLs from the previous (WordPress) site:
//        - old /zakaz-transfera/<slug> that still exists → 301 to the new /<slug>
//        - old driver form → 301 to /voditelyam
//        - everything else legacy (.html, /category, date archives) → 410 Gone
//   2. Canonicalise the host (www → apex) and strip the legacy ?amp param.
//
// The real pages (home, /marshruty, /price, /kontakty, /voditelyam, /novosti,
// /novosti/<slug>, and the /<routeSlug> pages) are NOT matched here, so they
// fall through to the SPA. Route slugs are inlined (not imported) to keep the
// edge bundle self-contained and impossible to break at build time. Keep this
// list in sync with ROUTE_GROUPS in BrandData.jsx.

const ROUTE_SLUGS = new Set([
  'taxi-aeroport-alicante', 'gran-alacant', 'san-juan-playa', 'santa-pola',
  'la-marina', 'los-balcones', 'el-campello', 'villajoyosa', 'la-nucia',
  'finestrat', 'taksi-alikante-benidorm', 'taksi-iz-alikante-v-kalpe', 'albir',
  'altea', 'playa-flamenca', 'quesada', 'guardamar', 'la-zenia', 'punta-prima',
  'transfer-alicante-torrevieja', 'cabo-roig', 'campoverde', 'orihuela',
  'mil-palmeras', 'pilar-de-la-horadada', 'san-pedro', 'taxi-alicante-murcia',
  'san-javier', 'los-alcazares', 'cartagena', 'taksi-alikante-la-manga', 'alcoy',
  'moraira', 'denia', 'javea', 'oliva', 'gandia', 'taxi-alicante-valencia',
  'madrid', 'barcelona', 'malaga',
]);

export const config = {
  matcher: '/((?!assets|fonts|uploads|_vercel|api|favicon|robots.txt|sitemap.xml).*)',
};

// Legacy URL shapes that are permanently gone (no modern equivalent).
const GONE = [
  /^\/category(\/|$)/,   // old taxonomy
  /^\/20\d\d\/\d{2}/,    // old date archives  /2026/04/20
  /\.html$/,             // old article pages  /novosti/....html
];

function gone() {
  return new Response('410 Gone — this page no longer exists.', {
    status: 410,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

export default function middleware(request) {
  const url = new URL(request.url);
  const p = url.pathname;

  // Old route URLs: /zakaz-transfera/<slug> → recover to /<slug> if it still
  // exists, otherwise it's gone.
  const zt = p.match(/^\/zakaz-transfera\/([^/]+)\/?$/);
  if (zt) {
    if (ROUTE_SLUGS.has(zt[1])) {
      url.pathname = '/' + zt[1];
      url.search = '';
      return Response.redirect(url.toString(), 301);
    }
    return gone();
  }
  if (p === '/zakaz-transfera' || p === '/zakaz-transfera/') return gone();

  // Old driver form → new drivers page.
  if (p === '/forma-dlya-voditelya') {
    url.pathname = '/voditelyam';
    url.search = '';
    return Response.redirect(url.toString(), 301);
  }

  // Permanently removed legacy URLs.
  if (GONE.some((re) => re.test(p))) return gone();

  // Drop the legacy ?amp duplicate param. NOTE: host (www <-> apex)
  // canonicalization is intentionally NOT done here — Vercel's primary-domain
  // setting owns that. Redirecting host in middleware too creates an infinite
  // loop whenever the platform redirects the opposite direction.
  if (url.searchParams.has('amp')) {
    url.searchParams.delete('amp');
    return Response.redirect(url.toString(), 301);
  }

  // Everything else continues to the SPA.
}
