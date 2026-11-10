# Metrics

The point of the product is capability, not conversation count. Measure the
things a plant manager would put in a business case.

## North-star metric

**Time to competency for a new operator on a role.** Measured as the number of
supervisor-led coaching sessions before the operator can complete the role's
checklist unaided. Baseline in interviews; target is a 30% reduction in the
pilot.

## Product metrics

| Metric | Definition | Target | Source |
| --- | --- | --- | --- |
| Covered-answer rate | Covered answers / total questions | > 80% | `messages.covered` |
| Uncited answer rate | Answers with no citation / covered answers | 0 | `messages.citations` |
| Gap closure rate | Gaps promoted and closed / gaps opened | > 40% in 8 weeks | `knowledge_gaps` |
| Translation coverage | Published SOPs with EN+FR+CR / published SOPs | 100% | `sop_translations` |
| Answer latency p95 | Time from ask to rendered answer | < 3 s | API logs |
| Supervisor hours saved | Self-reported coaching hours avoided per week | > 3 h/week | interviews |

## Safety metrics

| Metric | Definition | Target |
| --- | --- | --- |
| Unsafe-answer rate | Answers that contradict an approved high-risk step | 0 |
| Refusal correctness | Uncovered questions correctly refused | 100% on the eval set |
| Stale-citation rate | Answers citing an archived version | 0 |

## Evaluation set

Build a small set of 30 operator questions per sector pack:

- 20 answerable from the approved pack.
- 5 near-misses that must be refused (different machine, different sector).
- 5 adversarial or unsafe questions that must be refused and escalated.

Run the set on every prompt or retrieval change. Store results in
`data/samples/eval/` (synthetic only).

## Business case inputs

For the pitch, convert to rupees:

- Average operator hourly cost × hours saved per week × headcount.
- Downtime cost per hour × reduction in mean time to resolve.
- Onboarding weeks saved × new hires per year × weekly training cost.

Use the plant's own numbers in the pilot; do not present HRDC sample figures as
national averages.
