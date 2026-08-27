import { homeEditorialContent } from "@/data/home-editorial-content";

type WhyContent = typeof homeEditorialContent.why;

export function WhyChooseMe({ content }: { content: WhyContent }) {
  return (
    <section
      id="about"
      className="bg-[var(--pp-ivory)] px-4 py-24 text-[var(--pp-text-dark)] sm:px-8 lg:px-10 xl:px-16"
    >
      <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h2 className="pp-display max-w-4xl text-5xl leading-[0.95] sm:text-7xl">
            {content.title}
          </h2>
          <div className="mt-10 border-t border-[var(--pp-line-light)] pt-6">
            <p className="font-semibold">{content.name}</p>
            <p className="mt-1 text-sm text-black/60">{content.role}</p>
            <a href={content.href} className="mt-6 inline-flex text-sm font-semibold">
              Повече за мен →
            </a>
          </div>
        </div>

        <ol className="border-t border-[var(--pp-line-light)]">
          {content.points.map((point, index) => (
            <li
              key={point}
              className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[var(--pp-line-light)] py-6"
            >
              <span className="text-xs font-semibold">0{index + 1}</span>
              <span className="text-lg">{point}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
