import Image from "next/image";
import { homeEditorialContent } from "@/data/home-editorial-content";

type EditorialService = (typeof homeEditorialContent.services)[number];

interface EditorialServicesProps {
  services: readonly EditorialService[];
}

export function EditorialServices({ services }: EditorialServicesProps) {
  return (
    <section id="services" className="pp-services-transition scroll-mt-24">
      <div className="mx-auto max-w-[92rem] px-4 pb-24 pt-40 sm:px-8 sm:pt-48 lg:px-10 xl:px-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <a key={service.category} href={service.href} className="pp-service-card group">
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
                <div className="pp-service-placeholder aspect-[4/3]">
                  <span>PRODUCT</span>
                  <span>COMMERCIAL</span>
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="pp-display text-3xl leading-none text-[var(--pp-text-dark)] sm:text-4xl">
                    {service.title}
                  </h2>
                  <p className="shrink-0 text-sm font-semibold text-[var(--pp-text-dark)]">
                    {service.startingPrice}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-6 text-black/65">{service.audience}</p>
                <span className="mt-7 inline-flex text-sm font-semibold text-[var(--pp-text-dark)]">
                  Виж пакетите →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
