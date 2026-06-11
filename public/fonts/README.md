# Fonts

Transfer2EU uses three free, Cyrillic-complete typefaces, currently delivered via the **Google Fonts CDN** (see `@import` at the top of `colors_and_type.css`). No font files are bundled in this folder yet — swap to self-hosted woff2 if/when needed for performance or offline.

| Family | Role | Weights used | Cyrillic | License |
|---|---|---|---|---|
| **Onest** | Display / headlines | 400, 500, 600, 700, 800 | ✅ Native (designed in RU) | OFL |
| **Inter** | Body / UI / labels | 400, 500, 600, 700 | ✅ Full | OFL |
| **JetBrains Mono** | Code, ticket nos., timestamps | 400, 500 | ✅ Full | OFL |

> ⚠️ **Substitution note.** No bespoke brand font was provided. Onest was chosen because it was designed for Cyrillic-first products (good for a Russian-primary site) and pairs cleanly with Inter. If Transfer2EU has a brand font, drop the woff2 files here and update the `@font-face` rules in `colors_and_type.css`.

## To self-host (recommended for production)

1. Download the families from Google Fonts → "Get embed code" → "Download family".
2. Drop `Onest-*.woff2`, `Inter-*.woff2`, `JetBrainsMono-*.woff2` into this folder.
3. Replace the `@import` line in `colors_and_type.css` with `@font-face` blocks pointing at `./fonts/<file>.woff2`.
