import { AskPanel } from "@/components/ask-panel";

const navigation = ["Discover", "Conversations", "Knowledge", "Gaps", "Profile"];

const categories = [
  "Textile & apparel",
  "Food manufacturing",
  "Light engineering",
  "Safety",
  "Maintenance",
  "Traceability",
  "Quality",
];

const prompts = [
  {
    sector: "Textile & apparel",
    title: "Ask a senior operator about clearing an overlock jam",
    detail: "5 approved steps · EN · FR · Kreol",
    tone: "bg-[#7b2d5e]",
  },
  {
    sector: "Food manufacturing",
    title: "Ask a supervisor about a missing lot number",
    detail: "HACCP traceability · escalation path",
    tone: "bg-[#efe9dc] text-[#1a1a1a]",
  },
  {
    sector: "Light engineering",
    title: "Ask a technician about spindle vibration",
    detail: "Fault code SP-402 · 5 approved steps",
    tone: "bg-[#0f5f56]",
  },
];

const stats = [
  { label: "Sector packs", value: "3" },
  { label: "Languages", value: "EN · FR · Kreol" },
  { label: "Uncited answers", value: "0" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08080a] text-zinc-100">
      <div className="pointer-events-none absolute left-1/2 top-[-140px] h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute left-1/2 top-[-260px] h-[760px] w-[760px] -translate-x-1/2 rounded-full border border-white/[0.05]" />
      <div className="pointer-events-none absolute left-1/2 top-[-380px] h-[1000px] w-[1000px] -translate-x-1/2 rounded-full border border-white/[0.035]" />

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col justify-between border-r border-white/10 px-4 py-6 md:flex">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2 px-2">
            <LogoMark />
            <span className="text-lg font-semibold tracking-tight">Retenou</span>
          </div>

          <nav className="flex flex-col gap-1">
            {navigation.map((item, index) => (
              <div
                key={item}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                  index === 0
                    ? "bg-white/[0.07] text-zinc-100"
                    : "text-zinc-400"
                }`}
              >
                <NavIcon index={index} />
                {item}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-orange-500/60 px-3 py-2 text-sm font-medium text-orange-300"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[10px] text-white">
              +
            </span>
            Add knowledge
          </button>
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-500">
            <NavIcon index={4} />
            More
          </div>
        </div>
      </aside>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 pb-16 pt-8 md:pl-64">
        <div className="flex items-center justify-between">
          <div className="w-10" />
          <div className="relative">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#3b4a5a] text-lg font-semibold text-zinc-200">
              S
            </div>
            <span className="absolute -right-16 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-xs text-zinc-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              3 gaps to review
            </span>
          </div>
          <span className="w-10 text-right text-xs text-zinc-500">Saved</span>
        </div>

        <header className="flex flex-col items-center gap-3 text-center">
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-zinc-500">
            NPCC National AI Startups Lab
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Ask the people who&apos;ve run this line
          </h1>
          <p className="max-w-xl text-base leading-7 text-zinc-400">
            Describe the situation. Get the answer grounded in supervisor-approved
            work instructions, in English, French or Kreol.
          </p>
        </header>

        <AskPanel />

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category, index) => (
            <span
              key={category}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
                index === 0
                  ? "bg-orange-500 text-white"
                  : "bg-white/[0.06] text-zinc-300"
              }`}
            >
              {category}
            </span>
          ))}
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">Ask the line</h2>
            <span className="text-xs text-zinc-500">Synthetic demo data</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {prompts.map((prompt) => (
              <article
                key={prompt.title}
                className={`flex min-h-[170px] flex-col justify-between rounded-2xl p-4 ${prompt.tone}`}
              >
                <span className="text-[11px] font-medium uppercase tracking-wide opacity-70">
                  {prompt.sector}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold leading-5">{prompt.title}</h3>
                  <p className="text-xs opacity-70">{prompt.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-zinc-500">
                {stat.label}
              </span>
              <span className="text-lg font-semibold">{stat.value}</span>
            </div>
          ))}
        </section>

        <p className="text-center text-xs text-zinc-600">
          Every answer cites an approved SOP version. If nothing matches, the
          question becomes a skills gap for a supervisor to review.
        </p>
      </main>
    </div>
  );
}

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 7c4-3 8-3 12 0M4 12c4-3 8-3 12 0M4 17c4-3 8-3 12 0" />
      <path d="M18 5l2 2-2 2" />
    </svg>
  );
}

const navPaths = [
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3 6-2 5-5 2 2-5 5-2Z",
  "M4 6h16v10H8l-4 4V6Z",
  "M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v5H4v-5Zm9 0h7v5h-7v-5Z",
  "M4 19V5m5 14V9m5 10v-6m5 6V7",
  "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
];

function NavIcon({ index }: { index: number }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d={navPaths[index]} />
    </svg>
  );
}
