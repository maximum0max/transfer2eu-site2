"""
Read RSS feeds, extract full article text, and manage the processed-URL state.

Adapted from car-news-agent/src/feeds.py. Kept the source-rotation idea, but
made candidate selection category-aware (travel vs cars) so each run can publish
a balanced mix.
"""
import json
import logging
import random
import re
from collections import defaultdict
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse

import feedparser
import requests
import trafilatura

from config import (
    ENRICH_ATTEMPTS,
    FETCH_TIMEOUT,
    ITEMS_PER_FEED,
    RECENT_SOURCES_LIMIT,
)

log = logging.getLogger(__name__)

# State lives next to the bot, in news-bot/data/processed.json.
STATE_PATH = Path(__file__).resolve().parent / "data" / "processed.json"

USER_AGENT = "Mozilla/5.0 (compatible; Transfer2EUNewsBot/1.0; +https://github.com/)"


def _load_state() -> dict[str, Any]:
    """Load the full state dict from disk. Returns {} on missing/corrupt file."""
    if not STATE_PATH.exists():
        return {}
    try:
        with STATE_PATH.open("r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        log.warning(f"Could not load state file: {e}. Starting fresh.")
        return {}


def load_processed() -> set[str]:
    """Return the set of source URLs already processed."""
    return set(_load_state().get("processed", []))


def load_recent_sources() -> list[str]:
    """Return list of recently-published source hostnames, most-recent first."""
    return list(_load_state().get("recent_sources", []))


def mark_processed(url: str, source_host: str | None = None) -> None:
    """
    Mark `url` as processed. If `source_host` is given, also push it onto the
    recent-sources rotation list (most-recent first, bounded length).
    """
    state = _load_state()
    processed = set(state.get("processed", []))
    processed.add(url)
    # Keep state file bounded — only retain the most recent 2000 entries.
    items = list(processed)[-2000:]

    recent = list(state.get("recent_sources", []))
    if source_host:
        recent = [source_host] + [h for h in recent if h != source_host]
        recent = recent[:RECENT_SOURCES_LIMIT]

    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with STATE_PATH.open("w", encoding="utf-8") as f:
        json.dump(
            {"processed": items, "recent_sources": recent},
            f, indent=2, ensure_ascii=False,
        )


def _parse_host(url: str) -> str:
    """Extract a normalized hostname (lowercase, no leading 'www.')."""
    host = urlparse(url).netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    return host


def _extract_og_image(html: str, base_url: str) -> str | None:
    """Pull the article's social-share image (og:image / twitter:image)."""
    for prop in ("og:image:secure_url", "og:image", "twitter:image", "twitter:image:src"):
        tag = re.search(
            r'<meta[^>]+(?:property|name)=["\']' + re.escape(prop) + r'["\'][^>]*>',
            html, re.IGNORECASE,
        )
        if tag:
            content = re.search(r'content=["\']([^"\']+)["\']', tag.group(0), re.IGNORECASE)
            if content:
                return urljoin(base_url, content.group(1).replace("&amp;", "&"))
    return None


def fetch_article(url: str) -> tuple[str | None, str | None]:
    """Fetch a URL and return (main article text, og:image URL). Either may be None."""
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=FETCH_TIMEOUT)
        resp.raise_for_status()
    except requests.RequestException as e:
        log.warning(f"Failed to fetch article body for {url}: {e}")
        return None, None

    text = trafilatura.extract(
        resp.text,
        include_comments=False,
        include_tables=False,
        favor_precision=True,
    )
    if not text or len(text) < 200:
        log.warning(f"Extracted text too short or empty for {url}")
        return None, None
    return text, _extract_og_image(resp.text, url)


def get_new_articles(
    feeds: list[str],
    processed: set[str],
    recent_sources: list[str] | None = None,
) -> list[dict[str, Any]]:
    """
    Collect un-processed candidates from the given feeds, ordered so that
    sources not used recently come first (and are spread across hosts), with
    full body text fetched for the top few. Returns articles ready to rewrite.
    """
    candidates = _collect_candidates(feeds, processed)
    ordered = _order_candidates(candidates, recent_sources or [])
    return _enrich(ordered)


def _collect_candidates(feeds: list[str], processed: set[str]) -> list[dict[str, Any]]:
    """Parse the given feeds and return un-processed entries, newest first."""
    candidates: list[dict[str, Any]] = []

    for feed_url in feeds:
        log.info(f"Reading feed: {feed_url}")
        try:
            parsed = feedparser.parse(feed_url, request_headers={"User-Agent": USER_AGENT})
        except Exception as e:
            log.warning(f"Could not parse feed {feed_url}: {e}")
            continue

        for entry in parsed.entries[:ITEMS_PER_FEED]:
            link = entry.get("link", "").strip()
            if not link or link in processed:
                continue
            candidates.append({
                "url": link,
                "title": entry.get("title", "").strip(),
                "feed": feed_url,
                "source_host": _parse_host(link),
                "published": entry.get("published_parsed") or entry.get("updated_parsed"),
                "summary": entry.get("summary", ""),
            })

    candidates.sort(key=lambda c: c["published"] or (0,) * 9, reverse=True)
    return candidates


def _shuffle_by_source(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Round-robin candidates across their source hosts in a random host order so
    the top picks aren't all from one busy feed. Each source stays newest-first.
    """
    by_host: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for c in candidates:
        by_host[c["source_host"]].append(c)

    hosts = list(by_host.keys())
    random.shuffle(hosts)

    ordered: list[dict[str, Any]] = []
    while any(by_host[h] for h in hosts):
        for h in hosts:
            if by_host[h]:
                ordered.append(by_host[h].pop(0))
    return ordered


def _order_candidates(
    candidates: list[dict[str, Any]],
    recent_sources: list[str],
) -> list[dict[str, Any]]:
    """Prefer not-recently-used sources (spread across hosts), then the rest."""
    recent_set = set(recent_sources)
    fresh = [c for c in candidates if c["source_host"] not in recent_set]
    stale = [c for c in candidates if c["source_host"] in recent_set]
    # Least-recently-used first among stale (higher index = used longer ago).
    stale.sort(key=lambda c: recent_sources.index(c["source_host"]), reverse=True)
    return _shuffle_by_source(fresh) + stale


def _enrich(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Fetch full body text for the top candidates; drop any that fail."""
    enriched: list[dict[str, Any]] = []
    for cand in candidates[:ENRICH_ATTEMPTS]:
        text, image_url = fetch_article(cand["url"])
        if not text:
            continue
        cand["content"] = text
        cand["image_url"] = image_url
        enriched.append(cand)
    return enriched
