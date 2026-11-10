"""In-memory store for the scaffold.

Every record here is synthetic and exists so the UI and API can be exercised
before a factory shares real data. The production implementation swaps this
module for SQLAlchemy repositories backed by Postgres + pgvector without
changing the route signatures.
"""

from __future__ import annotations

import re
import uuid
from datetime import UTC, datetime
from threading import Lock

from app.schemas.analytics import AnalyticsSummary
from app.schemas.common import GapStatus, Language, RiskLevel, Sector, SopStatus
from app.schemas.gaps import Gap
from app.schemas.query import Citation, QueryResponse
from app.schemas.skills import Role, SkillRequirement
from app.schemas.sops import Sop, SopCreate, SopStep, SopSummary, SopTranslation
from app.schemas.sources import Source, SourceCreate, SourceKind, SourceStatus
from app.services import llm, translation
from app.services.retrieval import Passage, rank

DISCLAIMER = (
    "Answer generated from approved work instructions. Follow your site's safety "
    "procedure and ask a supervisor if anything is unclear."
)

GAP_ANSWER = (
    "This is not covered by an approved work instruction yet. The question has "
    "been logged as a knowledge gap for a supervisor to review."
)

_LOCK = Lock()
_SOURCES: dict[str, Source] = {}
_SOPS: dict[str, Sop] = {}
_GAPS: dict[str, Gap] = {}
_ROLES: dict[str, Role] = {}

_QUESTIONS_TOTAL = 0
_COVERED_TOTAL = 0


def _now() -> datetime:
    return datetime.now(UTC)


def _new_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8]}"


def _steps(*rows: tuple[str, RiskLevel]) -> list[SopStep]:
    return [
        SopStep(order=index, text=text, risk=risk)
        for index, (text, risk) in enumerate(rows, start=1)
    ]


def _translation(language: Language, title: str, rows: list[SopStep]) -> SopTranslation:
    return SopTranslation(language=language, title=title, steps=rows)


def _language_list(sop: Sop) -> list[Language]:
    return sorted(sop.translations.keys(), key=lambda value: value.value)


# ---------------------------------------------------------------------------
# Seed data (synthetic)
# ---------------------------------------------------------------------------

_TEXTILE_EN = _steps(
    ("Press the red stop button and wait until the machine is fully still.", RiskLevel.HIGH),
    ("Lift the presser foot and switch off the needle guard.", RiskLevel.MEDIUM),
    ("Cut the tangled thread with curved tweezers; never pull it through the needle.", RiskLevel.MEDIUM),
    ("Brush lint out of the tension discs.", RiskLevel.LOW),
    ("Re-thread along the yellow path, close the guard, and sew a test seam on scrap fabric.", RiskLevel.MEDIUM),
)
_TEXTILE_FR = _steps(
    ("Appuyez sur le bouton d'arret rouge et attendez l'arret complet de la machine.", RiskLevel.HIGH),
    ("Levez le pied presseur et coupez la protection de l'aiguille.", RiskLevel.MEDIUM),
    ("Coupez le fil emmele avec la pince courbe ; ne tirez jamais le fil a travers l'aiguille.", RiskLevel.MEDIUM),
    ("Nettoyez les disques de tension avec la brosse.", RiskLevel.LOW),
    ("Rengagez le fil sur le parcours jaune, fermez la protection et cousez un essai sur une chute.", RiskLevel.MEDIUM),
)
_TEXTILE_CR = _steps(
    ("Presse bouton rouz arret ek atann machine arret net.", RiskLevel.HIGH),
    ("Leve pie presseur ek eteign protection lobri.", RiskLevel.MEDIUM),
    ("Coupe fil ki finn melanz ek pins; pa tir fil atraver lobri.", RiskLevel.MEDIUM),
    ("Bros dis tension pou tire la poussiere.", RiskLevel.LOW),
    ("Remet fil lor sime zon, ferm protection, ek koud enn test lor leraz.", RiskLevel.MEDIUM),
)

_FOOD_EN = _steps(
    ("Wash hands and put on a clean apron before touching the log.", RiskLevel.MEDIUM),
    ("Write the batch code, product, line, start time and end time.", RiskLevel.HIGH),
    ("Record raw material lot numbers from the delivery labels.", RiskLevel.HIGH),
    ("If any field is missing, stop and call the line supervisor.", RiskLevel.HIGH),
    ("Sign the log and hand it to the quality officer at the end of the shift.", RiskLevel.MEDIUM),
)
_FOOD_FR = _steps(
    ("Lavez-vous les mains et mettez un tablier propre avant de toucher le registre.", RiskLevel.MEDIUM),
    ("Ecrivez le code du lot, le produit, la ligne, l'heure de debut et de fin.", RiskLevel.HIGH),
    ("Notez les numeros de lot des matieres premieres figurant sur les etiquettes de livraison.", RiskLevel.HIGH),
    ("Si un champ manque, arretez et appelez le superviseur de ligne.", RiskLevel.HIGH),
    ("Signez le registre et remettez-le au responsable qualite en fin de poste.", RiskLevel.MEDIUM),
)
_FOOD_CR = _steps(
    ("Lav ou lame ek met enn tablie prop avan touch registre.", RiskLevel.MEDIUM),
    ("Ekrir code lot, produit, ligne, ler debut ek ler fin.", RiskLevel.HIGH),
    ("Not bann nimero lot matier premie lor etiket livrezon.", RiskLevel.HIGH),
    ("Si enn kaz vide, aret ek apel superviser ligne.", RiskLevel.HIGH),
    ("Sign registre ek remet li ar responsab kalite fin post.", RiskLevel.MEDIUM),
)

_LIGHT_EN = _steps(
    ("Stop the program and engage the safety lock before opening the guard.", RiskLevel.HIGH),
    ("Check the chuck jaws for chips and tighten to the torque marked on the panel.", RiskLevel.MEDIUM),
    ("Inspect the tool holder for wear and replace a chipped insert.", RiskLevel.MEDIUM),
    ("Run the spindle at 500 rpm with no load and listen for vibration.", RiskLevel.MEDIUM),
    ("If vibration remains, log fault code SP-402 and call maintenance.", RiskLevel.HIGH),
)
_LIGHT_FR = _steps(
    ("Arretez le programme et enclenchez le verrouillage de securite avant d'ouvrir le capot.", RiskLevel.HIGH),
    ("Verifiez les mors du mandrin et serrez au couple indique sur le panneau.", RiskLevel.MEDIUM),
    ("Inspectez le porte-outil et remplacez la plaquette eclatee.", RiskLevel.MEDIUM),
    ("Faites tourner la broche a 500 tr/min a vide et ecoutez les vibrations.", RiskLevel.MEDIUM),
    ("Si la vibration persiste, notez le code defaut SP-402 et appelez la maintenance.", RiskLevel.HIGH),
)
_LIGHT_CR = _steps(
    ("Aret program ek met verrou sekirite avan ouver kapo.", RiskLevel.HIGH),
    ("Get mors mandrin ek sere otan couple ki mark lor panel.", RiskLevel.MEDIUM),
    ("Get porte-outil ek ranplass plaquette ki kase.", RiskLevel.MEDIUM),
    ("Fer broche tourn 500 tr/min san sarz ek ekout vibrasion.", RiskLevel.MEDIUM),
    ("Si vibrasion kontinie, not code defo SP-402 ek apel maintenance.", RiskLevel.HIGH),
)


def _seed() -> None:
    sources = [
        SourceCreate(title="Overlock jam procedure", kind=SourceKind.PDF, sector=Sector.TEXTILE),
        SourceCreate(title="Line 2 traceability log guide", kind=SourceKind.PDF, sector=Sector.FOOD),
        SourceCreate(title="CNC vibration checklist", kind=SourceKind.AUDIO, sector=Sector.LIGHT_ENGINEERING),
    ]
    for index, payload in enumerate(sources, start=1):
        source = Source(
            id=f"src-{index:03d}",
            title=payload.title,
            kind=payload.kind,
            sector=payload.sector,
            language="en",
            status=SourceStatus.READY,
            chunks=12 * index,
            created_at=_now(),
            notes="Synthetic document created for the challenge demo.",
        )
        _SOURCES[source.id] = source

    sops = [
        (
            "sop-txt-001",
            "Clear a thread jam on the overlock machine",
            Sector.TEXTILE,
            "senior_operator",
            "overlock-01",
            {
                Language.EN: _translation(Language.EN, "Clear a thread jam on the overlock machine", _TEXTILE_EN),
                Language.FR: _translation(Language.FR, "Degager un fil emmele sur la surjeteuse", _TEXTILE_FR),
                Language.CR: _translation(Language.CR, "Tir enn fil melanz lor machine overlock", _TEXTILE_CR),
            },
        ),
        (
            "sop-food-001",
            "Record a batch in the traceability log",
            Sector.FOOD,
            "line_supervisor",
            "line-2",
            {
                Language.EN: _translation(Language.EN, "Record a batch in the traceability log", _FOOD_EN),
                Language.FR: _translation(Language.FR, "Enregistrer un lot dans le registre de tracabilite", _FOOD_FR),
                Language.CR: _translation(Language.CR, "Anrezistre enn lot dan registre tracabilite", _FOOD_CR),
            },
        ),
        (
            "sop-eng-001",
            "Diagnose spindle vibration on the CNC lathe",
            Sector.LIGHT_ENGINEERING,
            "maintenance_technician",
            "cnc-lathe-03",
            {
                Language.EN: _translation(Language.EN, "Diagnose spindle vibration on the CNC lathe", _LIGHT_EN),
                Language.FR: _translation(Language.FR, "Diagnostiquer les vibrations de broche du tour CNC", _LIGHT_FR),
                Language.CR: _translation(Language.CR, "Diagnostik vibrasion broche lor tour CNC", _LIGHT_CR),
            },
        ),
    ]
    for sop_id, title, sector, role_id, machine_id, translations in sops:
        _SOPS[sop_id] = Sop(
            id=sop_id,
            title=title,
            sector=sector,
            role_id=role_id,
            machine_id=machine_id,
            status=SopStatus.PUBLISHED,
            version=1,
            languages=list(translations.keys()),
            approved_by="demo.supervisor",
            updated_at=_now(),
            translations=translations,
        )

    roles = [
        Role(
            id="senior_operator",
            name="Senior operator",
            sector=Sector.TEXTILE,
            headcount=42,
            skills=[
                SkillRequirement(skill="Machine setup", required=3),
                SkillRequirement(skill="Fault diagnosis", required=2),
                SkillRequirement(skill="Quality check", required=3),
            ],
        ),
        Role(
            id="line_supervisor",
            name="Line supervisor",
            sector=Sector.FOOD,
            headcount=8,
            skills=[
                SkillRequirement(skill="HACCP records", required=4),
                SkillRequirement(skill="Traceability", required=3),
                SkillRequirement(skill="Team briefing", required=3),
            ],
        ),
        Role(
            id="quality_officer",
            name="Quality officer",
            sector=Sector.FOOD,
            headcount=4,
            skills=[
                SkillRequirement(skill="HACCP audit", required=4),
                SkillRequirement(skill="Batch release", required=4),
            ],
        ),
        Role(
            id="maintenance_technician",
            name="Maintenance technician",
            sector=Sector.LIGHT_ENGINEERING,
            headcount=6,
            skills=[
                SkillRequirement(skill="Fault diagnosis", required=4),
                SkillRequirement(skill="Calibration", required=3),
                SkillRequirement(skill="PLC basics", required=2),
            ],
        ),
    ]
    for role in roles:
        _ROLES[role.id] = role

    gaps = [
        ("How do I reset the overlock counter after a jam?", Language.EN, Sector.TEXTILE, "senior_operator", 7),
        ("Ki manyer netwaye difil anba plateforme?", Language.CR, Sector.TEXTILE, "senior_operator", 4),
        ("What is the escalation path when a lot number is unreadable?", Language.EN, Sector.FOOD, "line_supervisor", 3),
    ]
    for index, (question, language, sector, role_id, count) in enumerate(gaps, start=1):
        gap = Gap(
            id=f"gap-{index:03d}",
            question=question,
            language=language,
            sector=sector,
            role_id=role_id,
            count=count,
            status=GapStatus.OPEN,
            first_seen=_now(),
            last_seen=_now(),
        )
        _GAPS[gap.id] = gap


_seed()


# ---------------------------------------------------------------------------
# Sources
# ---------------------------------------------------------------------------


def list_sources() -> list[Source]:
    return sorted(_SOURCES.values(), key=lambda source: source.created_at, reverse=True)


def create_source(payload: SourceCreate) -> Source:
    with _LOCK:
        source = Source(
            id=_new_id("src"),
            title=payload.title,
            kind=payload.kind,
            sector=payload.sector,
            language=payload.language,
            status=SourceStatus.UPLOADED,
            chunks=0,
            created_at=_now(),
            notes=payload.notes,
        )
        _SOURCES[source.id] = source
        return source


def delete_source(source_id: str) -> bool:
    with _LOCK:
        return _SOURCES.pop(source_id, None) is not None


# ---------------------------------------------------------------------------
# SOPs
# ---------------------------------------------------------------------------


def _summary(sop: Sop) -> SopSummary:
    return SopSummary(
        id=sop.id,
        title=sop.title,
        sector=sop.sector,
        role_id=sop.role_id,
        machine_id=sop.machine_id,
        status=sop.status,
        version=sop.version,
        languages=_language_list(sop),
        approved_by=sop.approved_by,
        updated_at=sop.updated_at,
    )


def list_sops() -> list[SopSummary]:
    return [_summary(sop) for sop in sorted(_SOPS.values(), key=lambda item: item.updated_at, reverse=True)]


def get_sop(sop_id: str) -> Sop | None:
    return _SOPS.get(sop_id)


def create_sop(payload: SopCreate) -> Sop:
    with _LOCK:
        sop = Sop(
            id=_new_id("sop"),
            title=payload.title,
            sector=payload.sector,
            role_id=payload.role_id,
            machine_id=payload.machine_id,
            status=SopStatus.DRAFT,
            version=0,
            languages=[],
            approved_by=None,
            updated_at=_now(),
            translations={},
        )
        _SOPS[sop.id] = sop
        return sop


def generate_sop(sop_id: str) -> Sop | None:
    with _LOCK:
        sop = _SOPS.get(sop_id)
        if sop is None:
            return None
        sop.status = SopStatus.GENERATED
        sop.updated_at = _now()
        return sop


def translate_sop(sop_id: str, languages: list[Language]) -> Sop | None:
    with _LOCK:
        sop = _SOPS.get(sop_id)
        if sop is None:
            return None
        base = sop.translations.get(Language.EN)
        if base is None:
            return sop
        for language in languages:
            if language in sop.translations:
                continue
            sop.translations[language] = SopTranslation(
                language=language,
                title=base.title,
                steps=list(base.steps),
            )
        sop.languages = _language_list(sop)
        sop.updated_at = _now()
        return sop


def submit_sop(sop_id: str) -> Sop | None:
    with _LOCK:
        sop = _SOPS.get(sop_id)
        if sop is None:
            return None
        sop.status = SopStatus.IN_REVIEW
        sop.updated_at = _now()
        return sop


def approve_sop(sop_id: str, reviewer: str) -> Sop | None:
    with _LOCK:
        sop = _SOPS.get(sop_id)
        if sop is None:
            return None
        if sop.status not in (SopStatus.IN_REVIEW, SopStatus.APPROVED, SopStatus.GENERATED):
            return None
        sop.status = SopStatus.PUBLISHED
        sop.version += 1
        sop.approved_by = reviewer
        sop.updated_at = _now()
        return sop


# ---------------------------------------------------------------------------
# Questions and gaps
# ---------------------------------------------------------------------------


def _approved_passages() -> list[Passage]:
    passages: list[Passage] = []
    for sop in _SOPS.values():
        if sop.status is not SopStatus.PUBLISHED:
            continue
        for language, sop_translation in sop.translations.items():
            passages.extend(
                Passage(
                    sop_id=sop.id,
                    version=sop.version,
                    step=step.order,
                    text=f"{sop_translation.title}. {step.text}",
                    language=language.value,
                )
                for step in sop_translation.steps
            )
    return passages


def _normalise(question: str) -> str:
    return re.sub(r"\s+", " ", question.strip().lower())


def _record_gap(question: str, language: Language, role_id: str | None) -> Gap:
    normalised = _normalise(question)
    for gap in _GAPS.values():
        if _normalise(gap.question) == normalised and gap.status is GapStatus.OPEN:
            gap.count += 1
            gap.last_seen = _now()
            return gap
    role = _ROLES.get(role_id) if role_id else None
    gap = Gap(
        id=_new_id("gap"),
        question=question,
        language=language,
        sector=role.sector if role else Sector.TEXTILE,
        role_id=role_id,
        count=1,
        status=GapStatus.OPEN,
        first_seen=_now(),
        last_seen=_now(),
    )
    with _LOCK:
        _GAPS[gap.id] = gap
    return gap


def answer_question(question: str, language: Language, role_id: str | None) -> QueryResponse:
    global _QUESTIONS_TOTAL, _COVERED_TOTAL
    matches = rank(question, _approved_passages())
    _QUESTIONS_TOTAL += 1

    if not matches:
        gap = _record_gap(question, language, role_id)
        return QueryResponse(
            covered=False,
            answer=GAP_ANSWER,
            language=language,
            confidence=0.0,
            citations=[],
            gap_id=gap.id,
            disclaimer=DISCLAIMER,
        )

    _COVERED_TOTAL += 1
    best_score, best_passage = matches[0]
    sop = _SOPS[best_passage.sop_id]
    english = sop.translations.get(Language.EN) or next(iter(sop.translations.values()))
    answer = "\n".join(f"{step.order}. {step.text}" for step in english.steps)
    engine = "identity"
    review_required = False

    generated = llm.generate_answer(
        question,
        Language.EN,
        english.title,
        [(step.order, step.text) for step in english.steps],
    )
    if generated:
        answer = generated
        engine = "llm"

    source_answer = answer
    if language is not Language.EN:
        translated = translation.translate(answer, language)
        answer = translated.text
        engine = translated.engine
        review_required = translated.review_required

    citations = [
        Citation(
            sop_id=passage.sop_id,
            version=passage.version,
            step=passage.step,
            quote=passage.text,
        )
        for _, passage in matches
    ]
    return QueryResponse(
        covered=True,
        answer=answer,
        source_answer=source_answer,
        language=language,
        confidence=round(min(0.95, 0.5 + best_score), 2),
        citations=citations,
        translation_engine=engine,
        review_required=review_required,
        disclaimer=DISCLAIMER,
    )


def list_gaps() -> list[Gap]:
    return sorted(_GAPS.values(), key=lambda gap: (gap.status is not GapStatus.OPEN, -gap.count))


def promote_gap(gap_id: str) -> Gap | None:
    with _LOCK:
        gap = _GAPS.get(gap_id)
        if gap is None:
            return None
        gap.status = GapStatus.PROMOTED
        gap.last_seen = _now()
        return gap


# ---------------------------------------------------------------------------
# Skills and analytics
# ---------------------------------------------------------------------------


def list_roles() -> list[Role]:
    return sorted(_ROLES.values(), key=lambda role: role.name)


def translation_memory() -> list[tuple[str, dict[Language, str]]]:
    """Curated EN -> FR/Kreol pairs from published SOPs, used for instant translation."""
    pairs: list[tuple[str, dict[Language, str]]] = []
    for sop in _SOPS.values():
        if sop.status is not SopStatus.PUBLISHED:
            continue
        english = sop.translations.get(Language.EN)
        if english is None:
            continue
        for language, translated in sop.translations.items():
            if language is Language.EN:
                continue
            pairs.append((english.title, {language: translated.title}))
            for source_step, target_step in zip(
                english.steps, translated.steps, strict=False
            ):
                pairs.append((source_step.text, {language: target_step.text}))
    return pairs


def summary() -> AnalyticsSummary:
    published = sum(1 for sop in _SOPS.values() if sop.status is SopStatus.PUBLISHED)
    in_review = sum(1 for sop in _SOPS.values() if sop.status is SopStatus.IN_REVIEW)
    open_gaps = sum(1 for gap in _GAPS.values() if gap.status is GapStatus.OPEN)
    covered_rate = round(_COVERED_TOTAL / _QUESTIONS_TOTAL, 2) if _QUESTIONS_TOTAL else 0.0
    return AnalyticsSummary(
        questions_total=_QUESTIONS_TOTAL,
        covered_rate=covered_rate,
        gaps_open=open_gaps,
        sops_published=published,
        sops_in_review=in_review,
        languages=[Language.EN, Language.FR, Language.CR],
    )
