"""
Entry point for the Transfer2EU news bot.

Run by GitHub Actions on a cron schedule (every 2 days), or locally for testing:
    cd news-bot
    pip install -r requirements.txt
    # set OPENAI_API_KEY in news-bot/.env (see .env.example)
    python main.py

On each run, for each category (travel, cars) it picks the newest unprocessed
articles, rewrites them into Russian, and prepends them to ../News.data.json.
"""
import logging
import sys

from dotenv import load_dotenv

# Load .env for local runs. In GitHub Actions, env vars come from secrets.
load_dotenv()

from config import FEEDS_BY_CATEGORY, MAX_POSTS_PER_CATEGORY
from feeds import get_new_articles, load_processed, load_recent_sources, mark_processed
from publisher import publish_post
from rewriter import ArticleSkipped, rewrite_article

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("transfer2eu-news-bot")


def run() -> int:
    log.info("=" * 60)
    log.info("Transfer2EU news bot starting")

    processed = load_processed()
    recent_sources = load_recent_sources()
    log.info(
        f"State: {len(processed)} articles previously processed; "
        f"recent source rotation = {recent_sources or '(empty)'}"
    )

    total_posted = 0
    for category, feeds in FEEDS_BY_CATEGORY.items():
        limit = MAX_POSTS_PER_CATEGORY.get(category, 1)
        log.info("-" * 50)
        log.info(f"Category '{category}': target up to {limit} post(s)")

        # Re-read state each category so rotation/processed reflect this run.
        candidates = get_new_articles(feeds, load_processed(), load_recent_sources())
        if not candidates:
            log.info(f"No new articles for '{category}'.")
            continue

        posted = 0
        for article in candidates:
            if posted >= limit:
                break

            url, title = article["url"], article["title"]
            log.info(f"Processing [{category}]: {title}")
            log.info(f"  URL: {url}")

            try:
                rewritten = rewrite_article(
                    title=title,
                    content=article["content"],
                    url=url,
                    category=category,
                )
            except ArticleSkipped as e:
                log.info(f"Skipped (not relevant): {e}")
                mark_processed(url)  # never re-evaluate an irrelevant article
                continue
            except Exception as e:
                log.error(f"Rewrite failed: {e}", exc_info=True)
                mark_processed(url)  # don't keep retrying a bad article
                continue

            try:
                slug = publish_post(rewritten)
            except Exception as e:
                log.error(f"Publish failed: {e}", exc_info=True)
                continue  # don't mark processed — retry next run

            mark_processed(url, source_host=article.get("source_host"))
            log.info(f"✓ Published [{category}] '{slug}': {rewritten['title']}")
            posted += 1
            total_posted += 1

    log.info("=" * 60)
    log.info(f"Run complete. Posted {total_posted} article(s).")
    return 0


if __name__ == "__main__":
    sys.exit(run())
