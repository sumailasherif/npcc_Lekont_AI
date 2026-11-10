"""Live translation for English, French and Mauritian Kreol.

Three engines, tried in order:

1. ``llm``     - the configured model, prompted as a technical translator.
2. ``memory``  - curated EN/FR/Kreol pairs from approved SOPs (instant, offline).
3. ``glossary`` - word-level fallback so the demo never shows a blank screen.

Everything is cached in-process, so switching language in the UI is instant
after the first request. Kreol is always marked ``review_required`` unless it
came from the curated memory, because it is a low-resource language.
"""

from __future__ import annotations

import re
import time
from dataclasses import dataclass
from threading import Lock

from app.core.config import get_settings
from app.schemas.common import Language
from app.services import llm

SUPPORTED_TARGETS = (Language.FR, Language.CR)

LANGUAGE_NAMES = {
    Language.EN: "English",
    Language.FR: "French",
    Language.CR: "Mauritian Kreol (Kreol Morisien)",
}

TRANSLATE_PROMPT = """You are a technical translator for Mauritian factory work instructions.
Translate the text into {language}. Rules:
- Preserve step numbers, fault codes, machine names, units and punctuation.
- Keep every safety instruction; never add, remove or soften a step.
- Use short, plain shop-floor language an operator can follow at the machine.
- Return only the translation. No commentary, no quotes, no preamble."""


@dataclass(frozen=True)
class Translation:
    text: str
    engine: str
    review_required: bool
    confidence: float


_CACHE: dict[tuple[str, str], Translation] = {}
_LOCK = Lock()
_STATS = {"requests": 0, "llm": 0, "memory": 0, "glossary": 0}


def stats() -> dict[str, int]:
    return dict(_STATS)


def translate(text: str, target: Language) -> Translation:
    started = time.perf_counter()
    _STATS["requests"] += 1

    if target is Language.EN or not text.strip():
        return Translation(text=text, engine="identity", review_required=False, confidence=1.0)

    key = (target.value, text)
    with _LOCK:
        cached = _CACHE.get(key)
    if cached is not None:
        return cached

    result = _from_llm(text, target) or _from_memory(text, target) or _from_glossary(text, target)
    result = Translation(
        text=result.text,
        engine=result.engine,
        review_required=result.review_required,
        confidence=result.confidence,
    )
    _STATS[result.engine] = _STATS.get(result.engine, 0) + 1

    with _LOCK:
        _CACHE[key] = result
    _ = time.perf_counter() - started
    return result


def memory_size() -> int:
    return len(_memory())


def _from_llm(text: str, target: Language) -> Translation | None:
    translated = llm.complete(
        TRANSLATE_PROMPT.format(language=LANGUAGE_NAMES[target]),
        text,
        temperature=0.1,
    )
    if not translated:
        return None
    return Translation(
        text=translated,
        engine="llm",
        review_required=target is Language.CR,
        confidence=0.88 if target is Language.FR else 0.78,
    )


def _memory() -> dict[tuple[str, str], str]:
    """Curated translation pairs from approved SOPs (lazy import avoids a cycle)."""
    from app import store

    pairs: dict[tuple[str, str], str] = {}
    for english, translations in store.translation_memory():
        normalised = _normalise(english)
        for language, translated in translations.items():
            pairs[(language.value, normalised)] = translated
    return pairs


def _from_memory(text: str, target: Language) -> Translation | None:
    memory = _memory()
    lines = text.splitlines()
    translated_lines: list[str] = []
    hits = 0
    for line in lines:
        match = memory.get((target.value, _normalise(line)))
        if match is None:
            stripped = re.sub(r"^\s*\d+[.)]\s*", "", line)
            match = memory.get((target.value, _normalise(stripped)))
        if match is None:
            return None
        translated_lines.append(match)
        hits += 1
    if not hits:
        return None
    return Translation(
        text="\n".join(translated_lines),
        engine="memory",
        review_required=target is Language.CR,
        confidence=0.95,
    )


def _normalise(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip().lower()


FR_GLOSSARY = {
    "machine": "machine",
    "stop": "arret",
    "button": "bouton",
    "red": "rouge",
    "wait": "attendez",
    "thread": "fil",
    "jam": "emmelement",
    "needle": "aiguille",
    "guard": "protection",
    "safety": "securite",
    "check": "verifiez",
    "supervisor": "superviseur",
    "batch": "lot",
    "log": "registre",
    "record": "enregistrez",
    "sign": "signez",
    "quality": "qualite",
    "shift": "poste",
    "clean": "propre",
    "wash": "lavez",
    "hands": "mains",
    "vibration": "vibration",
    "spindle": "broche",
    "tool": "outil",
    "replace": "remplacez",
    "inspect": "inspectez",
    "maintenance": "maintenance",
    "fault": "defaut",
    "code": "code",
    "call": "appelez",
}

CR_GLOSSARY = {
    "machine": "machine",
    "stop": "arret",
    "button": "bouton",
    "red": "rouz",
    "wait": "atann",
    "thread": "fil",
    "jam": "melanz",
    "needle": "lobri",
    "guard": "protection",
    "safety": "sekirite",
    "check": "get",
    "supervisor": "superviser",
    "batch": "lot",
    "log": "registre",
    "record": "anrezistre",
    "sign": "sign",
    "quality": "kalite",
    "shift": "post",
    "clean": "prop",
    "wash": "lav",
    "hands": "lame",
    "vibration": "vibrasion",
    "spindle": "broche",
    "tool": "outil",
    "replace": "ranplass",
    "inspect": "get",
    "maintenance": "maintenance",
    "fault": "defo",
    "code": "code",
    "call": "apel",
}


def _from_glossary(text: str, target: Language) -> Translation:
    glossary = FR_GLOSSARY if target is Language.FR else CR_GLOSSARY

    def replace(match: re.Match[str]) -> str:
        word = match.group(0)
        translated = glossary.get(word.lower())
        if translated is None:
            return word
        if word[:1].isupper():
            return translated[:1].upper() + translated[1:]
        return translated

    translated = re.sub(r"[A-Za-z]+", replace, text)
    return Translation(
        text=translated,
        engine="glossary",
        review_required=True,
        confidence=0.45,
    )


def enabled_engine() -> str:
    return "llm" if get_settings().opencode_go_api_key else "memory+glossary"
