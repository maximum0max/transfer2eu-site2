# Transfer2EU news bot

A small Python bot that auto-publishes news to the Transfer2EU site. It mirrors
the approach of the `car-news-agent` project, adapted for this **static** site:

```
RSS feeds  →  full article text  →  OpenAI rewrite (Russian)  →  ../News.data.json
 (feeds.py)     (trafilatura)         (rewriter.py, gpt-4o)        (publisher.py)
```

Unlike the car project (which posts to WordPress), this bot writes posts into
`../News.data.json` — the file the site reads at build time (`../News.data.jsx`).
The GitHub Actions workflow commits that file, and the host rebuilds the site.

## Topics

Two categories, mixed each run (`config.py`):

- **travel** — Spain / Costa Blanca / Alicante travel & expat news (the audience).
- **cars** — European car news.

Each article passes a relevance gate in the rewriter; anything with no angle for
a Russian-speaking traveller/expat is skipped (and never re-evaluated).

## Schedule

`.github/workflows/news-bot.yml` runs every 2 days (`cron: "0 9 */2 * *"`) and on
manual dispatch. Tune volume with `MAX_POSTS_PER_CATEGORY` in `config.py`.

## Run locally

```bash
cd news-bot
python -m venv .venv && .venv/Scripts/activate   # Windows; use source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env        # then put your real OPENAI_API_KEY in .env
python main.py
```

New posts appear in `../News.data.json`. Run `npm run dev` from the site root to
see them on the News page.

## Files

| File | Role |
|---|---|
| `config.py` | Feeds, model, per-run limits |
| `feeds.py` | RSS parsing, full-text fetch, processed-URL state + source rotation |
| `rewriter.py` | OpenAI rewrite → Russian, block-shaped body, relevance gate |
| `publisher.py` | Prepend the post to `../News.data.json` |
| `main.py` | Orchestrates a run across categories |
| `data/processed.json` | State: URLs already done + recent-source rotation |

## State

`data/processed.json` tracks which source URLs have been published so the same
article is never reposted. It's committed by the workflow on every run — don't
delete it, or the bot may republish old articles.
