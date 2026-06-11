"""
Publish a rewritten post into the static site's News.data.json.

This replaces the car project's wordpress.py: instead of POSTing to a WP REST
API, we prepend the new post to the JSON array the site reads at build time
(see ../News.data.jsx). The GitHub Actions workflow commits the file, and the
host rebuilds — so the post goes live.
"""
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

log = logging.getLogger(__name__)

# ../News.data.json relative to this file (news-bot/ -> site root).
POSTS_PATH = Path(__file__).resolve().parent.parent / "News.data.json"

RU_MONTHS = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
]


def _today_ru() -> str:
    """Russian date string like '11 июня 2026' for the post's `date` field."""
    now = datetime.now(timezone.utc)
    return f"{now.day} {RU_MONTHS[now.month - 1]} {now.year}"


def _load_posts() -> list[dict[str, Any]]:
    if not POSTS_PATH.exists():
        return []
    try:
        with POSTS_PATH.open("r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError) as e:
        log.warning(f"Could not read {POSTS_PATH.name}: {e}. Starting fresh.")
        return []


def _unique_slug(slug: str, existing: set[str]) -> str:
    """Ensure slug doesn't collide with an already-published post."""
    if slug not in existing:
        return slug
    n = 2
    while f"{slug}-{n}" in existing:
        n += 1
    return f"{slug}-{n}"


def publish_post(rewritten: dict[str, Any]) -> str:
    """
    Prepend the rewritten post to News.data.json (newest first) and write it
    back. Returns the final slug used.
    """
    posts = _load_posts()
    existing_slugs = {p.get("slug") for p in posts if isinstance(p, dict)}

    slug = _unique_slug(rewritten["slug"], existing_slugs)

    body = list(rewritten["body"])
    # Source attribution as the last block (the site renders body text as plain
    # text, so this is a readable credit line rather than a hyperlink).
    body.append({
        "type": "p",
        "text": f"Источник: {rewritten['source_title']}",
    })

    post = {
        "slug": slug,
        "title": rewritten["title"],
        "date": _today_ru(),
        "excerpt": rewritten["excerpt"],
        "url": rewritten["source_url"],
        "body": body,
    }
    if rewritten.get("tags"):
        post["tags"] = rewritten["tags"]

    posts.insert(0, post)  # newest first — NewsList renders in array order.

    with POSTS_PATH.open("w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
        f.write("\n")

    log.info(f"Wrote post '{slug}' to {POSTS_PATH.name} (total {len(posts)} posts)")
    return slug
