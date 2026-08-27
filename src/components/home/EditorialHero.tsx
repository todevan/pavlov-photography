import Image from "next/image";
import { homeEditorialContent } from "@/data/home-editorial-content";

type EditorialHeroContent = typeof homeEditorialContent.hero;

interface EditorialHeroProps {
  content: EditorialHeroContent;
}

export function EditorialHero({ content }: EditorialHeroProps) {
  const accessibleTitle = `${content.title.lead} ${content.title.accent}${content.title.tail ?? ""}`;

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[var(--pp-ink)] px-4 pb-14 pt-24 sm:px-8 sm:pb-16 sm:pt-28 lg:px-10 xl:px-16"
    >
      <div className="mx-auto grid w-full max-w-[92rem] gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div className="relative z-10 max-w-2xl">
          <h1
            aria-label={accessibleTitle}
            className="pp-display text-[clamp(4.1rem,8vw,7.5rem)] leading-[0.82] tracking-[-0.055em] text-[var(--pp-warm-white)]"
          >
            <span className="block">{content.title.lead}</span>
            <span className="block italic text-[var(--pp-brass)]">
              {content.title.accent}
              {content.title.tail}
            </span>
          </h1>

          <div className="mt-9 flex flex-wrap gap-3 sm:mt-12">
            <a href="#contact" className="pp-button-primary">
              {content.primaryCta}
            </a>
            <a href="#services" className="pp-button-secondary">
              {content.secondaryCta}
            </a>
          </div>
        </div>

        <div className="pp-hero-spread relative min-h-[24rem] sm:min-h-[32rem] lg:min-h-[43rem]">
          {content.images.map((image, index) => (
            <div key={image.src} className={`pp-hero-frame pp-hero-frame-${index + 1}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 78vw, 42vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
