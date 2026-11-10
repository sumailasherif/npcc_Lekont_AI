"""Naive keyword retrieval used by the scaffold.

The production path replaces this with chunk embeddings in Postgres/pgvector
(see docs/05-data-model.md). Keeping the interface stable means the store and
routes do not change when that swap happens.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "before",
    "can",
    "do",
    "does",
    "for",
    "from",
    "how",
    "i",
    "if",
    "in",
    "is",
    "it",
    "of",
    "on",
    "or",
    "should",
    "the",
    "then",
    "to",
    "what",
    "when",
    "where",
    "which",
    "who",
    "why",
    "with",
}

TOKEN_RE = re.compile(r"[a-z0-9]+")


@dataclass(frozen=True)
class Passage:
    sop_id: str
    version: int
    step: int
    text: str
    language: str = "en"


def tokenize(text: str) -> set[str]:
    return {token for token in TOKEN_RE.findall(text.lower()) if token not in STOPWORDS}


def score(question: str, passage: Passage) -> float:
    question_tokens = tokenize(question)
    if not question_tokens:
        return 0.0
    passage_tokens = tokenize(passage.text)
    overlap = question_tokens & passage_tokens
    if len(overlap) < 2:
        return 0.0
    return len(overlap) / len(question_tokens)


def rank(
    question: str,
    passages: list[Passage],
    minimum: float = 0.25,
) -> list[tuple[float, Passage]]:
    scored = [(score(question, passage), passage) for passage in passages]
    matches = [(value, passage) for value, passage in scored if value >= minimum]
    matches.sort(key=lambda item: item[0], reverse=True)
    return matches[:3]
