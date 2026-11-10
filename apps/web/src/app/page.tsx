import { AskPanel } from "@/components/ask-panel";
import { ExpertDiscovery } from "@/components/expert-discovery";

const navigation = ["Discover", "Conversations", "Audience", "Knowledge", "Gaps", "Profile"];

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
                  index === 0 ? "bg-white/[0.07] text-zinc-100" : "text-zinc-400"
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
            <NavIcon index={5} />
            More
          </div>
        </div>
      </aside>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-12 px-5 pb-20 pt-8 md:pl-64">
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
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Find people who&apos;ve been there
          </h1>
          <p className="max-w-xl text-base leading-7 text-zinc-400">
            Describe your situation. Get the perspective of global industry thinkers
            and Mauritian operators, supervisors and leaders — with the sources behind
            every answer.
          </p>
        </header>

        <ExpertDiscovery />

        <section className="flex flex-col gap-4 border-t border-white/10 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Or ask the approved line</h2>
              <p className="text-sm text-zinc-500">
                Answers restricted to supervisor-approved work instructions. Every
                answer cites the SOP version; nothing matches, nothing is invented.
              </p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-zinc-400">
              EN · FR · Kreol, live
            </span>
          </div>
          <AskPanel />
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-zinc-600">
          <p>
            Sector packs: textile and apparel, food manufacturing, light engineering
            and precision.
          </p>
          <p>
            Public-record profiles are built from public material and are not
            endorsed by the named people. Composite profiles are fictional. Claim a
            mind to correct or remove it.
          </p>
        </footer>
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
  "M4 6h16M4 12h16M4 18h10",
];

function NavIcon({ index }: { index: number }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d={navPaths[index] ?? navPaths[0]} />
    </svg>
  );
}
