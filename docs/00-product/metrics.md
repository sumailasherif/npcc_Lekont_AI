# Metrics

## Product

| Metric | Definition | Target |
| --- | --- | --- |
| Extraction precision | Fields correct / fields extracted | > 95% |
| Correction rate | Fields edited before approval | < 15% |
| Straight-through documents | Approved with no edits | > 50% |
| Time to approve | Upload → approval | < 1 day |
| Answer coverage | Questions mapped to a supported intent | > 90% |
| Readiness completion | Assessments finished / started | > 70% |

## Safety and trust

| Metric | Definition | Target |
| --- | --- | --- |
| Uncited answers | Answers without a calculation or rows | 0 |
| Unreviewed exports | Exports without a named reviewer | 0 |
| PII incidents | Real personal data in the repo or demo | 0 |
| Scope refusals | Off-intent questions correctly refused | 100% |

## Business

| Metric | Definition | Target |
| --- | --- | --- |
| Hours saved per month | Reviewer time avoided per SME | 6–10 h |
| Cost per document | Run cost (LLM + storage) per document | < MUR 2 |
| Willingness to pay | Interviews: monthly price accepted | MUR 1,500–3,500 |
| Pilot conversion | Interviews → pilot | > 30% |

## Instrumentation

The demo exposes `/api/v1/dashboard/summary`; a pilot adds event logging for
upload, review, export, ask and readiness completion, with no document content in
logs.
