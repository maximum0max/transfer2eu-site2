"""
Send a source article to OpenAI and get back a Russian rewrite in the exact
block shape the Transfer2EU site renders (see NewsPost.jsx).

Adapted from car-news-agent/src/rewriter.py:
  - Target language is Russian (the site is Russian-language).
  - Output is `body` — an array of typed blocks {type: 'p'|'h2'|'h3'|'ul', ...}
    instead of WordPress content_html.
  - Audience and relevance gate are tuned per category (travel vs cars).
"""
import json
import logging
import os
import re
from typing import Any

from openai import AuthenticationError, OpenAI, PermissionDeniedError

from config import OPENAI_MODEL

log = logging.getLogger(__name__)


class ArticleSkipped(Exception):
    """Raised when the rewriter decides an article has no relevance to publish."""
    pass


class FatalConfigError(Exception):
    """
    Raised for problems that will affect EVERY article, not just this one —
    a missing/invalid OPENAI_API_KEY, auth failure, etc. main.py aborts the
    whole run on this WITHOUT marking articles processed, so a misconfigured
    key never silently burns through the feed.
    """
    pass


SYSTEM_PROMPT = """Ты — редактор новостного раздела сайта Transfer2EU. Transfer2EU — сервис трансфера из аэропорта Аликанте (ALC) по Коста-Бланке и Испании. Аудитория сайта — русскоязычные туристы, путешественники и эмигранты, которые едут в Испанию или живут на побережье. Сайт полностью на русском языке.

Твоя задача — на основе статьи-источника написать ОРИГИНАЛЬНУЮ новость на русском языке, полезную и интересную этой аудитории. Не переводи дословно — перепиши, переструктурируй и подай под нашего читателя.

ТОН: живой, человечный, журналистский. Короткие предложения, короткие абзацы (2–4 предложения), активный залог. Без канцелярита, без кликбейта, без CAPS, без выдуманных фактов.

ГЛАВНОЕ ПРАВИЛО ФАКТОВ: НИКОГДА не выдумывай цифры, цены, цитаты или даты, которых нет в источнике. Если деталей мало — добавляй ОБЩЕИЗВЕСТНЫЙ контекст (как устроен сервис, что полезно знать туристу/эмигранту), но не сочиняй конкретику.

ЗАГОЛОВОК:
- 50–70 символов, отвечает на вопрос «что произошло / о чём это».
- Прямой порядок слов, больше глаголов и существительных, без точки в конце.
- Бренды и модели машин, названия мест — латиницей как в оригинале (Tesla Model Y, BMW, Alicante, Costa Blanca). Не транслитерируй бренды.

SEO-ЗАГОЛОВОК (seo_title): до 60 символов — для тега <title> в поиске Google. Самое важное слово/суть ставь В НАЧАЛЕ (Google обрезает хвост). Это сжатая версия заголовка; если обычный заголовок и так ≤60 символов — повтори его. Без точки в конце.

EXCERPT: 120–160 символов — краткая суть + причина прочитать. Заканчивается точкой.

СТРУКТУРА ТЕКСТА (поле body — массив блоков):
1. Первый блок {"type":"p"} — ЛИД на 2–3 предложения: что, где, когда, для кого важно. Если новость из другого СМИ/пресс-релиза — назови первоисточник прямо в лиде («сообщает Reuters», «по данным The Olive Press» и т.п.).
2. Дальше 2–3 блока {"type":"h2"} (подзаголовок) — и под каждым 1–2 блока {"type":"p"} с фактами, деталями и контекстом.
3. Один блок {"type":"ul","items":[...]} с 3–5 пунктами — практические выводы / что это значит для путешественника или жителя побережья. Каждый пункт — законченная мысль на 1–2 предложения.
4. Завершающий блок {"type":"p"} — короткий вывод (2–3 предложения).

Целевая длина body — 350–550 слов суммарно. Не вставляй в body ссылку на источник, упоминание автора оригинала или «Читайте также» — это добавляется автоматически.

ПУНКТУАЦИЯ (русский): тире «—» (U+2014) между частями предложения; кавычки-«ёлочки»; бренды не склоняй («у Tesla», «купить BMW»). Без двойных пробелов и пробелов перед запятой/точкой.

ВЕРНИ СТРОГО валидный JSON, без текста до или после:
{
  "title": "...",
  "seo_title": "... (≤60 символов, суть в начале)",
  "slug_source": "english phrase 3-6 words, no verbs, just the topic — used for the URL",
  "excerpt": "...",
  "body": [
    {"type": "p", "text": "лид..."},
    {"type": "h2", "text": "подзаголовок"},
    {"type": "p", "text": "..."},
    {"type": "ul", "items": ["пункт 1", "пункт 2", "пункт 3"]},
    {"type": "p", "text": "вывод"}
  ],
  "tags": ["тег1", "тег2", "тег3"]
}"""


# Per-category guidance injected into the user message. The relevance gate keeps
# the feed on-topic for Transfer2EU's audience.
CATEGORY_BRIEFS = {
    "travel": (
        "КАТЕГОРИЯ: путешествия и жизнь в Испании (Коста-Бланка, Аликанте, побережье).\n"
        "ФИЛЬТР РЕЛЕВАНТНОСТИ — сначала оцени, полезна ли новость русскоязычному "
        "туристу или эмигранту в Испании:\n"
        "  ✓ ДА: правила въезда и визы, аэропорт Аликанте и рейсы, погода и сезоны, "
        "транспорт, цены, безопасность, события и фестивали на побережье, жизнь "
        "эмигрантов, недвижимость, полезные сервисы.\n"
        "  ✗ НЕТ: чисто локальная криминальная хроника одной деревни без общего "
        "интереса, спортивные результаты, узкая политика, реклама конкретного бара.\n"
    ),
    "cars": (
        "КАТЕГОРИЯ: автомобили (европейский рынок).\n"
        "ФИЛЬТР РЕЛЕВАНТНОСТИ — сначала оцени, интересна ли новость широкому "
        "русскоязычному читателю, который ездит по Европе/Испании:\n"
        "  ✓ ДА: модели, доступные в Европе; крупные решения производителей "
        "(Toyota, VW, BMW, Hyundai, Tesla, Stellantis и т.п.); электромобили, "
        "зарядки, цены на топливо, правила ЕС, новые модели и тренды рынка.\n"
        "  ✗ НЕТ: чисто американские пикапы и JDM-модели, недоступные в Европе; "
        "новости про электросамокаты, велосипеды, солнечные панели; "
        "узкокорпоративные дела без интереса для покупателя.\n"
    ),
}


def rewrite_article(
    title: str,
    content: str,
    url: str,
    category: str,
) -> dict[str, Any]:
    """
    Rewrite the source article into a Russian post in the site's block shape.

    The model first applies a relevance gate and may return
    {"skip": true, "skip_reason": "..."} — in which case this raises
    ArticleSkipped and main.py marks the URL processed without publishing.
    """
    api_key = (os.environ.get("OPENAI_API_KEY") or "").strip()
    if not api_key:
        raise FatalConfigError(
            "OPENAI_API_KEY is not set (or empty). In GitHub Actions, check that the "
            "repo secret is named exactly OPENAI_API_KEY with no trailing spaces."
        )
    client = OpenAI(api_key=api_key)

    brief = CATEGORY_BRIEFS.get(category, "")
    user_message = (
        f"{brief}\n"
        f"ЕСЛИ НЕ РЕЛЕВАНТНА — верни ТОЛЬКО такой JSON, без другого текста:\n"
        f'  {{"skip": true, "skip_reason": "короткое объяснение по-русски"}}\n\n'
        f"ЕСЛИ РЕЛЕВАНТНА — напиши полную русскую новость по системным правилам.\n\n"
        f"ОРИГИНАЛЬНЫЙ ЗАГОЛОВОК: {title}\n\n"
        f"ОРИГИНАЛЬНЫЙ ТЕКСТ:\n{content}\n"
    )

    log.info("Calling OpenAI for rewrite...")
    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=3500,
        )
    except (AuthenticationError, PermissionDeniedError) as e:
        # Bad/expired key or no access to the model — affects every article.
        raise FatalConfigError(f"OpenAI rejected the API key: {e}") from e

    raw = response.choices[0].message.content
    if not raw:
        raise RuntimeError("OpenAI returned empty response")

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        log.error(f"OpenAI returned invalid JSON: {raw[:500]}")
        raise RuntimeError("OpenAI did not return valid JSON") from e

    # Relevance gate: model may opt out.
    if data.get("skip") is True:
        reason = str(data.get("skip_reason", "not relevant")).strip() or "not relevant"
        raise ArticleSkipped(reason)

    # Validate + normalize required fields.
    for key in ("title", "excerpt", "body"):
        if not data.get(key):
            raise RuntimeError(f"OpenAI response missing field: {key}")

    data["body"] = _clean_body(data["body"])
    if not data["body"]:
        raise RuntimeError("OpenAI response had an empty/invalid body")

    data["slug"] = _slugify(data.get("slug_source") or title)
    data["source_url"] = url
    data["source_title"] = title
    # Concise <title> for search; empty falls back to the headline (the site
    # clamps long headlines to Google's ~60-char budget at render time anyway).
    data["seoTitle"] = str(data.get("seo_title") or "").strip()

    tags = data.get("tags")
    data["tags"] = [str(t).strip() for t in tags if str(t).strip()][:8] if isinstance(tags, list) else []

    log.info(f"Rewrite OK. New title: {data['title']}")
    return data


def _clean_body(body: Any) -> list[dict[str, Any]]:
    """Keep only well-formed blocks the site knows how to render."""
    if not isinstance(body, list):
        return []
    clean: list[dict[str, Any]] = []
    for block in body:
        if not isinstance(block, dict):
            continue
        btype = block.get("type")
        if btype in ("p", "h2", "h3"):
            text = str(block.get("text", "")).strip()
            if text:
                clean.append({"type": btype, "text": text})
        elif btype == "ul":
            items = block.get("items")
            if isinstance(items, list):
                items = [str(i).strip() for i in items if str(i).strip()]
                if items:
                    clean.append({"type": "ul", "items": items})
    return clean


def _slugify(text: str) -> str:
    """ASCII slug for the URL. Falls back to 'post' if nothing usable remains."""
    text = text.lower()
    # Drop anything that isn't a-z, 0-9 or space/hyphen, collapse to hyphens.
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text).strip("-")
    return text[:70].rstrip("-") or "post"
