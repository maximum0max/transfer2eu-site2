// News posts live in News.data.json — that file is machine-written by the
// news bot (news-bot/) and committed by the GitHub Actions workflow. Editing
// posts by hand? Edit the JSON, not this file.
//
// Each post has the shape:
//   { slug, title, date, excerpt, url, body }
// where `body` is either null (NewsPost renders a link to the source URL) or an
// array of typed blocks: { type: 'p' | 'h2' | 'h3' | 'ul', text/items: ... }.
//
// Vite imports JSON natively, so the static site bundles whatever the bot last
// committed at build time.
import posts from './News.data.json';

export const NEWS_POSTS = Array.isArray(posts) ? posts : [];

// Localized access to a post field. Ukrainian posts carry parallel `<key>_uk`
// fields (title_uk, excerpt_uk, seoTitle_uk, body_uk); when asked for Ukrainian
// we use them, otherwise we fall back to the original Russian field.
export const newsField = (post, key, lang) =>
  (post && lang === 'uk' && post[`${key}_uk`] != null ? post[`${key}_uk`] : (post ? post[key] : undefined));
