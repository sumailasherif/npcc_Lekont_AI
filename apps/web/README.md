# @lekont/web

Next.js 16 (App Router, TypeScript, Tailwind CSS 4) front end for **Lekont**.

Pages:

- `/` — overview: KPIs, cash-outflow chart, recent documents, quick Ask AI
- `/documents` — extract, review, approve and export documents
- `/ask` — plain-language questions with calculation, table and chart
- `/readiness` — six-process automation diagnostic

Design blueprint: Holistics workspace (sidebar + dashboard canvas + AI answer
surface), with Lekont's own indigo/violet palette and motion.

Run from the repository root with `npm run dev`, or from this folder with
`npm run dev`. Copy `.env.local` and point `NEXT_PUBLIC_API_URL` at the API
(`http://localhost:8010` in the demo).
