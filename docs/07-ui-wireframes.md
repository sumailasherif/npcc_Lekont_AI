# UI wireframes

Blueprint: Holistics (workspace sidebar + dashboard canvas + AI answer surface).
Colours and motion are Lekont's: indigo/violet, soft off-white, animated
counters, chart draw-in, staggered cards.

## Shell

```
+------------------------------------------------------------------+
| L Lekont  [Demo]      search…            [Ask AI]  (SS)          |
+----------+-------------------------------------------------------+
| Overview |                                                       |
| Documents|   page content                                        |
| Ask AI   |                                                       |
| Readiness|                                                       |
|          |                                                       |
| Sources  |                                                       |
| [Synthetic demo]                                                 |
+----------+-------------------------------------------------------+
```

- Sticky translucent header, gradient logo mark.
- Sidebar items fade-up on load; active item is an indigo gradient.
- Data source card shows Postgres status and seed counts.

## Overview `/`

```
Workspace · Overview                         [+ Add document]
Back office overview
[Documents] [Needs review] [Spend this month] [Readiness]
[ Cash outflow chart (area, animated)      ] [ Ask AI gradient card ]
[ Recent documents table                    ]
[ Top supplier ] [ Next best action ]
```

- KPI numbers count up once.
- Area chart draws its line, then dots pop in staggered.
- Table rows lift on hover; confidence is a mini bar.

## Documents `/documents`

```
Documents                                    [Export CSV] [+ Add]
[All] [Needs review]
+---------------------------+  +-----------------------------+
| table: file/party/total   |  | selected document            |
| status, confidence        |  | fields with confidence       |
|                           |  | editable inputs              |
|                           |  | reviewer + Approve           |
+---------------------------+  +-----------------------------+
```

- Add form: filename, type, language, pasted document text.
- Low-confidence fields are amber.
- Detail panel slides in; approval updates the row without reload.

## Ask AI `/ask`

```
Ask your spreadsheet
[ question................................ ] [Ask]
[suggestion chips]
+--------------------------------------------------+
| answer + confidence                              |
| calculation (dark code block)                    |
| chart (bar or line)                              |
| table of underlying rows                         |
| caveats + follow-up chips                        |
+--------------------------------------------------+
```

- Answer card fades up; bars grow from left; line draws.
- The calculation is always visible. No number without its inputs.

## Readiness `/readiness`

```
Automation readiness
+--------------------------+  +----------------------+
| sector / employees       |  | score /100 + band    |
| invoices / payslips      |  | recommended first    |
| admin hours              |  | process bars         |
| tools chips              |  | next steps           |
| pain chips               |  |                      |
| [Run the check]          |  |                      |
+--------------------------+  +----------------------+
```

- Score appears with a scale-in; bars animate to their value.
- Empty state explains the diagnostic before it runs.

## States

| State | Treatment |
| --- | --- |
| Loading | Skeleton shimmer for the chart; "Loading documents…" row |
| Empty | Explanatory card, not a blank table |
| Error | Rose banner with the API hint (`port 8010`) |
| Not covered | Ask returns the supported intents and suggestions |
| Offline | In-memory demo still works; Postgres warning in logs |
