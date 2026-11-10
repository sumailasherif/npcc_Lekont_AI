"""Grounded chat with a curated expert profile.

The model is optional. Without an API key, the reply is assembled directly from
the matched knowledge cards, so the demo works offline and cannot hallucinate.
"""

from __future__ import annotations

from app.schemas.common import Language
from app.schemas.experts import (
    ChatTurn,
    Expert,
    ExpertChatResponse,
    ExpertCitation,
)
from app.services import llm, translation
from app.services.retrieval import Passage, rank

LANGUAGE_NAMES = {
    Language.EN: "English",
    Language.FR: "French",
    Language.CR: "Mauritian Kreol (Kreol Morisien)",
}

SYSTEM_PROMPT = """You are the digital mind of {name}, {role} at {organisation}.
You are grounded ONLY in the notes below, which were written from public sources.
Rules:
- Never invent facts, numbers, quotes or opinions that are not in the notes.
- If the notes do not cover the question, say so plainly and list the topics you can cover.
- Speak in the first person as a profile grounded in public record, not as the real person.
- Be concrete and useful for a Mauritian manufacturing audience.
- Keep answers under 180 words, with short paragraphs or a numbered list.
- Reply in {language}."""


def _fallback_answer(expert: Expert) -> str:
    topics = ", ".join(expert.topics[:4])
    return (
        f"That question is outside the material this profile is grounded in. "
        f"I can speak about {topics}. Try one of the suggested questions, or add a "
        f"source to this mind so it can cover more."
    )


def _cards_for(expert: Expert, message: str):
    passages = [
        Passage(
            sop_id=card.id,
            version=1,
            step=index,
            text=f"{card.title}. {card.body} Topics: {', '.join(card.topics)}",
            language="en",
        )
        for index, card in enumerate(expert.knowledge, start=1)
    ]
    matches = rank(message, passages, minimum=0.2)
    by_id = {card.id: card for card in expert.knowledge}
    return [by_id[passage.sop_id] for _, passage in matches]


def _history_text(history: list[ChatTurn]) -> str:
    recent = history[-6:]
    return "\n".join(f"{turn.role}: {turn.content}" for turn in recent)


def reply(
    expert: Expert,
    message: str,
    language: Language,
    history: list[ChatTurn],
) -> ExpertChatResponse:
    cards = _cards_for(expert, message)
    citations = [
        ExpertCitation(
            card_id=card.id,
            title=card.title,
            source=card.source,
            year=card.year,
        )
        for card in cards
    ]

    if not cards:
        answer = _fallback_answer(expert)
        confidence = 0.25
        engine = "scope"
    else:
        notes = "\n\n".join(
            f"[{card.id}] {card.title}\n{card.body}\nSource: {card.source}"
            for card in cards
        )
        generated = None
        if llm.is_enabled():
            prompt = (
                f"Notes:\n{notes}\n\n"
                f"Conversation so far:\n{_history_text(history) or '(none)'}\n\n"
                f"Question: {message}"
            )
            generated = llm.complete(
                SYSTEM_PROMPT.format(
                    name=expert.name,
                    role=expert.role,
                    organisation=expert.organisation,
                    language=LANGUAGE_NAMES[language],
                ),
                prompt,
                temperature=0.3,
                max_tokens=700,
            )
        if generated:
            answer = generated
            confidence = 0.86
            engine = "llm"
        else:
            answer = "\n\n".join(f"{card.title}: {card.body}" for card in cards)
            confidence = 0.74
            engine = "knowledge"

    review_required = False
    source_answer = answer
    if language is not Language.EN:
        translated = translation.translate(answer, language)
        answer = translated.text
        review_required = translated.review_required
        if translated.engine == "glossary":
            confidence = min(confidence, 0.55)

    asked = message.strip().lower()
    suggested = [
        question
        for question in expert.sample_questions
        if question.strip().lower() not in asked
    ][:3]

    return ExpertChatResponse(
        answer=answer,
        source_answer=source_answer,
        language=language,
        citations=citations,
        confidence=round(confidence, 2),
        engine=engine,
        review_required=review_required,
        suggested=suggested,
        disclaimer=expert.disclaimer,
    )
