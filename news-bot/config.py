"""
Configuration for the Transfer2EU news bot.

Adapted from the car-news-agent. Two big differences:
  1. Output target is the static site's News.data.json (see publisher.py),
     not WordPress.
  2. Topic is a *mix* — Spain / Costa Blanca travel news for the transfer
     audience (tourists & expats around Alicante) PLUS European car news.

Everything is rewritten into Russian, because the site is Russian-language.
Edit the FEEDS lists to change sources, and the constants at the bottom to tune.
"""

# Two topic tiers. Each run aims to publish a MIX — see MAX_POSTS_PER_CATEGORY.
# The rewriter applies a relevance gate (see rewriter.py): an article with no
# realistic angle for a Russian-speaking traveller/expat in Spain is skipped.

# TRAVEL / SPAIN — news useful to people flying into Alicante and the Costa
# Blanca: travel rules, flights, weather, tourism, expat life, local events.
FEEDS_TRAVEL = [
    "https://www.theolivepress.es/feed/",        # English-language Spain/Costa Blanca expat news
    "https://euroweeklynews.com/feed/",          # Costa Blanca / Spain expat & tourism news
    # Add more if you like — keep them Spain/Europe travel focused.
]

# CARS — European car news (same proven outlets the car project uses).
FEEDS_CARS = [
    "https://www.carscoops.com/feed/",
    "https://www.motor1.com/rss/articles/all/",
    "https://www.autocar.co.uk/rss",
    "https://www.topgear.com/feeds/all",
    "https://www.autoexpress.co.uk/feeds/all",
]

# Maps a category key to its feed list. Used by feeds.get_new_articles.
FEEDS_BY_CATEGORY = {
    "travel": FEEDS_TRAVEL,
    "cars": FEEDS_CARS,
}

# Source-rotation: remember the last N hostnames published from. A source in
# this list is skipped while any *other* source has fresh material, so the bot
# cycles through feeds instead of repeating one. (Same idea as the car project.)
RECENT_SOURCES_LIMIT = 5

# OpenAI model. gpt-4o follows length/structure constraints reliably and writes
# clean Russian — same choice as the car project.
OPENAI_MODEL = "gpt-4o"

# How many items to look back per feed (newest first).
ITEMS_PER_FEED = 10

# Per category, max posts to publish in a single run. With the workflow firing
# every 2 days, {"travel": 1, "cars": 1} means each run adds ~1 travel + ~1 car
# story. Raise to publish more per run.
MAX_POSTS_PER_CATEGORY = {"travel": 1, "cars": 1}

# Article body fetch timeout (seconds). Some news sites are slow.
FETCH_TIMEOUT = 20

# How many candidate articles to fetch full text for before giving up on a
# category in one run (some URLs fail extraction).
ENRICH_ATTEMPTS = 5
