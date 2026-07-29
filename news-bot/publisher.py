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

import requests

log = logging.getLogger(__name__)

# ../News.data.json relative to this file (news-bot/ -> site root).
POSTS_PATH = Path(__file__).resolve().parent.parent / "News.data.json"
# Self-hosted news photos (served from /assets/news/<slug>.<ext>).
NEWS_IMAGES_DIR = Path(__file__).resolve().parent.parent / "public" / "assets" / "news"
_UA = "Mozilla/5.0 (compatible; Transfer2EUNewsBot/1.0; +https://www.transfer2eu.com)"


def _download_image(url: str | None, slug: str) -> str | None:
    """
    Download the article's og:image and self-host it as
    public/assets/news/<slug>.<ext>. Returns the site-relative path, or None if
    there's no usable image (so the site falls back to the default og-image).
    """
    if not url:
        return None
    try:
        r = requests.get(url, headers={"User-Agent": _UA}, timeout=30)
        r.raise_for_status()
        ct = (r.headers.get("content-type") or "").lower()
        if not ct.startswith("image/"):
            return None
        data = r.content
        if len(data) < 3000 or len(data) > 2_800_000:
            return None  # too small (icon) or too large for the web
        ext = "png" if "png" in ct else "webp" if "webp" in ct else "gif" if "gif" in ct else "jpg"
        NEWS_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        (NEWS_IMAGES_DIR / f"{slug}.{ext}").write_bytes(data)
        return f"/assets/news/{slug}.{ext}"
    except Exception as e:  # never let a photo failure block publishing
        log.warning(f"Could not fetch image for '{slug}': {e}")
        return None

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
    image_path = _download_image(rewritten.get("image_url"), slug)
    if image_path:
        post["image"] = image_path
    if rewritten.get("tags"):
        post["tags"] = rewritten["tags"]

    posts.insert(0, post)  # newest first — NewsList renders in array order.

    with POSTS_PATH.open("w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
        f.write("\n")

    log.info(f"Wrote post '{slug}' to {POSTS_PATH.name} (total {len(posts)} posts)")
    return slug
