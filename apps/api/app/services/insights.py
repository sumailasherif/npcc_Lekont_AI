"""Plain-language analytics over the ledger and an automation-readiness score.

The engine is deliberately constrained: deterministic intents, explicit
aggregations, and a visible calculation. It never free-forms SQL, so it cannot
confidently invent a number.
"""

from __future__ import annotations

from collections import defaultdict

from app.data.backoffice import LEDGER
from app.schemas.common import Language
from app.schemas.insights import (
    AskResponse,
    Chart,
    Column,
    DiagnosticRequest,
    DiagnosticResponse,
    ProcessScore,
)

MONTHS = {
    "january": "2026-01",
    "february": "2026-02",
    "march": "2026-03",
    "april": "2026-04",
    "may": "2026-05",
    "june": "2026-06",
    "july": "2026-07",
    "august": "2026-08",
    "september": "2026-09",
    "october": "2026-10",
    "november": "2026-11",
    "december": "2026-12",
}

SUGGESTED = [
    "Who are my top 5 suppliers by spend?",
    "How has my monthly spend changed?",
    "How much VAT did I pay in October?",
    "Where is my money going by category?",
    "What did I spend on payroll?",
    "What was my largest invoice?",
]


def _money(value: float) -> str:
    return f"MUR {value:,.0f}"


def _period() -> str:
    months = sorted({row["month"] for row in LEDGER})
    return f"{months[0]} to {months[-1]}"


def _supplier_rows() -> list[dict[str, str | float]]:
    totals: dict[str, float] = defaultdict(float)
    for row in LEDGER:
        if row["category"] == "Payroll":
            continue
        totals[row["supplier"]] += row["amount"]
    ranked = sorted(totals.items(), key=lambda item: item[1], reverse=True)[:5]
    return [{"supplier": name, "amount": round(value, 2)} for name, value in ranked]


def _monthly_rows() -> list[dict[str, str | float]]:
    totals: dict[str, float] = defaultdict(float)
    for row in LEDGER:
        totals[row["month"]] += row["amount"]
    return [
        {"month": month, "amount": round(value, 2)}
        for month, value in sorted(totals.items())
    ]


def _vat_rows() -> list[dict[str, str | float]]:
    totals: dict[str, float] = defaultdict(float)
    for row in LEDGER:
        totals[row["month"]] += row["vat"]
    return [
        {"month": month, "vat": round(value, 2)}
        for month, value in sorted(totals.items())
    ]


def _category_rows() -> list[dict[str, str | float]]:
    totals: dict[str, float] = defaultdict(float)
    for row in LEDGER:
        totals[row["category"]] += row["amount"]
    grand = sum(totals.values()) or 1.0
    return [
        {
            "category": category,
            "amount": round(value, 2),
            "share": round(value / grand * 100, 1),
        }
        for category, value in sorted(totals.items(), key=lambda item: item[1], reverse=True)
    ]


def _largest_rows() -> list[dict[str, str | float]]:
    rows = sorted(LEDGER, key=lambda row: row["amount"], reverse=True)[:5]
    return [
        {
            "date": row["date"],
            "supplier": row["supplier"],
            "amount": round(row["amount"], 2),
        }
        for row in rows
    ]


def _detect(question: str) -> tuple[str, str | None]:
    q = question.lower()
    for month, key in MONTHS.items():
        if month in q:
            return "month", key
    if any(token in q for token in ("supplier", "vendor", "fournisseur", "who did i pay")):
        return "suppliers", None
    if any(token in q for token in ("vat", "tva", "tax")):
        return "vat", None
    if any(token in q for token in ("category", "categories", "where is my money", "breakdown")):
        return "categories", None
    if any(token in q for token in ("payroll", "salary", "salaries", "wage", "payslip")):
        return "payroll", None
    if any(token in q for token in ("largest", "biggest", "most expensive", "top invoice")):
        return "largest", None
    if any(token in q for token in ("automate", "automation", "readiness", "what should i")):
        return "automation", None
    if any(token in q for token in ("month", "trend", "over time", "cash flow", "cashflow", "spend")):
        return "monthly", None
    return "unknown", None


def ask(question: str, language: Language = Language.EN) -> AskResponse:
    intent, month = _detect(question)

    if intent == "suppliers":
        rows = _supplier_rows()
        top = rows[0]
        answer = (
            f"{top['supplier']} is your largest supplier at {_money(float(top['amount']))}. "
            f"The top {len(rows)} suppliers account for "
            f"{_money(sum(float(row['amount']) for row in rows))} of purchases ({_period()})."
        )
        return AskResponse(
            intent=intent,
            answer=answer,
            calculation="SUM(amount) GROUP BY supplier ORDER BY amount DESC LIMIT 5; payroll excluded",
            columns=[Column(key="supplier", label="Supplier"), Column(key="amount", label="Spend (MUR)")],
            rows=rows,
            chart=Chart(type="bar", x="supplier", y="amount"),
            confidence=0.92,
            caveats=["Based on the 20 synthetic ledger rows.", "Payroll is excluded from supplier rankings."],
            suggested=SUGGESTED,
        )

    if intent == "monthly":
        rows = _monthly_rows()
        peak = max(rows, key=lambda row: float(row["amount"]))
        latest = rows[-1]
        change = float(latest["amount"]) - float(rows[0]["amount"])
        answer = (
            f"Spend peaked at {_money(float(peak['amount']))} in {peak['month']}. "
            f"In {latest['month']} it is {_money(float(latest['amount']))}, "
            f"{'up' if change >= 0 else 'down'} {_money(abs(change))} since {rows[0]['month']}."
        )
        return AskResponse(
            intent=intent,
            answer=answer,
            calculation="SUM(amount) GROUP BY month ORDER BY month",
            columns=[Column(key="month", label="Month"), Column(key="amount", label="Spend (MUR)")],
            rows=rows,
            chart=Chart(type="line", x="month", y="amount"),
            confidence=0.9,
            caveats=["Monthly totals include payroll and purchases."],
            suggested=SUGGESTED,
        )

    if intent == "vat":
        rows = _vat_rows()
        total = sum(float(row["vat"]) for row in rows)
        answer = (
            f"You recorded {_money(total)} of input VAT from {rows[0]['month']} to "
            f"{rows[-1]['month']}. October is {_money(float(rows[-2]['vat'])) if len(rows) > 1 else _money(total)}."
        )
        return AskResponse(
            intent=intent,
            answer=answer,
            calculation="SUM(vat) GROUP BY month",
            columns=[Column(key="month", label="Month"), Column(key="vat", label="VAT (MUR)")],
            rows=rows,
            chart=Chart(type="bar", x="month", y="vat"),
            confidence=0.9,
            caveats=["VAT is taken from the ledger, not recomputed from totals."],
            suggested=SUGGESTED,
        )

    if intent == "categories":
        rows = _category_rows()
        top = rows[0]
        answer = (
            f"{top['category']} is your biggest category at {_money(float(top['amount']))} "
            f"({top['share']}% of spend). Payroll and purchases are shown together."
        )
        return AskResponse(
            intent=intent,
            answer=answer,
            calculation="SUM(amount) GROUP BY category; share = category / total",
            columns=[
                Column(key="category", label="Category"),
                Column(key="amount", label="Spend (MUR)"),
                Column(key="share", label="Share (%)"),
            ],
            rows=rows,
            chart=Chart(type="bar", x="category", y="amount"),
            confidence=0.9,
            caveats=["Categories are assigned in the demo ledger."],
            suggested=SUGGESTED,
        )

    if intent == "payroll":
        totals: dict[str, float] = defaultdict(float)
        for row in LEDGER:
            if row["category"] == "Payroll":
                totals[row["month"]] += row["amount"]
        rows = [
            {"month": month, "amount": round(value, 2)}
            for month, value in sorted(totals.items())
        ]
        total = sum(totals.values())
        answer = (
            f"Payroll cost {_money(total)} across {len(rows)} months, "
            f"from {_money(rows[0]['amount'])} to {_money(rows[-1]['amount'])} per month."
        )
        return AskResponse(
            intent=intent,
            answer=answer,
            calculation="SUM(amount) WHERE category = 'Payroll' GROUP BY month",
            columns=[Column(key="month", label="Month"), Column(key="amount", label="Payroll (MUR)")],
            rows=rows,
            chart=Chart(type="line", x="month", y="amount"),
            confidence=0.9,
            caveats=["Payroll comes from the two synthetic payslips plus ledger rows."],
            suggested=SUGGESTED,
        )

    if intent == "largest":
        rows = _largest_rows()
        top = rows[0]
        answer = (
            f"The largest outflow is {_money(float(top['amount']))} to {top['supplier']} "
            f"on {top['date']}."
        )
        return AskResponse(
            intent=intent,
            answer=answer,
            calculation="ORDER BY amount DESC LIMIT 5",
            columns=[
                Column(key="date", label="Date"),
                Column(key="supplier", label="Paid to"),
                Column(key="amount", label="Amount (MUR)"),
            ],
            rows=rows,
            confidence=0.93,
            caveats=["Largest single ledger lines, not grouped by supplier."],
            suggested=SUGGESTED,
        )

    if intent == "month" and month is not None:
        rows = [row for row in LEDGER if row["month"] == month]
        if rows:
            total = sum(row["amount"] for row in rows)
            by_category: dict[str, float] = defaultdict(float)
            for row in rows:
                by_category[row["category"]] += row["amount"]
            top_category = max(by_category, key=by_category.get)
            return AskResponse(
                intent="month",
                answer=(
                    f"In {month} you spent {_money(total)}. The largest category was "
                    f"{top_category} at {_money(by_category[top_category])}."
                ),
                calculation=f"SUM(amount) WHERE month = '{month}' GROUP BY category",
                columns=[
                    Column(key="supplier", label="Supplier"),
                    Column(key="category", label="Category"),
                    Column(key="amount", label="Amount (MUR)"),
                ],
                rows=[
                    {
                        "supplier": row["supplier"],
                        "category": row["category"],
                        "amount": round(row["amount"], 2),
                    }
                    for row in rows
                ],
                confidence=0.9,
                caveats=[f"Only {len(rows)} ledger lines fall in {month}."],
                suggested=SUGGESTED,
            )

    if intent == "automation":
        return AskResponse(
            intent=intent,
            answer=(
                "Use the automation-readiness check to answer that. It scores invoicing, "
                "payroll, reporting, filing, supplier reconciliation and stock, then recommends "
                "the first process to automate based on effort and impact."
            ),
            calculation="No calculation: this is a recommendation, not an aggregate.",
            columns=[],
            rows=[],
            confidence=0.7,
            caveats=["Readiness is a structured self-assessment, not a prediction."],
            suggested=[
                "Which process should I automate first?",
                "Who are my top 5 suppliers by spend?",
                "How much VAT did I pay in October?",
            ],
        )

    return AskResponse(
        intent="unknown",
        answer=(
            "I can answer questions about suppliers, monthly spend, VAT, categories, "
            "payroll and your largest invoices. Try one of the suggestions below."
        ),
        calculation="No query ran.",
        columns=[],
        rows=[],
        confidence=0.4,
        caveats=["This engine only answers the listed intents."],
        suggested=SUGGESTED,
    )


def _clamp(value: int) -> int:
    return max(5, min(95, value))


def _impact(pain: bool, volume: bool) -> str:
    if pain and volume:
        return "high"
    if pain or volume:
        return "medium"
    return "low"


def diagnose(payload: DiagnosticRequest) -> DiagnosticResponse:
    tools = {tool.lower() for tool in payload.tools}
    pains = {pain.lower() for pain in payload.pain_points}

    base = 50
    if "excel" in tools:
        base += 10
    if "accounting software" in tools or "erp" in tools:
        base += 15
    if "paper" in tools:
        base -= 12
    if "whatsapp" in tools:
        base += 4
    if payload.admin_hours >= 30:
        base -= 10
    elif payload.admin_hours <= 12:
        base += 8
    if payload.monthly_invoices >= 100:
        base -= 8
    elif payload.monthly_invoices <= 20:
        base += 5
    readiness = _clamp(base)
    band = "Starting point" if readiness < 40 else "Ready for a first automation" if readiness < 70 else "Ready to scale"

    has_invoice_pain = "invoices" in pains or "invoice" in pains
    has_payroll_pain = "payroll" in pains or "payslips" in pains
    has_report_pain = "reporting" in pains or "reports" in pains
    has_file_pain = "filing" in pains or "documents" in pains
    has_supplier_pain = "supplier" in pains or "reconciliation" in pains
    has_stock_pain = "stock" in pains or "inventory" in pains

    high_invoices = payload.monthly_invoices >= 40
    high_payslips = payload.monthly_payslips >= 15

    scores = [
        ProcessScore(
            process="Invoice capture",
            score=_clamp(40 + (15 if high_invoices else 0) + (15 if has_invoice_pain else 0) + (10 if "excel" in tools else 0) - (10 if "accounting software" in tools else 0)),
            effort="low" if payload.monthly_invoices <= 60 else "medium",
            impact=_impact(has_invoice_pain, high_invoices),
            reason=f"{payload.monthly_invoices} invoices/month and {'a named pain' if has_invoice_pain else 'no named pain'}.",
        ),
        ProcessScore(
            process="Payroll",
            score=_clamp(35 + (15 if high_payslips else 0) + (20 if has_payroll_pain else 0) + (10 if "excel" in tools else 0) - (10 if "accounting software" in tools else 0)),
            effort="low" if payload.monthly_payslips <= 15 else "medium",
            impact=_impact(has_payroll_pain, high_payslips),
            reason=f"{payload.monthly_payslips} payslips/month.",
        ),
        ProcessScore(
            process="Reporting",
            score=_clamp(30 + (20 if payload.admin_hours >= 20 else 0) + (25 if has_report_pain else 0) + (10 if "excel" in tools else 0)),
            effort="low" if "excel" in tools else "medium",
            impact=_impact(has_report_pain, payload.admin_hours >= 20),
            reason=f"{payload.admin_hours} admin hours/month.",
        ),
        ProcessScore(
            process="Document filing",
            score=_clamp(30 + (15 if high_invoices else 0) + (20 if has_file_pain else 0)),
            effort="low",
            impact=_impact(has_file_pain, high_invoices),
            reason="Every invoice, payslip and contract has to be findable at audit time.",
        ),
        ProcessScore(
            process="Supplier reconciliation",
            score=_clamp(25 + (15 if high_invoices else 0) + (20 if has_supplier_pain else 0)),
            effort="medium",
            impact=_impact(has_supplier_pain, high_invoices),
            reason="Matching statements to invoices is manual and error-prone.",
        ),
        ProcessScore(
            process="Stock",
            score=_clamp(20 + (25 if has_stock_pain else 0)),
            effort="high",
            impact=_impact(has_stock_pain, False),
            reason="Needs item-level data before automation is worth it.",
        ),
    ]

    rank = {"high": 3, "medium": 2, "low": 1}
    candidates = [score for score in scores if score.effort in ("low", "medium")]
    recommended = max(candidates, key=lambda score: (rank[score.impact], score.score))
    summary = (
        f"Readiness {readiness}/100 ({band}). Start with {recommended.process}: "
        f"{recommended.impact} impact, {recommended.effort} effort."
    )

    next_steps = {
        "Invoice capture": [
            "Collect 20 recent invoices, in French and English.",
            "Run extraction and review only low-confidence fields.",
            "Export a clean CSV and reconcile one month against the bank.",
        ],
        "Payroll": [
            "Standardise the payslip layout for all employees.",
            "Extract gross, deductions and net; compare to the payroll journal.",
            "Keep a named reviewer accountable before any export.",
        ],
        "Reporting": [
            "List the five questions you ask every month.",
            "Point the ask-your-spreadsheet engine at one clean sheet.",
            "Check each answer against the calculation shown.",
        ],
        "Document filing": [
            "Agree a naming convention by type, supplier and date.",
            "Extract metadata automatically and store the original.",
            "Set a weekly review for documents that fail extraction.",
        ],
        "Supplier reconciliation": [
            "Start with the ten suppliers that account for most spend.",
            "Match invoices to statements and flag only exceptions.",
            "Escalate unmatched lines to the accountant, not the tool.",
        ],
        "Stock": [
            "Count and label items before automating anything.",
            "Record movements for four weeks.",
            "Only then consider forecasting or reorder points.",
        ],
    }.get(recommended.process, [])

    return DiagnosticResponse(
        readiness_score=readiness,
        band=band,
        recommended_first=recommended.process,
        summary=summary,
        scores=scores,
        next_steps=next_steps,
    )
