# UI wireframes

The visual language follows Delphi's dark, quiet layout: a left rail, a centred
question surface, category chips, and cards. The content is shop-floor, not
consumer advice.

## 1. Discover (implemented)

```
+----------+--------------------------------------------------+
| Retenou  |                    (timeline)                    |
|          |              [ S ] 3 gaps to review              |
| Discover |                                                  |
| Convers. |          Ask the people who've run this line     |
| Knowledge|      Describe the situation. Get their perspective.|
| Gaps     |   +------------------------------------------+   |
| Profile  |   | Ask about a jam, a lot number, a vibration|   |
|          |   |                        EN FR Kreol  mic Ask|   |
|          |   +------------------------------------------+   |
| Add      |   [Textile] [Food] [Light eng.] [Safety] ...     |
| knowledge|                                                  |
|          |   Ask the line                    Synthetic data |
| More     |   [purple card] [cream card] [teal card]         |
|          |   [Sector packs 3] [Languages] [Uncited 0]       |
+----------+--------------------------------------------------+
```

Current behaviour: the Ask panel calls `POST /api/v1/query` and renders the
answer with citations, or the gap acknowledgement. If the API is down it shows a
clear message instead of a fake answer.

## 2. Knowledge

```
+--------------------------------------------------------------+
| Knowledge                         [ + Upload ] [ Record ]   |
+--------------------------------------------------------------+
| Overlock jam procedure      PDF   textile   ready   12 chunks|
| Line 2 traceability guide   PDF   food      ready   24 chunks|
| CNC vibration checklist     audio light eng. ingesting  -    |
+--------------------------------------------------------------+
| Ingesting: 1   Needs review: 0   Failed: 0                    |
+--------------------------------------------------------------+
```

## 3. SOP authoring

```
+--------------------------------------------------------------+
| Draft: Clear a thread jam on the overlock machine            |
| Source: Overlock jam procedure.pdf     Language: EN          |
+---------------------------+----------------------------------+
| [ Record 10 min ]         | 1. Press the red stop button ... |
| [ Upload existing SOP ]   |    risk: high    [edit] [delete]  |
|                           | 2. Lift the presser foot ...      |
| Transcript:               | 3. Cut the tangled thread ...     |
| "So when it jams, first   | ...                              |
|  you stop the machine..." | [ Add step ]                      |
+---------------------------+----------------------------------+
| [ Generate steps ]  [ Translate FR CR ]  [ Submit for review ]|
+--------------------------------------------------------------+
```

## 4. Review queue

```
+--------------------------------------------------------------+
| Review queue (2)                                             |
+--------------------------------------------------------------+
| Overlock jam  v2   EN FR CR   [ diff ]  [ Reject ] [ Approve ]|
| Batch log     v1   EN FR      [ diff ]  [ Reject ] [ Approve ]|
+--------------------------------------------------------------+
| Approving publishes a new immutable version and records you.  |
+--------------------------------------------------------------+
```

## 5. Operator answer (mobile-first)

```
+--------------------------------+
| < Back        EN FR Kreol      |
+--------------------------------+
| Approved instruction           |
| confidence 92%                 |
|                                |
| 1. Press the red stop button.. |
| 2. Lift the presser foot...    |
| 3. Cut the tangled thread...   |
|                                |
| Source: sop-txt-001 v1 step 1  |
+--------------------------------+
| [ Was this useful? ] [ Ask ]   |
+--------------------------------+
```

If not covered:

```
| Not in the approved instructions yet.        |
| Logged for a supervisor. Gap #gap-004.       |
| [ Call supervisor ]                          |
```

## 6. Gaps

```
+--------------------------------------------------------------+
| Gaps                                        [ Export CSV ]   |
+--------------------------------------------------------------+
| 7x  How do I reset the overlock counter?   [Promote to SOP]  |
| 4x  Ki manyer netwaye difil anba platform?  [Promote to SOP]  |
| 3x  Escalation when a lot number is unread? [Promote to SOP]  |
+--------------------------------------------------------------+
```

## 7. Roles and skills

```
+--------------------------------------------------------------+
| Senior operator   textile   42 people                         |
| Machine setup      #### 3/4                                   |
| Fault diagnosis    ##   2/4   <- gap: 7 questions this month  |
| Quality check      ###  3/4                                   |
+--------------------------------------------------------------+
```

## States

Every screen needs empty, loading, error and refused states. The refused state
is a product feature, not an error page: it is how the system stays honest.
