# WhatsApp chatbot

Lekont's WhatsApp bot is a **conversational assistant**, not a broadcast channel.
An owner messages a number the way they already message staff and suppliers; the
bot records sales, checks stock, drafts invoices, answers business questions and
reads notebook photos.

The same command engine powers:

- the **Meta Cloud API webhook** (`/api/v1/whatsapp/webhook`), and
- the **local simulator** (`/api/v1/whatsapp/simulate`), so the demo works
  without a Meta app.

## Conversation design

| User says | Bot does |
| --- | --- |
| "hi" / "bonjour" / "bonzour" | Greets and lists what it can do |
| "sold 3 bags at 250" | Records the sale, updates stock, shows today's total |
| "what is low in stock?" | Lists stock, flags items at or below reorder level |
| "add 10 copier paper" | Adds stock and confirms the new quantity |
| "invoice Ramesh 2500" | Creates an invoice draft in Documents for review |
| "how much did I sell today?" | Today and month totals, top item |
| "who are my top suppliers?" | Falls through to the ledger analytics answer |
| "remind me to call the supplier Friday" | Saves a reminder for the next report |
| sends a photo | Reads 3 notebook lines, shows a preview, waits for "post" |

The bot asks before writing irreversible data: notebook lines are only posted
after the owner replies **post**.

## Architecture

```
WhatsApp (Meta)  ──webhook──►  FastAPI  ──►  whatsapp.handle()
                                      │
Simulator (web) ──/simulate───────────┘
                                      ├── documents.create_document()  (invoice drafts)
                                      ├── insights.ask()              (ledger questions)
                                      └── Postgres (optional)
                                           whatsapp_messages
                                           stock_items
                                           sales
```

- Parsing is deterministic: regex and keyword intents, not free-form SQL.
- Replies are short and operational, with the number that changed.
- When `DATABASE_URL` is set, messages, stock and sales persist and are reloaded
  on startup; otherwise the in-memory demo is used.
- When `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` are set, replies are sent
  through the Graph API; otherwise the webhook only logs them.

## Meta setup

1. Create a Meta app, add the **WhatsApp** product and a test number.
2. Set the callback URL to `https://<host>/api/v1/whatsapp/webhook`.
3. Set the verify token to `WHATSAPP_VERIFY_TOKEN` (default `lekont-demo`).
4. Subscribe to the `messages` field.
5. Put `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` in the API environment.
6. Message the test number: `help`.

For local development, run a tunnel (ngrok, Cloudflare Tunnel) and use its HTTPS
URL as the callback.

## Data and privacy

- The demo uses synthetic numbers and documents; no real customer data.
- Messages are stored with a tenant id and deleted on request in a pilot.
- The bot does not expose another tenant's data; RLS policies are in
  `supabase/migrations/0003_whatsapp.sql`.
- Invoice drafts always need a named reviewer in Documents before export.
- Notebook OCR is a preview; nothing is posted without "post".

## Failure modes

| Failure | Behaviour |
| --- | --- |
| Meta credentials missing | Simulator still works; webhook logs only |
| Postgres unavailable | In-memory state; warning in logs |
| Unknown command | Menu with examples, no guess |
| Ambiguous sale without price | Asks for the price instead of inventing one |
| Photo confidence low | Shows a preview and asks for confirmation |

## What is intentionally out of scope

- Broadcast lists and marketing templates (this is a chatbot, not a channel).
- Payments inside WhatsApp.
- Automatic posting to the accounting package.
- Voice notes (roadmap; the transcript would use the same engine).
