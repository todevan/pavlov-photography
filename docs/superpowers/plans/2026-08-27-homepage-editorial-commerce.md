# Homepage Editorial Commerce Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved site-wide Editorial Commerce visual system to the homepage first, producing a cleaner full-viewport dark opening, a gradual dark-to-warm page rhythm, image-led commercial proof, simplified booking flow, and no visual regressions on non-home routes.

**Architecture:** Keep the existing Next.js app and business/data layer. Introduce homepage-scoped design tokens and a `home-editorial` shell so Phase 1 cannot accidentally restyle brochure routes. Replace the current component-heavy homepage composition with focused server-first sections, while preserving the existing Formspree contact logic and `BeforeAfterSlider` interaction. Critical content must remain visible in SSR HTML; Framer Motion is not required for homepage visibility.

**Tech Stack:** Next.js 16.2.3, React 19.2.4, TypeScript 5, Tailwind CSS 4, Vitest 4.1.4, Testing Library, Playwright 1.59.1, Next Image, existing Formspree contact integration.

**Spec:** `docs/superpowers/specs/2026-08-27-homepage-editorial-commerce-design.md`

## Global Constraints

- The visual system is site-wide; Phase 1 implementation changes the homepage only.
- `/about`, `/services`, `/services/*`, `/portfolio`, and `/portfolio/*` must not receive unintended Phase 1 restyling.
- The initial viewport must be one complete dark composition; the next light section must not visibly intrude on normal desktop or mobile viewport heights.
- Hero content is limited to navigation, `Снимки, които продават.`, the two actions `Запази снимане` and `Виж услугите`, and photography.
- Do not render the removed eyebrow, decorative line, supporting paragraph, trust signals, service cards, icons, or emoji-like metadata inside the hero.
- The hero-to-content transition must be gradual; no hard black-to-white cut immediately below the hero.
- Do not present Unsplash or other stock imagery as Teodor Pavlov's portfolio work.
- One owner-approved product photograph must exist at `public/portfolio/product-service.jpg` before Task 1 can become green. Do not substitute stock imagery for this file.
- Critical headings, service names, prices, portfolio proof, and booking controls must be visible without JavaScript animation.
- Preserve the existing Formspree endpoint and form validation behavior unless a test proves an existing defect.
- Preserve keyboard access for the before/after slider, mobile menu, FAQ, and form controls.
- Respect `prefers-reduced-motion`.
- Do not add dependencies unless an existing dependency cannot satisfy a requirement.
- Push implementation to a feature branch and use a Vercel Preview for visual approval. Do not merge to `main` until the owner approves the preview.

---

## File Structure

### Create

- `src/data/home-editorial-content.ts` — canonical structured content for the new homepage composition, derived from existing truthful content where possible.
- `src/data/home-editorial-content.test.ts` — truth/asset guard preventing stock imagery from entering hero, service, or selected-work data.
- `src/components/home/SelectedWork.tsx` — asymmetric owner-work proof section.
- `src/components/home/BeforeAfterFeature.tsx` — large before/after proof wrapper around the existing slider.
- `src/components/home/WhyChooseMe.tsx` — condensed About/trust content.
- `src/components/home/VideoFeature.tsx` — simplified videography feature.
- `src/components/home/HowItWorks.tsx` — three-step process section.
- `src/components/home/editorial-sections.test.tsx` — focused unit coverage for the new static homepage sections.

### Modify

- `DESIGN.md` — retire the old OpenCode-derived visual direction and point agents to the approved site-wide Editorial Commerce system.
- `src/app/globals.css` — add non-breaking `--pp-*` design tokens and homepage-only selectors; suppress legacy body grid/pointer effects only when `.home-editorial` exists.
- `src/components/home/HomePage.tsx` — new section orchestration; remove `PointerGlow`, legacy `FooterCta`, and `FloatingCallButton` from the homepage opening experience.
- `src/components/home/Navbar.tsx` — minimal non-pill navigation and booking CTA.
- `src/components/home/Hero.tsx` — server-first full-viewport hero with image spread and no explanatory clutter.
- `src/components/home/Services.tsx` — static three-service commercial cards with starting prices and deep links.
- `src/components/home/Reviews.tsx` — three testimonials visible without carousel interaction.
- `src/components/home/Faq.tsx` — keep the interaction but present only the five booking-blocking questions.
- `src/components/home/Contact.tsx` — simplify visual layout while preserving form behavior.
- `src/components/home/home-page.test.tsx` — new homepage composition assertions.
- `src/components/home/navbar.test.tsx` — new navigation geometry/copy assertions.
- `src/components/home/services.test.tsx` — replace tab behavior tests with service-card/deep-link assertions.
- `src/components/home/reviews.test.tsx` — assert all three reviews are rendered simultaneously.
- `src/components/home/faq.test.tsx` — assert the shortened FAQ content and accordion behavior.
- `src/components/home/contact.test.tsx` — keep validation/submission coverage and assert simplified booking copy.
- `tests/e2e/home.spec.ts` — rewrite homepage flow for the new architecture, viewport rules, SSR visibility, mobile layout, contact form, and no horizontal overflow.
- `tests/e2e/brochure-pages.spec.ts` — add explicit Phase 1 isolation smoke assertions for non-home routes.

### Reuse unchanged unless a failing test proves otherwise

- `src/components/ui/BeforeAfterSlider.tsx`
- `src/lib/contact.ts`
- `src/data/home-content.ts`
- `src/lib/content-types.ts` existing legacy interfaces
- `src/app/layout.tsx`
- dedicated brochure page components

---

### Task 1: Truthful editorial content and product-asset gate

**Files:**
- Create: `src/data/home-editorial-content.test.ts`
- Create: `src/data/home-editorial-content.ts`
- Modify: `DESIGN.md`
- Required asset: `public/portfolio/product-service.jpg`

**Interfaces:**
- Produces: `homeEditorialContent` with `hero`, `services`, `selectedWork`, `why`, `video`, `process`, `reviews`, `faq`, and `contact` properties.
- Later tasks consume the exact object exported as `homeEditorialContent`.

- [ ] **Step 1: Verify the owner-approved product asset is present**

Run from repo root:

```powershell
Test-Path "public\portfolio\product-service.jpg"
```

Expected: `True`.

If the result is `False`, stop this task and request the owner-approved product photograph. Do not use the existing Unsplash product images as a substitute.

- [ ] **Step 2: Write the failing truth/asset test**

Create `src/data/home-editorial-content.test.ts`:

```tsx
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("homeEditorialContent", () => {
  it("uses only local owner-approved imagery for hero, services, and selected work", () => {
    const imageSources = [
      ...homeEditorialContent.hero.images.map((image) => image.src),
      ...homeEditorialContent.services.map((service) => service.image.src),
      ...homeEditorialContent.selectedWork.map((item) => item.image),
    ];

    expect(imageSources.every((src) => src.startsWith("/portfolio/"))).toBe(true);
    expect(imageSources.some((src) => src.includes("images.unsplash.com"))).toBe(false);
  });

  it("requires the approved product photograph to exist", () => {
    expect(
      existsSync(join(process.cwd(), "public", "portfolio", "product-service.jpg")),
    ).toBe(true);
  });
});
```

- [ ] **Step 3: Run the focused test and verify RED**

Run:

```powershell
npm test -- src/data/home-editorial-content.test.ts
```

Expected: FAIL because `@/data/home-editorial-content` does not exist yet.

- [ ] **Step 4: Create the structured homepage data**

Create `src/data/home-editorial-content.ts` with this shape and truthful source values:

```ts
import { homeContent } from "@/data/home-content";

export const homeEditorialContent = {
  nav: [
    { label: "Работа", href: "#portfolio" },
    { label: "Услуги", href: "#services" },
    { label: "За мен", href: "#about" },
    { label: "Контакт", href: "#contact" },
  ],
  hero: {
    title: homeContent.hero.title,
    primaryCta: "Запази снимане",
    secondaryCta: "Виж услугите",
    images: [
      {
        src: "/portfolio/urban-apartment.png",
        alt: "Модерен градски апартамент с големи прозорци",
      },
      {
        src: "/portfolio/bmw-m-series.png",
        alt: "Бяло BMW на планински завой през есента",
      },
      {
        src: "/portfolio/product-service.jpg",
        alt: "Продуктова фотография от Pavlov Photography",
      },
    ],
  },
  services: [
    {
      category: "real-estate",
      title: "Недвижими имоти",
      startingPrice: "от €30",
      audience: "За брокери, агенции, Airbnb и частни обяви.",
      href: "/services/real-estate",
      image: {
        src: "/portfolio/urban-apartment.png",
        alt: "Градски апартамент с естествена светлина",
      },
    },
    {
      category: "automotive",
      title: "Автомобили",
      startingPrice: "от €20",
      audience: "За частни обяви, автокъщи и премиум listings.",
      href: "/services/automotive",
      image: {
        src: "/portfolio/bmw-m-series.png",
        alt: "BMW M Series автомобилна фотография",
      },
    },
    {
      category: "products",
      title: "Продукти",
      startingPrice: "от €30",
      audience: "За e-commerce, социални мрежи и рекламни кампании.",
      href: "/services/products",
      image: {
        src: "/portfolio/product-service.jpg",
        alt: "Продуктова фотография от Pavlov Photography",
      },
    },
  ],
  selectedWork: [
    {
      id: "bmw-m-series",
      label: "AUTOMOTIVE · BMW M SERIES",
      image: "/portfolio/bmw-m-series.png",
      alt: "Бяло BMW на планински завой през есента",
      href: "/portfolio/bmw-m-series",
      ratio: "wide",
    },
    {
      id: "ferrari-interior",
      label: "AUTOMOTIVE · INTERIOR DETAIL",
      image: "/portfolio/interior-detail.jpg",
      alt: "Бежов автомобилен интериор с дървени детайли",
      href: "/portfolio/ferrari-interior",
      ratio: "tall",
    },
    {
      id: "real-estate-living",
      label: "REAL ESTATE · SOFIA",
      image: "/portfolio/urban-apartment.png",
      alt: "Модерен градски апартамент с естествена светлина",
      href: "/portfolio/real-estate-living",
      ratio: "wide",
    },
    {
      id: "product-service",
      label: "PRODUCT · COMMERCIAL",
      image: "/portfolio/product-service.jpg",
      alt: "Продуктова фотография от Pavlov Photography",
      href: "/services/products",
      ratio: "square",
    },
  ],
  why: {
    title: "Професионално заснемане без излишно усложнение.",
    points: [
      "Ясна цена предварително",
      "Предаване до 24–48 часа",
      "Обработени готови файлове",
      "Директна комуникация с фотографа",
    ],
    name: "Теодор Павлов",
    role: "Commercial photographer · Sofia",
    href: "/about",
  },
  beforeAfter: homeContent.portfolio.beforeAfter,
  video: {
    title: "Видеография",
    price: "от €50 / видео",
    description: "Кратки cinematic видеа за имоти, автомобили и продукти.",
    href: "/services/videography",
    image: {
      src: "/portfolio/videography-hero.jpg",
      alt: "Кинематично видео заснемане",
    },
  },
  process: [
    { number: "01", title: "Запитване", text: "Казваш какво и кога трябва да снимаме." },
    {
      number: "02",
      title: "Заснемане",
      text: "Идвам на локация и изпълняваме предварително уточнения план.",
    },
    {
      number: "03",
      title: "Готовите кадри",
      text: "Получаваш обработените файлове до 24–48 часа.",
    },
  ],
  reviews: homeContent.reviews.featured,
  faq: homeContent.faq.items.slice(0, 5),
  contact: homeContent.contact,
} as const;
```

- [ ] **Step 5: Retire the stale OpenCode design reference**

Replace `DESIGN.md` with a short canonical pointer:

```md
# Pavlov Photography Design System

The previous OpenCode-derived terminal visual direction is retired.

The canonical site-wide visual system is:

`docs/superpowers/specs/2026-08-27-homepage-editorial-commerce-design.md`

Phase 1 applies that system to the homepage only. Other routes migrate later and must not be restyled accidentally by Phase 1 changes.
```

- [ ] **Step 6: Run the truth test and verify GREEN**

Run:

```powershell
npm test -- src/data/home-editorial-content.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add DESIGN.md src/data/home-editorial-content.ts src/data/home-editorial-content.test.ts public/portfolio/product-service.jpg
git commit -m "feat: define truthful editorial homepage content"
```

---

### Task 2: Homepage-scoped visual foundation

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/home/HomePage.tsx`
- Modify: `src/components/home/home-page.test.tsx`

**Interfaces:**
- Produces: `.home-editorial` root scope and `--pp-*` design tokens.
- Later homepage components rely on `--pp-ink`, `--pp-soft-black`, `--pp-warm-white`, `--pp-ivory`, `--pp-paper`, `--pp-text-dark`, and `--pp-brass`.

- [ ] **Step 1: Replace the old HomePage test with a failing scope test**

In `src/components/home/home-page.test.tsx`, add:

```tsx
import { render } from "@testing-library/react";
import { HomePage } from "@/components/home/HomePage";

describe("HomePage editorial shell", () => {
  it("scopes the new visual system to the homepage", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector(".home-editorial")).toBeInTheDocument();
  });

  it("does not mount the legacy pointer glow", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector('[data-testid="pointer-glow"]')).not.toBeInTheDocument();
  });
});
```

If `PointerGlow` does not expose a test id, remove the second assertion and instead assert in code review that `HomePage.tsx` no longer imports it. Do not add testing-only production markup.

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
npm test -- src/components/home/home-page.test.tsx
```

Expected: FAIL because `.home-editorial` is absent.

- [ ] **Step 3: Add new non-breaking design tokens and route scope**

Append to `src/app/globals.css` without changing the legacy `--background`, `--surface`, or existing brochure-route classes:

```css
:root {
  --pp-ink: #151515;
  --pp-soft-black: #1c1b19;
  --pp-warm-white: #f5f1e8;
  --pp-muted: #aaa297;
  --pp-ivory: #f2eee5;
  --pp-paper: #e9e2d6;
  --pp-text-dark: #191816;
  --pp-brass: #b79052;
  --pp-line-dark: rgba(245, 241, 232, 0.14);
  --pp-line-light: rgba(25, 24, 22, 0.14);
}

body:has(.home-editorial) {
  background: var(--pp-ink);
}

body:has(.home-editorial)::before,
body:has(.home-editorial)::after {
  opacity: 0;
}

.home-editorial {
  min-height: 100%;
  background: var(--pp-ink);
  color: var(--pp-warm-white);
}

.home-editorial .pp-display {
  font-family: var(--font-cormorant), serif;
}

@media (prefers-reduced-motion: reduce) {
  .home-editorial *,
  .home-editorial *::before,
  .home-editorial *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Scope HomePage and remove legacy ambient effects**

Change `HomePage.tsx` root to:

```tsx
export function HomePage() {
  return (
    <div className="home-editorial">
      <Navbar links={homeEditorialContent.nav} />
      <main className="relative overflow-x-clip">
        {/* existing sections remain temporarily; later tasks replace them */}
      </main>
    </div>
  );
}
```

Remove imports/usages of `PointerGlow` from `HomePage.tsx`. Do not change brochure layout components.

- [ ] **Step 5: Run focused and full unit tests**

```powershell
npm test -- src/components/home/home-page.test.tsx
npm test
```

Expected: focused test PASS; full suite PASS or only expected failures from tests intentionally replaced by later redesign tasks. If unrelated tests fail, stop and fix before continuing.

- [ ] **Step 6: Commit**

```powershell
git add src/app/globals.css src/components/home/HomePage.tsx src/components/home/home-page.test.tsx
git commit -m "feat: scope editorial visual system to homepage"
```

---

### Task 3: Minimal navbar and full-viewport hero

**Files:**
- Modify: `src/components/home/Navbar.tsx`
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/navbar.test.tsx`
- Create: `src/components/home/hero.test.tsx`
- Modify: `src/components/home/HomePage.tsx`

**Interfaces:**
- `Navbar` consumes `homeEditorialContent.nav`.
- `Hero` consumes `homeEditorialContent.hero` with `title`, `primaryCta`, `secondaryCta`, and `images`.

- [ ] **Step 1: Write failing navbar and hero tests**

Add/replace tests with:

```tsx
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/home/Hero";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("Hero", () => {
  it("renders only the approved opening copy and actions", () => {
    render(<Hero content={homeEditorialContent.hero} />);

    expect(screen.getByRole("heading", { name: "Снимки, които продават." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Запази снимане" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "Виж услугите" })).toHaveAttribute("href", "#services");

    expect(screen.queryByText(/Commercial Photography/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/24–48ч/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/София и региона/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/От €20/i)).not.toBeInTheDocument();
  });

  it("renders all approved hero photographs with meaningful alt text", () => {
    render(<Hero content={homeEditorialContent.hero} />);
    for (const image of homeEditorialContent.hero.images) {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    }
  });
});
```

Update `navbar.test.tsx` to assert brand, four links, booking CTA, and mobile menu button.

- [ ] **Step 2: Run focused tests and verify RED**

```powershell
npm test -- src/components/home/hero.test.tsx src/components/home/navbar.test.tsx
```

Expected: FAIL because current hero still renders description/stats/cards and old navbar geometry/copy.

- [ ] **Step 3: Rewrite Hero as server-first content**

Remove `"use client"`, `useState`, Framer Motion, `Reveal`, service-pricing events, stats, and hero service cards. Use `next/image` and a single composed spread.

Target structure:

```tsx
import Image from "next/image";
import { homeEditorialContent } from "@/data/home-editorial-content";

type HeroContent = typeof homeEditorialContent.hero;

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[var(--pp-ink)] px-4 pb-12 pt-24 sm:px-8 lg:px-10 xl:px-16"
    >
      <div className="mx-auto grid w-full max-w-[92rem] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="relative z-10 max-w-2xl">
          <h1 className="pp-display text-[clamp(4rem,8vw,7.5rem)] leading-[0.82] tracking-[-0.055em] text-[var(--pp-warm-white)]">
            <span className="block">{content.title.lead}</span>
            <span className="block italic text-[var(--pp-brass)]">
              {content.title.accent}{content.title.tail}
            </span>
          </h1>
          <div className="mt-9 flex flex-wrap gap-3 sm:mt-12">
            <a href="#contact" className="pp-button-primary">{content.primaryCta}</a>
            <a href="#services" className="pp-button-secondary">{content.secondaryCta}</a>
          </div>
        </div>

        <div className="relative min-h-[24rem] sm:min-h-[32rem] lg:min-h-[42rem]">
          {content.images.map((image, index) => (
            <div key={image.src} className={`pp-hero-frame pp-hero-frame-${index + 1}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index < 2}
                sizes="(max-width: 1024px) 80vw, 36vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Add the `pp-button-*` and `pp-hero-frame-*` scoped rules in `globals.css`; keep radii restrained and avoid card chrome.

- [ ] **Step 4: Simplify Navbar**

Keep scroll state and accessible mobile menu, but remove the floating capsule geometry. Use a simple full-width header, text brand, four links, and `Запази снимане` CTA.

Key structure:

```tsx
<header className="fixed inset-x-0 top-0 z-50">
  <div className={isScrolled || isOpen ? "pp-nav pp-nav-solid" : "pp-nav pp-nav-clear"}>
    <a href="#hero" className="pp-brand">PAVLOV PHOTOGRAPHY</a>
    <nav className="hidden lg:flex">...</nav>
    <a href="#contact" className="pp-nav-cta hidden lg:inline-flex">Запази снимане</a>
    <button aria-label={isOpen ? "Затвори менюто" : "Отвори менюто"}>...</button>
  </div>
</header>
```

- [ ] **Step 5: Render new hero in HomePage**

Use:

```tsx
<Hero content={homeEditorialContent.hero} />
```

- [ ] **Step 6: Run focused and full tests**

```powershell
npm test -- src/components/home/hero.test.tsx src/components/home/navbar.test.tsx src/components/home/home-page.test.tsx
npm test
```

Expected: PASS after replacing stale homepage tests that still depend on hero category cards.

- [ ] **Step 7: Commit**

```powershell
git add src/app/globals.css src/components/home/Navbar.tsx src/components/home/Hero.tsx src/components/home/HomePage.tsx src/components/home/hero.test.tsx src/components/home/navbar.test.tsx src/components/home/home-page.test.tsx
git commit -m "feat: build minimal full-viewport homepage hero"
```

---

### Task 4: Gradual hero transition and three-service commercial section

**Files:**
- Modify: `src/components/home/Services.tsx`
- Modify: `src/components/home/services.test.tsx`
- Modify: `src/components/home/HomePage.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- `Services` consumes `homeEditorialContent.services`.
- Each service item exposes `title`, `startingPrice`, `audience`, `href`, and `image`.

- [ ] **Step 1: Write failing service-card test**

Replace tab-specific assertions in `services.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import { Services } from "@/components/home/Services";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("Services", () => {
  it("shows three equal services with starting prices and deep links", () => {
    render(<Services services={homeEditorialContent.services} />);

    expect(screen.getByRole("link", { name: /Недвижими имоти/i })).toHaveAttribute(
      "href",
      "/services/real-estate",
    );
    expect(screen.getByRole("link", { name: /Автомобили/i })).toHaveAttribute(
      "href",
      "/services/automotive",
    );
    expect(screen.getByRole("link", { name: /Продукти/i })).toHaveAttribute(
      "href",
      "/services/products",
    );

    expect(screen.getByText("от €30")).toBeInTheDocument();
    expect(screen.getByText("от €20")).toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });
});
```

Use `getAllByText("от €30")` if the two €30 prices make the singular query ambiguous.

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
npm test -- src/components/home/services.test.tsx
```

Expected: FAIL because current Services uses tabs and package cards.

- [ ] **Step 3: Rewrite Services as static editorial cards**

Use a section with a CSS tonal bridge that begins dark and warms gradually before the actual ivory card area. Do not make the first pixel below hero pure white.

Core structure:

```tsx
import Image from "next/image";
import { homeEditorialContent } from "@/data/home-editorial-content";

type Service = (typeof homeEditorialContent.services)[number];

export function Services({ services }: { services: readonly Service[] }) {
  return (
    <section id="services" className="pp-services-transition scroll-mt-24">
      <div className="mx-auto max-w-[92rem] px-4 pb-24 pt-36 sm:px-8 lg:px-10 xl:px-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <a key={service.category} href={service.href} className="pp-service-card group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                />
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="pp-display text-3xl text-[var(--pp-text-dark)]">{service.title}</h2>
                  <p className="text-sm font-medium text-[var(--pp-text-dark)]">{service.startingPrice}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-black/65">{service.audience}</p>
                <span className="mt-7 inline-flex text-sm font-medium">Виж пакетите →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Add a scoped transition rule:

```css
.home-editorial .pp-services-transition {
  background: linear-gradient(
    180deg,
    var(--pp-ink) 0,
    #25231f 10rem,
    #655f54 22rem,
    var(--pp-ivory) 34rem,
    var(--pp-ivory) 100%
  );
}
```

- [ ] **Step 4: Place Services immediately after Hero**

In `HomePage.tsx`:

```tsx
<Hero content={homeEditorialContent.hero} />
<Services services={homeEditorialContent.services} />
```

- [ ] **Step 5: Run tests**

```powershell
npm test -- src/components/home/services.test.tsx src/components/home/home-page.test.tsx
npm test
```

Expected: PASS after stale hero-to-tab tests are removed from `home-page.test.tsx`.

- [ ] **Step 6: Commit**

```powershell
git add src/app/globals.css src/components/home/Services.tsx src/components/home/services.test.tsx src/components/home/HomePage.tsx src/components/home/home-page.test.tsx
git commit -m "feat: add editorial service pricing section"
```

---

### Task 5: Selected work and before/after proof

**Files:**
- Create: `src/components/home/SelectedWork.tsx`
- Create: `src/components/home/BeforeAfterFeature.tsx`
- Create/Modify: `src/components/home/editorial-sections.test.tsx`
- Modify: `src/components/home/HomePage.tsx`

**Interfaces:**
- `SelectedWork` consumes `homeEditorialContent.selectedWork`.
- `BeforeAfterFeature` consumes `homeEditorialContent.beforeAfter`.
- Reuses `BeforeAfterSlider` unchanged.

- [ ] **Step 1: Write failing proof-section tests**

Create `editorial-sections.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { SelectedWork } from "@/components/home/SelectedWork";
import { BeforeAfterFeature } from "@/components/home/BeforeAfterFeature";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("editorial proof sections", () => {
  it("renders only the curated owner-approved selected work", () => {
    render(<SelectedWork items={homeEditorialContent.selectedWork} />);
    expect(screen.getByText("AUTOMOTIVE · BMW M SERIES")).toBeInTheDocument();
    expect(screen.getByText("REAL ESTATE · SOFIA")).toBeInTheDocument();
    expect(screen.queryByText("Luxury Timepiece")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Разгледай цялото портфолио/i })).toHaveAttribute(
      "href",
      "/portfolio",
    );
  });

  it("keeps the existing before-after slider keyboard-accessible", () => {
    render(<BeforeAfterFeature content={homeEditorialContent.beforeAfter} />);
    expect(screen.getByRole("slider", { name: "Плъзгач преди и след" })).toBeInTheDocument();
    expect(screen.getByText("Снимането е половината работа.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test and verify RED**

```powershell
npm test -- src/components/home/editorial-sections.test.tsx
```

Expected: FAIL because the new components do not exist.

- [ ] **Step 3: Build SelectedWork**

Use one dominant wide image, one tall image, and two supporting images. Avoid equal card geometry.

Core data mapping:

```tsx
const layout = {
  wide: "md:col-span-8 aspect-[16/9]",
  tall: "md:col-span-4 md:row-span-2 aspect-[3/4]",
  square: "md:col-span-4 aspect-square",
} as const;
```

Each item is an `<a>` with a large `Image`, minimal label, and no heavy card border.

- [ ] **Step 4: Build BeforeAfterFeature**

Structure:

```tsx
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

export function BeforeAfterFeature({ content }: { content: ... }) {
  return (
    <section className="bg-[var(--pp-soft-black)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display text-5xl text-[var(--pp-warm-white)] sm:text-6xl">
          Снимането е половината работа.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--pp-muted)]">
          Всеки финален кадър преминава през корекция на светлина, цвят, перспектива и детайл.
        </p>
        <div className="mt-10">
          <BeforeAfterSlider
            beforeLabel="Преди"
            afterLabel="След"
            beforeImage={{ src: content.beforeImage, alt: `${content.alt} преди обработка` }}
            afterImage={{ src: content.afterImage, alt: `${content.alt} след обработка` }}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Add both sections to HomePage**

Order:

```tsx
<Services ... />
<SelectedWork items={homeEditorialContent.selectedWork} />
<WhyChooseMe ... />
<BeforeAfterFeature content={homeEditorialContent.beforeAfter} />
```

`WhyChooseMe` may remain absent until Task 6; during this task place `SelectedWork` followed directly by `BeforeAfterFeature`, then insert Task 6 sections in the final order.

- [ ] **Step 6: Run tests**

```powershell
npm test -- src/components/home/editorial-sections.test.tsx
npm test
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add src/components/home/SelectedWork.tsx src/components/home/BeforeAfterFeature.tsx src/components/home/editorial-sections.test.tsx src/components/home/HomePage.tsx
git commit -m "feat: add editorial portfolio proof sections"
```

---

### Task 6: Condensed trust, videography, and three-step process

**Files:**
- Create: `src/components/home/WhyChooseMe.tsx`
- Create: `src/components/home/VideoFeature.tsx`
- Create: `src/components/home/HowItWorks.tsx`
- Modify: `src/components/home/editorial-sections.test.tsx`
- Modify: `src/components/home/HomePage.tsx`

**Interfaces:**
- `WhyChooseMe` consumes `homeEditorialContent.why`.
- `VideoFeature` consumes `homeEditorialContent.video`.
- `HowItWorks` consumes `homeEditorialContent.process`.

- [ ] **Step 1: Extend the failing section tests**

Add:

```tsx
it("condenses trust into four proof points", () => {
  render(<WhyChooseMe content={homeEditorialContent.why} />);
  expect(screen.getByText("Ясна цена предварително")).toBeInTheDocument();
  expect(screen.getByText("Директна комуникация с фотографа")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Повече за мен/i })).toHaveAttribute("href", "/about");
});

it("presents videography as one concise feature", () => {
  render(<VideoFeature content={homeEditorialContent.video} />);
  expect(screen.getByText("от €50 / видео")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Виж видеография/i })).toHaveAttribute(
    "href",
    "/services/videography",
  );
  expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
});

it("renders the three-step process", () => {
  render(<HowItWorks steps={homeEditorialContent.process} />);
  expect(screen.getByText("01")).toBeInTheDocument();
  expect(screen.getByText("02")).toBeInTheDocument();
  expect(screen.getByText("03")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run focused tests and verify RED**

```powershell
npm test -- src/components/home/editorial-sections.test.tsx
```

Expected: FAIL for missing components.

- [ ] **Step 3: Implement WhyChooseMe**

Use an ivory surface, large editorial heading, four numbered/simple proof points, and a small identity block. No statistics cards.

- [ ] **Step 4: Implement VideoFeature**

Use `/portfolio/videography-hero.jpg` as one large image/visual with concise copy and one deep-link CTA. Do not render tabs or four feature cards.

- [ ] **Step 5: Implement HowItWorks**

Use three columns on desktop and a vertical sequence on mobile. No icons are required; the large `01 / 02 / 03` numbers provide hierarchy.

- [ ] **Step 6: Insert sections in final narrative order**

Update `HomePage.tsx` to:

```tsx
<Hero ... />
<Services ... />
<SelectedWork ... />
<WhyChooseMe content={homeEditorialContent.why} />
<BeforeAfterFeature ... />
<VideoFeature content={homeEditorialContent.video} />
<HowItWorks steps={homeEditorialContent.process} />
```

- [ ] **Step 7: Run tests**

```powershell
npm test -- src/components/home/editorial-sections.test.tsx src/components/home/home-page.test.tsx
npm test
```

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add src/components/home/WhyChooseMe.tsx src/components/home/VideoFeature.tsx src/components/home/HowItWorks.tsx src/components/home/editorial-sections.test.tsx src/components/home/HomePage.tsx
git commit -m "feat: add trust video and process sections"
```

---

### Task 7: Static reviews, short FAQ, and simplified booking section

**Files:**
- Modify: `src/components/home/Reviews.tsx`
- Modify: `src/components/home/reviews.test.tsx`
- Modify: `src/components/home/Faq.tsx`
- Modify: `src/components/home/faq.test.tsx`
- Modify: `src/components/home/Contact.tsx`
- Modify: `src/components/home/contact.test.tsx`
- Modify: `src/components/home/HomePage.tsx`

**Interfaces:**
- `Reviews` consumes `homeEditorialContent.reviews`.
- `Faq` consumes `homeEditorialContent.faq`.
- `Contact` consumes `homeEditorialContent.contact` and preserves `submitContactForm()` / `validateContactForm()`.

- [ ] **Step 1: Write failing review/FAQ/booking expectations**

Reviews test:

```tsx
it("renders all three testimonials without carousel interaction", () => {
  render(<Reviews content={homeEditorialContent.reviews} />);
  expect(screen.getAllByRole("article")).toHaveLength(3);
  expect(screen.queryByRole("button", { name: /Следващ отзив/i })).not.toBeInTheDocument();
});
```

FAQ test:

```tsx
it("renders exactly the five booking-blocking questions", () => {
  render(<Faq items={homeEditorialContent.faq} />);
  expect(screen.getAllByRole("button")).toHaveLength(5);
  expect(screen.getByRole("button", { name: "Кога ще получа снимките?" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Кога се заплаща услугата?" })).toBeInTheDocument();
});
```

Contact test should retain existing validation and successful submission cases and add:

```tsx
expect(screen.getByRole("heading", { name: "Нека заснемем следващия ви проект." })).toBeInTheDocument();
expect(screen.getByText("Имоти · Автомобили · Продукти · Видео")).toBeInTheDocument();
```

- [ ] **Step 2: Run focused tests and verify RED**

```powershell
npm test -- src/components/home/reviews.test.tsx src/components/home/faq.test.tsx src/components/home/contact.test.tsx
```

Expected: FAIL because current reviews are carousel-based and Contact uses the old card-heavy presentation.

- [ ] **Step 3: Rewrite Reviews as a static three-card editorial grid**

Keep all three existing quotes. One may span more columns, but all three must exist in DOM and be visible without interaction.

- [ ] **Step 4: Simplify FAQ**

Keep the existing accessible accordion behavior, but pass only `homeEditorialContent.faq` and use clean light-surface separators instead of heavy cards.

- [ ] **Step 5: Simplify Contact while preserving form logic**

Keep the existing state machine and `handleSubmit()` implementation. Replace the left-side stack of six contact cards with a compact heading/category/phone block.

Target outer structure:

```tsx
<section id="contact" className="bg-[var(--pp-ink)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
  <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
    <div>
      <h2 className="pp-display text-5xl sm:text-7xl">Нека заснемем следващия ви проект.</h2>
      <p className="mt-6 text-sm uppercase tracking-[0.12em] text-[var(--pp-muted)]">
        Имоти · Автомобили · Продукти · Видео
      </p>
      <a className="mt-8 inline-flex text-lg" href={`tel:${content.phone}`}>
        0889 755 406
      </a>
    </div>
    <form onSubmit={handleSubmit} noValidate>...</form>
  </div>
</section>
```

Retain labels `Име`, `Телефон`, `Тип заснемане`, `Съобщение`, submit text `Изпрати запитване`, validation messages, success message, and rate-limit error handling.

- [ ] **Step 6: Add Reviews, FAQ, and Contact to HomePage**

Final tail order:

```tsx
<HowItWorks ... />
<Reviews content={homeEditorialContent.reviews} />
<Faq items={homeEditorialContent.faq} />
<Contact content={homeEditorialContent.contact} />
```

Do not render the old `FooterCta` after Contact.

- [ ] **Step 7: Run focused and full tests**

```powershell
npm test -- src/components/home/reviews.test.tsx src/components/home/faq.test.tsx src/components/home/contact.test.tsx
npm test
```

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add src/components/home/Reviews.tsx src/components/home/reviews.test.tsx src/components/home/Faq.tsx src/components/home/faq.test.tsx src/components/home/Contact.tsx src/components/home/contact.test.tsx src/components/home/HomePage.tsx
git commit -m "feat: simplify homepage trust and booking flow"
```

---

### Task 8: Final homepage orchestration and targeted legacy cleanup

**Files:**
- Modify: `src/components/home/HomePage.tsx`
- Modify: `src/components/home/home-page.test.tsx`
- Potentially delete only proven-unreferenced homepage files after search: `About.tsx`, `Terms.tsx`, `FooterCta.tsx`, `Videography.tsx`, old `Portfolio.tsx`
- Potentially delete their obsolete tests only if the corresponding component is deleted and has no remaining consumer.

**Interfaces:**
- `HomePage` becomes the sole orchestration layer for Phase 1 sections.

- [ ] **Step 1: Write final composition assertions**

Update `home-page.test.tsx` to assert the required section order by DOM position:

```tsx
it("renders the approved conversion narrative in order", () => {
  const { container } = render(<HomePage />);
  const ids = Array.from(container.querySelectorAll("main > section[id]")).map(
    (node) => node.id,
  );

  expect(ids).toEqual([
    "hero",
    "services",
    "portfolio",
    "about",
    "before-after",
    "videography",
    "process",
    "reviews",
    "faq",
    "contact",
  ]);
});
```

Each new component must expose the matching id from this list.

- [ ] **Step 2: Remove opening-view clutter from HomePage**

Ensure `HomePage.tsx` no longer imports or renders:

- `PointerGlow`
- `FloatingCallButton`
- `FooterCta`
- old About/Terms/Videography/Portfolio sections

The new homepage should be:

```tsx
export function HomePage() {
  return (
    <div className="home-editorial">
      <Navbar links={homeEditorialContent.nav} />
      <main className="relative overflow-x-clip">
        <Hero content={homeEditorialContent.hero} />
        <Services services={homeEditorialContent.services} />
        <SelectedWork items={homeEditorialContent.selectedWork} />
        <WhyChooseMe content={homeEditorialContent.why} />
        <BeforeAfterFeature content={homeEditorialContent.beforeAfter} />
        <VideoFeature content={homeEditorialContent.video} />
        <HowItWorks steps={homeEditorialContent.process} />
        <Reviews content={homeEditorialContent.reviews} />
        <Faq items={homeEditorialContent.faq} />
        <Contact content={homeEditorialContent.contact} />
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Prove legacy homepage files are unreferenced before deleting anything**

Run:

```powershell
rg -n "components/home/(About|Terms|FooterCta|Videography|Portfolio)" src tests
```

Expected after orchestration changes: only the files' own tests/imports, if any.

Delete a legacy file only when `rg` proves it has no production consumer. Do not delete shared UI components or brochure-page files.

- [ ] **Step 4: Run unit suite, lint, and build**

```powershell
npm test
npm run lint
npm run build
```

Expected: all three PASS.

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "refactor: finalize editorial homepage composition"
```

---

### Task 9: Responsive/SSR E2E verification and safe Vercel rollout

**Files:**
- Modify: `tests/e2e/home.spec.ts`
- Modify: `tests/e2e/brochure-pages.spec.ts`

**Interfaces:**
- Produces: executable release gate for homepage behavior, SSR visibility, route isolation, and preview approval.

- [ ] **Step 1: Replace stale homepage E2E assertions**

Rewrite the first test in `tests/e2e/home.spec.ts` around the new flow:

```ts
test("desktop editorial homepage keeps the opening minimal and completes booking flow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route("https://formspree.io/f/mnjoooke", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Снимки, които продават." })).toBeVisible();
  await expect(page.locator("#hero")).not.toContainText("Commercial Photography");
  await expect(page.locator("#hero")).not.toContainText("24–48ч");
  await expect(page.locator("#hero")).not.toContainText("София и региона");
  await expect(page.locator("#hero")).not.toContainText("От €20");

  const servicesTop = await page.locator("#services").evaluate(
    (element) => element.getBoundingClientRect().top,
  );
  expect(servicesTop).toBeGreaterThanOrEqual(890);

  await page.getByRole("link", { name: "Виж услугите" }).click();
  await expect(page.locator("#services")).toBeInViewport();
  await expect(page.getByRole("link", { name: /Недвижими имоти/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Автомобили/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Продукти/i })).toBeVisible();

  await expect(page.locator("#reviews article")).toHaveCount(3);

  const slider = page.getByRole("slider", { name: "Плъзгач преди и след" });
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "55");

  await page.getByRole("button", { name: "Включена ли е обработката в цената?" }).click();
  await expect(page.getByText(/Стандартната обработка включва светлина/)).toBeVisible();

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByLabel("Име").fill("Иван Петров");
  await page.getByLabel("Телефон").fill("0888 123 456");
  await page.getByLabel("Тип заснемане").selectOption("Автомобили");
  await page.getByLabel("Съобщение").fill("Търся автомобилна фотосесия за обява.");
  await page.getByRole("button", { name: "Изпрати запитване" }).click();
  await expect(page.getByText(/Запитването беше изпратено успешно/i)).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});
```

Keep the existing 429 Formspree test.

- [ ] **Step 2: Add mobile opening test**

```ts
test("mobile opening remains dark, minimal, and uncluttered", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Снимки, които продават." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Обади се сега" })).toHaveCount(0);

  const servicesTop = await page.locator("#services").evaluate(
    (element) => element.getBoundingClientRect().top,
  );
  expect(servicesTop).toBeGreaterThanOrEqual(834);

  await page.getByRole("button", { name: "Отвори менюто" }).click();
  await expect(page.locator('a[href="#portfolio"]').last()).toBeVisible();
  await expect(page.locator('a[href="#contact"]').last()).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});
```

- [ ] **Step 3: Add JavaScript-disabled SSR visibility test**

```ts
test("critical homepage content is visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Снимки, които продават." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Запази снимане" })).toBeVisible();
  await expect(page.locator("#services")).toContainText("Недвижими имоти");
  await expect(page.locator("#services")).toContainText("от €20");
  await expect(page.locator("#portfolio")).toContainText("BMW M SERIES");

  await context.close();
});
```

- [ ] **Step 4: Add non-home Phase 1 isolation assertions**

In `tests/e2e/brochure-pages.spec.ts`, add:

```ts
test("phase 1 homepage scope does not leak onto brochure routes", async ({ page }) => {
  for (const route of ["/about", "/services", "/services/automotive", "/portfolio"]) {
    await page.goto(route);
    await expect(page.locator(".home-editorial")).toHaveCount(0);
    await expect(page.locator("main")).toBeVisible();
  }
});
```

- [ ] **Step 5: Run complete local release gate**

Run in order:

```powershell
npm test
npm run lint
npm run build
npm run test:e2e
```

Expected: all PASS.

- [ ] **Step 6: Perform manual responsive visual review before pushing**

Run:

```powershell
npm run dev
```

Inspect at minimum:

- 390×844 mobile
- 768×1024 tablet
- 1280×800 desktop
- 1440×900 desktop
- 1920×1080 large desktop

Verify:

- first viewport contains no visible ivory strip;
- H1 and both CTAs remain legible;
- image spread crops intentionally;
- no hero trust metadata exists;
- dark-to-warm transition feels gradual rather than like a white cut;
- service cards remain equal in weight;
- selected work feels asymmetric/editorial;
- no horizontal overflow;
- FAQ, slider, and mobile menu remain keyboard/touch usable.

- [ ] **Step 7: Push implementation branch and obtain Vercel Preview**

Do not implement on `main`. At execution time create a dedicated implementation branch/worktree from the approved design branch, for example:

```powershell
git checkout -b feat/homepage-editorial-commerce

git push -u origin feat/homepage-editorial-commerce
```

Expected: Vercel creates a Preview deployment from this branch.

- [ ] **Step 8: Verify preview deployment**

Use Vercel project `pavlov-photography` and confirm:

- deployment state is `READY`;
- source repository is `todevan/pavlov-photography`;
- branch is `feat/homepage-editorial-commerce`;
- build completes with Next.js 16.2.3;
- preview homepage visibly matches the approved design direction;
- `/about`, `/services`, `/services/automotive`, and `/portfolio` still render normally.

- [ ] **Step 9: Owner visual approval gate**

Show the owner the Vercel Preview. Do not merge to `main` until the owner explicitly approves the preview.

- [ ] **Step 10: Merge/push to production only after approval**

After explicit approval, merge the implementation branch into `main` without force-push, then verify the production deployment is `READY` and aliases include:

- `pavlovphotography.eu`
- `www.pavlovphotography.eu`

Finally fetch the live homepage and verify the server HTML contains the H1 and service copy without hidden-by-default `opacity: 0` wrappers.

- [ ] **Step 11: Commit final E2E gate changes before rollout**

```powershell
git add tests/e2e/home.spec.ts tests/e2e/brochure-pages.spec.ts
git commit -m "test: gate editorial homepage rollout"
```

---

## Final Acceptance Checklist

- [ ] Site-wide design direction is documented; Phase 1 CSS is homepage-scoped.
- [ ] Hero shows only navigation, headline, two CTAs, and photography.
- [ ] No eyebrow line, supporting paragraph, trust metadata, emoji-like icons, or hero service cards.
- [ ] Hero fills the initial viewport on mobile and desktop.
- [ ] No light/ivory strip is visible at first load.
- [ ] Dark-to-light transition is gradual and CSS-driven.
- [ ] Three services are equally weighted and show starting prices immediately after the transition.
- [ ] Product image is owner-approved and local.
- [ ] Selected Work uses only owner-approved local images.
- [ ] Before/after remains keyboard-accessible.
- [ ] Videography is one concise feature, not a tab system.
- [ ] Three reviews are visible without carousel interaction.
- [ ] FAQ contains exactly five booking-blocking questions.
- [ ] Contact form behavior and Formspree endpoint remain intact.
- [ ] No floating call CTA clutters the opening mobile viewport.
- [ ] Critical content is visible with JavaScript disabled.
- [ ] No horizontal overflow at mobile/tablet/desktop checkpoints.
- [ ] Unit tests, lint, build, and Playwright all pass.
- [ ] Non-home brochure routes remain functional and outside `.home-editorial` scope.
- [ ] Vercel Preview receives explicit visual approval before production merge.
- [ ] Production domain returns the approved new homepage after merge.
