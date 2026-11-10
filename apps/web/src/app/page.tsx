const pipeline = [
  {
    step: "1",
    title: "Capture",
    body: "A supervisor records a 10-minute voice note or uploads an existing SOP and fault-code list.",
  },
  {
    step: "2",
    title: "Ground",
    body: "Sources are chunked and embedded so every answer cites the approved paragraph it came from.",
  },
  {
    step: "3",
    title: "Draft & translate",
    body: "The draft is generated in English, French and Kreol, then edited by the supervisor.",
  },
  {
    step: "4",
    title: "Approve",
    body: "Nothing reaches an operator until a named supervisor signs off. Versions are immutable.",
  },
  {
    step: "5",
    title: "Learn",
    body: "Questions the knowledge base cannot answer become skills gaps, not confident guesses.",
  },
];

const metrics = [
  { label: "Questions answered from approved content", value: "target > 80%" },
  { label: "Unsafe or uncited answers", value: "target 0" },
  { label: "Supervisor coaching hours saved / week", value: "to measure" },
  { label: "Languages per published instruction", value: "EN / FR / Kreol" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16">
      <header className="flex flex-col gap-4">
        <span className="w-fit rounded-full border border-black/10 px-3 py-1 text-xs font-medium tracking-wide uppercase dark:border-white/15">
          NPCC National AI Startups Lab
        </span>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
          Retenou AI
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Capture an expert&apos;s know-how once, publish supervisor-approved work
          instructions in English, French and Kreol, and turn the questions
          operators cannot answer into a live skills-gap map.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-500">
          How it works
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pipeline.map((item) => (
            <li
              key={item.step}
              className="flex flex-col gap-2 rounded-xl border border-black/10 p-4 dark:border-white/15"
            >
              <span className="font-mono text-xs text-zinc-500">
                {item.step}
              </span>
              <span className="font-medium">{item.title}</span>
              <span className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {item.body}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-500">
          What we measure
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col gap-1 rounded-xl border border-black/10 p-4 dark:border-white/15"
            >
              <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                {metric.label}
              </dt>
              <dd className="text-lg font-semibold">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="mt-auto flex flex-col gap-2 border-t border-black/10 pt-6 text-sm text-zinc-600 dark:border-white/15 dark:text-zinc-400">
        <p>
          Sector packs: textile and apparel, food manufacturing, light
          engineering and precision.
        </p>
        <p>
          Documents live in <code className="font-mono">docs/</code>. The API
          runs from <code className="font-mono">apps/api</code>.
        </p>
      </footer>
    </main>
  );
}
