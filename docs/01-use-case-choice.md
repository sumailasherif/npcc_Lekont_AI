# Use-case choice

Decision: **Opportunity area 9 (know-how capture and multilingual work
instructions) combined with the skills-mapping half of area 8.** Area 7
(business intelligence readiness) and area 1 (predictive maintenance) were
considered and rejected for the MVP.

## Why 9 + part of 8

| Criterion | Area 9 | Area 8 | Combined (our scope) |
| --- | --- | --- | --- |
| Evidence strength (HRDC brief) | Strong (S6, S7, S8) | Medium (S4, S5, S6) | Strong foundation, medium extension |
| Data needed | SOPs, voice notes, manuals | Sensitive HR data | SOPs + voice + role requirements; no HR records |
| Safety risk | Wrong instruction | Unfair inference about people | Managed by supervisor approval |
| Buyer | Supervisor / training officer | HR | Supervisor; HR is a secondary stakeholder |
| Demo feasibility | High | Low | High |

The two combine into one loop: a role's skill requirements show where capability
is thin, and generated multilingual instructions close the gap. The obvious
combination would also include attrition prediction, but that is deliberately
excluded: it needs sensitive data, raises fairness risk, and the evidence is
weaker.

## Why not area 1 (predictive maintenance)

- Evidence is strong (S2, S6, S7, S8) and the business case is clear, but the
  data is the problem: maintenance logs are paper, and a credible demo needs
  factory access or months of history.
- The brief's own candidate solution is a maintenance assistant, which drifts
  toward the same knowledge-capture problem we are solving, but with a safety
  context that is harder for a student team to validate.
- It remains the strongest fallback if a factory partner appears.

## Why not area 7 (business intelligence readiness)

- Evidence is medium (S1, S2, S4), the market is crowded with BI tools, and the
  "ask your spreadsheet" idea is easy to replicate.
- It does not use the distinctive Mauritian context (multilingual workforce,
  expatriate operators, ageing experts).

## Why the sector is not only textile

The need repeats across textile, food and light engineering:

- Textile: shrinking, ageing workforce and reliance on foreign labour (S6).
- Food: expatriate shares from about 15% to 65% (S7).
- Light engineering: shortage of production problem-solvers and succession risk
  (S8).

So the product is sector-agnostic with **sector packs** (SOPs, fault codes, role
skills). Textile is the first pack because its evidence is the most detailed.

## Scope cuts

- No attrition prediction.
- No HRIS integration.
- No sensor or IoT input.
- No consumer expert marketplace.
- No automatic publish without a named approver.
