import Image from "next/image";
import Link from "next/link";
import { homeEditorialContent } from "@/data/home-editorial-content";

type WorkItem = (typeof homeEditorialContent.selectedWork)[number];

const layout = {
  wide: "md:col-span-8 aspect-[16/9]",
  tall: "md:col-span-4 md:row-span-2 aspect-[3/4]",
} as const;

export function SelectedWork({ items }: { items: readonly WorkItem[] }) {
  return (
    <section
      id="portfolio"
      className="bg-[var(--pp-ink)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16"
    >
      <div className="mx-auto max-w-[92rem]">
        <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <h2 className="pp-display text-5xl sm:text-7xl">Избрана работа.</h2>
          <Link href="/portfolio" className="inline-flex text-sm font-semibold">
            Разгледай цялото портфолио →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-12">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group relative overflow-hidden rounded-[0.45rem] ${layout[item.ratio]}`}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
                <p className="text-xs font-semibold tracking-[0.08em] text-white">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
