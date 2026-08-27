import Image from "next/image";
import Link from "next/link";
import { homeEditorialContent } from "@/data/home-editorial-content";

type VideoContent = typeof homeEditorialContent.video;

export function VideoFeature({ content }: { content: VideoContent }) {
  return (
    <section id="videography" className="bg-[var(--pp-ink)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.45rem]">
          <Image src={content.image.src} alt={content.image.alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
        </div>
        <div className="pb-1">
          <h2 className="pp-display text-5xl leading-[0.95] sm:text-7xl">{content.title}</h2>
          <p className="mt-5 text-lg font-semibold text-[var(--pp-brass)]">{content.price}</p>
          <p className="mt-5 max-w-lg text-base leading-7 text-[var(--pp-muted)]">{content.description}</p>
          <Link href={content.href} className="mt-8 inline-flex text-sm font-semibold text-[var(--pp-warm-white)]">
            Виж видеография →
          </Link>
        </div>
      </div>
    </section>
  );
}
