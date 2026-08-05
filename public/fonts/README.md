# Fonts

Transfer2EU uses three free, Cyrillic-complete typefaces, **self-hosted as woff2** in this folder and declared via `@font-face` at the top of `colors_and_type.css` (`font-display: swap`). The old Google Fonts `@import` was removed — no third-party font request, faster LCP, and no EU/GDPR font-hotlink concern. The hero (Onest 800) and body (Inter 400) Cyrillic files are `<link rel="preload">`ed in `index.html`.

| Family | Role | Weights used | Cyrillic | License |
|---|---|---|---|---|
| **Onest** | Display / headlines | 400, 500, 600, 700, 800 | ✅ Native (designed in RU) | OFL |
| **Inter** | Body / UI / labels | 400, 500, 600, 700 | ✅ Full | OFL |
| **JetBrains Mono** | Code, ticket nos., timestamps | 400, 500 | ✅ Full | OFL |

Files are named `<family>-<weight>-<subset>.woff2` (e.g. `onest-800-cyrillic.woff2`), one per weight × subset. Subsets bundled: **latin, latin-ext, cyrillic** — enough for Russian copy plus Spanish/English place names. Each `@font-face` keeps Google's original `unicode-range`, so the browser downloads only the subset a page actually needs.

> ⚠️ **Substitution note.** No bespoke brand font was provided. Onest was chosen because it was designed for Cyrillic-first products (good for a Russian-primary site) and pairs cleanly with Inter. If Transfer2EU has a brand font, drop its woff2 files here and update the `@font-face` rules in `colors_and_type.css`.

## Regenerating the woff2 files

If weights/subsets change, re-fetch from Google Fonts with a modern-browser UA (so you get woff2, not ttf) and download each `url()` it lists:

```
curl -A "Mozilla/5.0 ... Chrome/120" \
  "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
```

Keep only the `latin`, `latin-ext`, `cyrillic` blocks, save each font as `<family>-<weight>-<subset>.woff2` here, and mirror the `@font-face` rules (with `unicode-range`) into `colors_and_type.css`.
