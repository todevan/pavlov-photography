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
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[var(--pp-ink)] px-5 pb-20 pt-28 sm:px-10 sm:pb-24 sm:pt-32 lg:px-14 xl:px-20"
    >
      <div className="mx-auto grid w-full max-w-[100rem] gap-14 sm:gap-16 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-20">
        <div className="relative z-10 max-w-[44rem]">
          <h1
            aria-label={accessibleTitle}
            className="pp-display text-[clamp(4.4rem,8.2vw,7.8rem)] leading-[0.82] tracking-[-0.055em] text-[var(--pp-warm-white)]"
          >
            <span className="block">{content.title.lead}</span>
            <span className="block italic text-[var(--pp-brass)]">
              {content.title.accent}
              {content.title.tail}
            </span>
          </h1>

          <div className="mt-12 flex flex-wrap gap-4 sm:mt-14">
            <a href="#contact" className="pp-button-primary">
              {content.primaryCta}
            </a>
            <a href="#services" className="pp-button-secondary">
              {content.secondaryCta}
            </a>
          </div>
        </div>

        <div className="pp-hero-spread relative min-h-[26rem] sm:min-h-[36rem] lg:min-h-[46rem]">
          {content.images.map((image, index) => (
            <div key={image.src} className={`pp-hero-frame pp-hero-frame-${index + 1}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 82vw, 48vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
