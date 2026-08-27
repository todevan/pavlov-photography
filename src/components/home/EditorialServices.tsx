import Image from "next/image";
import Link from "next/link";
import { homeEditorialContent } from "@/data/home-editorial-content";

type EditorialService = (typeof homeEditorialContent.services)[number];

interface EditorialServicesProps {
  services: readonly EditorialService[];
}

export function EditorialServices({ services }: EditorialServicesProps) {
  return (
    <section
      id="services"
      className="scroll-mt-24 text-[var(--pp-text-dark)]"
      style={{
        background:
          "linear-gradient(180deg, var(--pp-ink) 0rem, #23211e 10rem, #625d53 24rem, var(--pp-ivory) 38rem, var(--pp-ivory) 100%)",
      }}
    >
      <div className="mx-auto max-w-[92rem] px-4 pb-24 pt-40 sm:px-8 sm:pt-48 lg:px-10 xl:px-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.category}
              href={service.href}
              className="group block overflow-hidden rounded-[0.45rem] border border-black/10 bg-[var(--pp-paper)] text-[var(--pp-text-dark)] no-underline"
            >
              {service.image ? (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-[#24211d] text-[var(--pp-warm-white)]">
                  <span className="text-xs font-semibold tracking-[0.24em] text-[var(--pp-brass)]">
                    PRODUCT
                  </span>
                  <span className="pp-display text-3xl italic">COMMERCIAL</span>
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="pp-display text-3xl leading-none sm:text-4xl">{service.title}</h2>
                  <p className="shrink-0 text-sm font-semibold">{service.startingPrice}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-black/65">{service.audience}</p>
                <span className="mt-7 inline-flex text-sm font-semibold">Виж пакетите →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
