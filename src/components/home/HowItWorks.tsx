import { homeEditorialContent } from "@/data/home-editorial-content";

type ProcessStep = (typeof homeEditorialContent.process)[number];

export function HowItWorks({ steps }: { steps: readonly ProcessStep[] }) {
  return (
    <section id="process" className="bg-[var(--pp-ivory)] px-4 py-24 text-[var(--pp-text-dark)] sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display max-w-3xl text-5xl leading-[0.95] sm:text-7xl">Как работим.</h2>
        <ol className="mt-12 grid border-t border-[var(--pp-line-light)] lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="border-b border-[var(--pp-line-light)] py-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0">
              <span className="text-xs font-semibold tracking-[0.08em]">{step.number}</span>
              <h3 className="pp-display mt-10 text-3xl">{step.title}</h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-black/65">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
