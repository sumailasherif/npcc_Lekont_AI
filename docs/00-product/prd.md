# PRD - Retenou AI

Status: draft for the NPCC National AI Startups Lab
Owner: Sherif Sumaila
Last updated: 10 November 2026

## 1. Problem

Mauritian manufacturers are adopting machines and digital systems faster than
they can build the people who run them. The HRDC sector reports describe the
same pattern in textile, food and light engineering: technology investment
without a matching skills investment produces limited returns, and the weakest
layer is the supervisors, technicians and maintenance staff in the middle.

Two concrete consequences:

1. Expert know-how sits in a few people's heads and on paper. When an expert is
   on leave, retires or leaves, the knowledge leaves with them.
2. A large share of operators are expatriates who do not read English or
   French comfortably. Instructions exist, but not in a form they can use at the
   machine.

Training and translation are the usual answers, and both are slow: a supervisor
repeats the same explanation every shift, and translation is done once, offline,
and goes stale.

## 2. Product

Retenou AI captures an expert's know-how once, turns it into a supervisor
approved work instruction, publishes it in English, French and Kreol, and learns
from the questions operators cannot answer.

The product is a loop, not a chatbot:

```
capture -> ground -> draft -> translate -> approve -> ask -> gaps -> capture
```

The interface borrows the pattern popularised by Delphi (a "digital mind" you can
ask): a discover surface, a knowledge surface, conversations and a profile. The
difference is that answers are constrained to approved work instructions and the
output an operator acts on is a versioned SOP card, not a conversational reply.

## 3. Users

- **Operator** (including expatriate operators): needs a short, correct answer at
  the machine, in a language they read.
- **Senior operator / technician**: the expert whose know-how is captured.
- **Supervisor / training officer**: owns the SOP, approves what is published,
  and uses gaps to plan coaching.
- **Plant / HR manager**: buys the product; wants onboarding time and coaching
  hours down, and audit evidence up.

See `personas-and-jtbd.md`.

## 4. Jobs to be done

- When a machine jams, I want to know the safe next step without finding the
  supervisor.
- When I onboard an expatriate operator, I want the instruction in their
  language without waiting for a translation agency.
- When an expert retires, I want their method captured before they leave.
- When an auditor asks for evidence, I want to show the approved version that was
  in force on that date.
- When the same question keeps coming back, I want it turned into an instruction
  or a coaching session.

## 5. Scope

### In scope (MVP)

- Text and voice capture of an expert explanation, plus upload of an existing SOP.
- Grounded question answering over approved content, with citations.
- Draft, translate (EN/FR/Kreol) and supervisor approval.
- Gap log from unanswered questions, with a promote-to-SOP action.
- Role skill matrix (requirements only; no attrition prediction).

### Out of scope

- Attrition prediction or any scoring of individual employees.
- HRIS / payroll integration.
- Sensor-based predictive maintenance.
- Consumer expert marketplace or discovery of outside experts.
- Automatic publication without human approval.

## 6. Requirements

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| R1 | Ask in three languages | An operator can pick EN, FR or Kreol and receive the answer in that language |
| R2 | Cite the source | Every covered answer lists SOP id, version and step |
| R3 | Refuse when unsure | If no approved passage matches, the answer says so and creates a gap |
| R4 | Human approval | Nothing is published without a named supervisor, and each publish increments the version |
| R5 | Capture from voice | A supervisor can record an explanation and get an editable draft |
| R6 | Gap report | Supervisors see the most frequent unanswered questions and can promote one to a draft |
| R7 | Sector packs | Textile, food and light engineering share one schema; a pack is data, not code |
| R8 | Data protection | Only synthetic data in the repo; real data stays in Supabase with access control |

## 7. Success metrics

See `metrics.md`. Headline targets:

- More than 80% of operator questions answered from approved content.
- Zero uncited or unsafe answers in the demo set.
- Supervisor coaching hours saved per week, measured in interviews.
- Every published instruction available in three languages.

## 8. Risks

The full register is in `../08-project-plan-and-risks.md`. The four that shape
the product:

1. **Wrong instruction.** Mitigation: supervisor approval gate, versioning,
   citations, and an explicit refusal path.
2. **Kreol quality.** Mitigation: supervisor edits, site glossary, and a
   low-confidence flag.
3. **No factory access.** Mitigation: synthetic packs for the demo; two
   interviews minimum for evidence.
4. **Scope creep.** Mitigation: the out-of-scope list above is binding for the
   challenge.
