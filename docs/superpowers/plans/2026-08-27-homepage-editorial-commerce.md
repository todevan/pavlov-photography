# Homepage Editorial Commerce Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved site-wide Editorial Commerce visual system to the homepage first, producing a minimal full-viewport dark opening, a gradual dark-to-warm scroll rhythm, image-led commercial proof, and a simpler booking path without visually changing non-home routes.

**Architecture:** Keep the existing Next.js app and business/data layer. Add homepage-only `--pp-*` tokens and a `.home-editorial` scope so Phase 1 cannot leak onto `/about`, `/services`, or portfolio routes. Rewrite homepage sections as focused server-first components where possible; keep only genuinely interactive pieces client-side: mobile navigation, FAQ, contact form, and the existing `BeforeAfterSlider`. Critical content must exist and remain visible in SSR HTML.

**Tech Stack:** Next.js 16.2.3, React 19.2.4, TypeScript 5, Tailwind CSS 4, Vitest 4.1.4, Testing Library, Playwright 1.59.1, Next Image, existing Formspree contact integration.

**Spec:** `docs/superpowers/specs/2026-08-27-homepage-editorial-commerce-design.md`

## Global Constraints

- The visual system is site-wide; Phase 1 implementation changes the homepage only.
- `/about`, `/services`, `/services/*`, `/portfolio`, and `/portfolio/*` must not receive unintended Phase 1 visual changes.
- The initial viewport must be one complete dark composition. The next light section must not visibly intrude at first load on standard desktop or mobile viewport heights.
- Hero content is limited to navigation, `Снимки, които продават.`, `Запази снимане`, `Виж услугите`, and photography.
- Do not render the removed eyebrow, decorative line, supporting paragraph, trust signals, hero service cards, icons, or emoji-like metadata.
- The hero-to-content transition must be gradual and CSS-driven; do not use a hard black-to-white cut immediately below the hero.
- Do not present Unsplash or other stock imagery as Teodor Pavlov's work.
- One owner-approved product photograph must be supplied as `public/portfolio/product-service.jpg` before Task 1 can become green. Do not substitute stock imagery.
- Hero headings, service names/prices, selected work, booking controls, and other critical content must be visible without JavaScript animation.
- Preserve the existing Formspree endpoint and contact validation/submission behavior.
- Preserve keyboard access for the mobile menu, FAQ, before/after slider, and form controls.
- Respect `prefers-reduced-motion`.
- Do not add dependencies.
- Do not delete old homepage components during Phase 1. Leave unused legacy components in place until the later site-wide migration, reducing risk during this redesign.
- Implement on an isolated feature branch/worktree created from `design/homepage-editorial-commerce` at execution time. Do not implement directly on `main`.
- Push the implementation branch to obtain a Vercel Preview. Do not merge to `main` until the owner explicitly approves that preview.

## Execution Preflight

At execution time, use the `superpowers:using-git-worktrees` skill and create an isolated worktree on branch `feat/homepage-editorial-commerce` from `design/homepage-editorial-commerce`. Verify a clean baseline before Task 1:

```powershell
npm test
npm run lint
npm run build
```

Expected: all PASS before redesign code is changed.

---

## File Structure

### Create

- `src/data/home-editorial-content.ts` — truthful structured data for the new homepage.
- `src/data/home-editorial-content.test.ts` — local-image/truth guard.
- `src/components/home/hero.test.tsx` — minimal hero contract.
- `src/components/home/SelectedWork.tsx` — asymmetric owner-work section.
- `src/components/home/BeforeAfterFeature.tsx` — large editing-proof section.
- `src/components/home/WhyChooseMe.tsx` — condensed About/trust section.
- `src/components/home/VideoFeature.tsx` — simplified videography feature.
- `src/components/home/HowItWorks.tsx` — three-step process.
- `src/components/home/editorial-sections.test.tsx` — new section unit coverage.

### Modify

- `DESIGN.md`
- `src/app/globals.css`
- `src/components/home/HomePage.tsx`
- `src/components/home/Navbar.tsx`
- `src/components/home/Hero.tsx`
- `src/components/home/Services.tsx`
- `src/components/home/Reviews.tsx`
- `src/components/home/Faq.tsx`
- `src/components/home/Contact.tsx`
- `src/components/home/home-page.test.tsx`
- `src/components/home/navbar.test.tsx`
- `src/components/home/services.test.tsx`
- `src/components/home/reviews.test.tsx`
- `src/components/home/faq.test.tsx`
- `src/components/home/contact.test.tsx`
- `tests/e2e/home.spec.ts`
- `tests/e2e/brochure-pages.spec.ts`

### Reuse unchanged

- `src/components/ui/BeforeAfterSlider.tsx`
- `src/lib/contact.ts`
- `src/data/home-content.ts`
- `src/lib/content-types.ts`
- `src/app/layout.tsx`
- all dedicated brochure page components

---

### Task 1: Establish truthful Editorial Commerce homepage data

**Files:**
- Create: `src/data/home-editorial-content.test.ts`
- Create: `src/data/home-editorial-content.ts`
- Modify: `DESIGN.md`
- Required input: `public/portfolio/product-service.jpg`

**Interfaces:**
- Produces: `homeEditorialContent` with `nav`, `hero`, `services`, `selectedWork`, `why`, `beforeAfter`, `video`, `process`, `reviews`, `faq`, and `contact`.
- All later homepage components consume this object.

- [ ] **Step 1: Verify the owner-approved product asset exists**

```powershell
Test-Path "public\portfolio\product-service.jpg"
```

Expected: `True`. If `False`, stop Task 1 and request the owner's product photograph. Do not proceed with a stock replacement.

- [ ] **Step 2: Write the failing data/truth test**

Create `src/data/home-editorial-content.test.ts`:

```tsx
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("homeEditorialContent", () => {
  it("keeps hero, services, and selected work on local owner-approved assets", () => {
    const imageSources = [
      ...homeEditorialContent.hero.images.map((image) => image.src),
      ...homeEditorialContent.services.map((service) => service.image.src),
      ...homeEditorialContent.selectedWork.map((item) => item.image),
    ];

    expect(imageSources.every((src) => src.startsWith("/portfolio/"))).toBe(true);
    expect(imageSources.some((src) => src.includes("images.unsplash.com"))).toBe(false);
  });

  it("requires the approved product photograph", () => {
    const productImage = join(process.cwd(), "public", "portfolio", "product-service.jpg");
    expect(existsSync(productImage)).toBe(true);
  });
});
```

- [ ] **Step 3: Run the focused test and verify RED**

```powershell
npm test -- src/data/home-editorial-content.test.ts
```

Expected: FAIL because `src/data/home-editorial-content.ts` does not exist.

- [ ] **Step 4: Create the structured homepage data**

Create `src/data/home-editorial-content.ts`:

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

- [ ] **Step 5: Retire the stale OpenCode design direction**

Replace `DESIGN.md` with:

```md
# Pavlov Photography Design System

The previous OpenCode-derived terminal visual direction is retired.

The canonical site-wide design is:

`docs/superpowers/specs/2026-08-27-homepage-editorial-commerce-design.md`

Phase 1 applies this system to the homepage only. Other routes migrate later and must not be restyled accidentally by Phase 1 changes.
```

- [ ] **Step 6: Run the focused test and verify GREEN**

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

### Task 2: Add a homepage-only design scope without affecting brochure routes

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/home/HomePage.tsx`
- Modify: `src/components/home/home-page.test.tsx`

**Interfaces:**
- Produces: `.home-editorial` and the `--pp-*` token family used by all new homepage sections.

- [ ] **Step 1: Replace the stale HomePage tests with a failing scope test**

Set `src/components/home/home-page.test.tsx` to:

```tsx
import { render } from "@testing-library/react";
import { HomePage } from "@/components/home/HomePage";

describe("HomePage editorial shell", () => {
  it("scopes the Editorial Commerce system to the homepage", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector(".home-editorial")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verify RED**

```powershell
npm test -- src/components/home/home-page.test.tsx
```

Expected: FAIL because `.home-editorial` is not rendered.

- [ ] **Step 3: Add non-breaking homepage tokens and suppress legacy ambient effects only on home**

Append to `src/app/globals.css`:

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

Do not change the existing legacy variables used by brochure pages.

- [ ] **Step 4: Wrap the current homepage exactly, removing only PointerGlow**

At this intermediate commit, use this exact `HomePage` composition so existing sections keep working while the shell is introduced:

```tsx
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Faq } from "@/components/home/Faq";
import { FooterCta } from "@/components/home/FooterCta";
import { Hero } from "@/components/home/Hero";
import { Navbar } from "@/components/home/Navbar";
import { Portfolio } from "@/components/home/Portfolio";
import { Reviews } from "@/components/home/Reviews";
import { Services } from "@/components/home/Services";
import { Terms } from "@/components/home/Terms";
import { Videography } from "@/components/home/Videography";
import { FloatingCallButton } from "@/components/ui/FloatingCallButton";
import { homeContent } from "@/data/home-content";
import { homeEditorialContent } from "@/data/home-editorial-content";

export function HomePage() {
  return (
    <div className="home-editorial">
      <Navbar links={homeEditorialContent.nav} />
      <main className="relative overflow-hidden pb-24 md:pb-0">
        <Hero content={homeContent.hero} />
        <About content={homeContent.about} />
        <Services content={homeContent.services} />
        <Videography content={homeContent.videography} />
        <Portfolio content={homeContent.portfolio} />
        <Terms content={homeContent.terms} />
        <Reviews content={homeContent.reviews} />
        <Faq content={homeContent.faq} />
        <Contact content={homeContent.contact} />
      </main>
      <FooterCta content={homeContent.footerCta} />
      <FloatingCallButton phone={homeContent.contact.phone} />
    </div>
  );
}
```

`PointerGlow` must no longer be imported or rendered.

- [ ] **Step 5: Verify GREEN and full-suite stability**

```powershell
npm test -- src/components/home/home-page.test.tsx
npm test
```

Expected: both PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/app/globals.css src/components/home/HomePage.tsx src/components/home/home-page.test.tsx
git commit -m "feat: scope editorial visual system to homepage"
```

---

### Task 3: Build the minimal navbar and full-viewport hero

**Files:**
- Modify: `src/components/home/Navbar.tsx`
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/navbar.test.tsx`
- Create: `src/components/home/hero.test.tsx`
- Modify: `src/components/home/HomePage.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- `Navbar` consumes `homeEditorialContent.nav`.
- `Hero` consumes `homeEditorialContent.hero`.

- [ ] **Step 1: Write failing hero and navbar tests**

Create `src/components/home/hero.test.tsx`:

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

  it("renders the three owner-approved hero images", () => {
    render(<Hero content={homeEditorialContent.hero} />);
    for (const image of homeEditorialContent.hero.images) {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    }
  });
});
```

Replace `navbar.test.tsx` with tests that assert:

```tsx
expect(screen.getByRole("link", { name: "PAVLOV PHOTOGRAPHY" })).toHaveAttribute("href", "#hero");
expect(screen.getByRole("link", { name: "Работа" })).toHaveAttribute("href", "#portfolio");
expect(screen.getByRole("link", { name: "Услуги" })).toHaveAttribute("href", "#services");
expect(screen.getByRole("link", { name: "За мен" })).toHaveAttribute("href", "#about");
expect(screen.getByRole("link", { name: "Контакт" })).toHaveAttribute("href", "#contact");
expect(screen.getByRole("link", { name: "Запази снимане" })).toHaveAttribute("href", "#contact");
expect(screen.getByRole("button", { name: "Отвори менюто" })).toBeInTheDocument();
```

- [ ] **Step 2: Verify RED**

```powershell
npm test -- src/components/home/hero.test.tsx src/components/home/navbar.test.tsx
```

Expected: FAIL against the current hero/navbar.

- [ ] **Step 3: Rewrite `Hero.tsx` as a server component**

Use:

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
            <span className="block">{content.title.lead}</span>{" "}
            <span className="block italic text-[var(--pp-brass)]">
              {content.title.accent}{content.title.tail}
            </span>
          </h1>
          <div className="mt-9 flex flex-wrap gap-3 sm:mt-12">
            <a href="#contact" className="pp-button-primary">{content.primaryCta}</a>
            <a href="#services" className="pp-button-secondary">{content.secondaryCta}</a>
          </div>
        </div>

        <div className="relative min-h-[25rem] sm:min-h-[34rem] lg:min-h-[43rem]">
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

The file must not contain `"use client"`, `Reveal`, Framer Motion, service-pricing events, stats, or service cards.

- [ ] **Step 4: Keep existing Navbar state/effects but replace its derived links and JSX**

In `Navbar.tsx`, keep `isScrolled`, `isOpen`, `resolveHref`, scroll effect, and body-overflow effect. Set:

```tsx
const desktopLinks = links;
const mobileLinks = links;
```

Replace the return value with:

```tsx
return (
  <header className="fixed inset-x-0 top-0 z-50">
    <div className={isScrolled || isOpen ? "pp-nav pp-nav-solid" : "pp-nav pp-nav-clear"}>
      <a href={resolveHref("#hero")} className="pp-brand">
        PAVLOV PHOTOGRAPHY
      </a>

      <nav className="hidden items-center gap-7 lg:flex">
        {desktopLinks.map((link) => (
          <a key={link.href} href={resolveHref(link.href)} className="pp-nav-link">
            {link.label}
          </a>
        ))}
      </nav>

      <a href={resolveHref("#contact")} className="pp-nav-cta hidden lg:inline-flex">
        Запази снимане
      </a>

      <button
        type="button"
        className="pp-menu-button lg:hidden"
        aria-label={isOpen ? "Затвори менюто" : "Отвори менюто"}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen ? (
        <nav className="absolute inset-x-4 top-[calc(100%+0.5rem)] grid gap-1 border border-[var(--pp-line-dark)] bg-[var(--pp-soft-black)] p-3 lg:hidden">
          {mobileLinks.map((link) => (
            <a
              key={`${link.href}-mobile`}
              href={resolveHref(link.href)}
              className="px-3 py-3 text-sm text-[var(--pp-warm-white)]"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  </header>
);
```

Remove `ApertureLogo` from this component.

- [ ] **Step 5: Add exact homepage button/nav/hero-image CSS**

Append inside `globals.css`:

```css
.home-editorial .pp-button-primary,
.home-editorial .pp-button-secondary,
.home-editorial .pp-nav-cta {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem;
  padding: 0.78rem 1.05rem;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: transform 180ms ease, background-color 180ms ease, color 180ms ease;
}

.home-editorial .pp-button-primary,
.home-editorial .pp-nav-cta {
  background: var(--pp-warm-white);
  color: var(--pp-text-dark);
}

.home-editorial .pp-button-secondary {
  border: 1px solid var(--pp-line-dark);
  color: var(--pp-warm-white);
}

.home-editorial .pp-button-primary:hover,
.home-editorial .pp-button-secondary:hover,
.home-editorial .pp-nav-cta:hover {
  transform: translateY(-1px);
}

.home-editorial .pp-nav {
  margin-inline: auto;
  display: grid;
  max-width: 96rem;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 1.5rem;
  padding: calc(1rem + env(safe-area-inset-top)) 1rem 1rem;
  transition: background-color 180ms ease, border-color 180ms ease;
}

.home-editorial .pp-nav-solid {
  border-bottom: 1px solid var(--pp-line-dark);
  background: rgba(21, 21, 21, 0.9);
  backdrop-filter: blur(14px);
}

.home-editorial .pp-brand,
.home-editorial .pp-nav-link {
  color: var(--pp-warm-white);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.home-editorial .pp-menu-button {
  display: inline-flex;
  height: 2.75rem;
  width: 2.75rem;
  align-items: center;
  justify-content: center;
  color: var(--pp-warm-white);
}

.home-editorial .pp-hero-frame {
  position: absolute;
  overflow: hidden;
  border-radius: 0.45rem;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.28);
}

.home-editorial .pp-hero-frame-1 {
  inset: 0 28% 10% 8%;
  transform: rotate(-1.4deg);
}

.home-editorial .pp-hero-frame-2 {
  top: 12%;
  right: 0;
  bottom: 0;
  width: 42%;
  transform: rotate(1.2deg);
}

.home-editorial .pp-hero-frame-3 {
  left: 0;
  bottom: 0;
  width: 34%;
  height: 34%;
  transform: rotate(-2deg);
}

@media (max-width: 1023px) {
  .home-editorial .pp-nav {
    grid-template-columns: 1fr auto;
  }

  .home-editorial .pp-hero-frame-1 {
    inset: 0 22% 8% 8%;
  }

  .home-editorial .pp-hero-frame-2 {
    width: 38%;
  }
}
```

- [ ] **Step 6: Switch HomePage to the new hero**

Change only the hero call at this stage:

```tsx
<Hero content={homeEditorialContent.hero} />
```

- [ ] **Step 7: Verify GREEN**

```powershell
npm test -- src/components/home/hero.test.tsx src/components/home/navbar.test.tsx src/components/home/home-page.test.tsx
```

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add src/app/globals.css src/components/home/Navbar.tsx src/components/home/Hero.tsx src/components/home/HomePage.tsx src/components/home/hero.test.tsx src/components/home/navbar.test.tsx
git commit -m "feat: build minimal full-viewport homepage hero"
```

---

### Task 4: Replace pricing tabs with services and image-led proof

**Files:**
- Modify: `src/components/home/Services.tsx`
- Modify: `src/components/home/services.test.tsx`
- Create: `src/components/home/SelectedWork.tsx`
- Create: `src/components/home/BeforeAfterFeature.tsx`
- Create: `src/components/home/editorial-sections.test.tsx`
- Modify: `src/components/home/HomePage.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- `Services` consumes `homeEditorialContent.services`.
- `SelectedWork` consumes `homeEditorialContent.selectedWork`.
- `BeforeAfterFeature` consumes `homeEditorialContent.beforeAfter` and reuses `BeforeAfterSlider` unchanged.

- [ ] **Step 1: Write failing service/proof tests**

Set `services.test.tsx` to assert three deep links, all three starting prices, and no tablist. Use `getAllByText("от €30")` for the two matching €30 prices.

Create `editorial-sections.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { BeforeAfterFeature } from "@/components/home/BeforeAfterFeature";
import { SelectedWork } from "@/components/home/SelectedWork";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("homepage proof", () => {
  it("shows curated local selected work", () => {
    render(<SelectedWork items={homeEditorialContent.selectedWork} />);
    expect(screen.getByText("AUTOMOTIVE · BMW M SERIES")).toBeInTheDocument();
    expect(screen.getByText("REAL ESTATE · SOFIA")).toBeInTheDocument();
    expect(screen.queryByText("Luxury Timepiece")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Разгледай цялото портфолио →" })).toHaveAttribute(
      "href",
      "/portfolio",
    );
  });

  it("keeps before-after as a keyboard-accessible slider", () => {
    render(<BeforeAfterFeature content={homeEditorialContent.beforeAfter} />);
    expect(screen.getByRole("slider", { name: "Плъзгач преди и след" })).toBeInTheDocument();
    expect(screen.getByText("Снимането е половината работа.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verify RED**

```powershell
npm test -- src/components/home/services.test.tsx src/components/home/editorial-sections.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Rewrite `Services.tsx`**

```tsx
import Image from "next/image";
import { homeEditorialContent } from "@/data/home-editorial-content";

type Service = (typeof homeEditorialContent.services)[number];

export function Services({ services }: { services: readonly Service[] }) {
  return (
    <section id="services" className="pp-services-transition scroll-mt-24">
      <div className="mx-auto max-w-[92rem] px-4 pb-24 pt-36 sm:px-8 lg:px-10 xl:px-16">
        <h2 className="pp-display mb-10 text-5xl text-[var(--pp-text-dark)] sm:text-6xl">Услуги</h2>
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
                  <h3 className="pp-display text-3xl text-[var(--pp-text-dark)]">{service.title}</h3>
                  <p className="text-sm font-semibold text-[var(--pp-text-dark)]">{service.startingPrice}</p>
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
```

- [ ] **Step 4: Create `SelectedWork.tsx`**

```tsx
import Image from "next/image";
import { homeEditorialContent } from "@/data/home-editorial-content";

type WorkItem = (typeof homeEditorialContent.selectedWork)[number];

const layout = {
  wide: "md:col-span-8 aspect-[16/9]",
  tall: "md:col-span-4 md:row-span-2 aspect-[3/4]",
  square: "md:col-span-4 aspect-square",
} as const;

export function SelectedWork({ items }: { items: readonly WorkItem[] }) {
  return (
    <section id="portfolio" className="bg-[var(--pp-ink)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[92rem]">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="pp-display text-5xl sm:text-7xl">Избрана работа.</h2>
          <a href="/portfolio" className="hidden text-sm font-semibold sm:inline-flex">
            Разгледай цялото портфолио →
          </a>
        </div>
        <div className="grid auto-rows-auto gap-4 md:grid-cols-12">
          {items.map((item) => (
            <a key={item.id} href={item.href} className={`group relative overflow-hidden ${layout[item.ratio]}`}>
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
            </a>
          ))}
        </div>
        <a href="/portfolio" className="mt-7 inline-flex text-sm font-semibold sm:hidden">
          Разгледай цялото портфолио →
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `BeforeAfterFeature.tsx`**

```tsx
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { homeEditorialContent } from "@/data/home-editorial-content";

type BeforeAfterContent = typeof homeEditorialContent.beforeAfter;

export function BeforeAfterFeature({ content }: { content: BeforeAfterContent }) {
  return (
    <section id="before-after" className="bg-[var(--pp-soft-black)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display text-5xl text-[var(--pp-warm-white)] sm:text-7xl">
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

- [ ] **Step 6: Add gradual transition and service-card CSS**

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

.home-editorial .pp-service-card {
  overflow: hidden;
  border: 1px solid var(--pp-line-light);
  border-radius: 0.5rem;
  background: var(--pp-paper);
  color: var(--pp-text-dark);
}
```

- [ ] **Step 7: Place the three sections in HomePage**

Immediately after Hero:

```tsx
<Services services={homeEditorialContent.services} />
<SelectedWork items={homeEditorialContent.selectedWork} />
<BeforeAfterFeature content={homeEditorialContent.beforeAfter} />
```

Remove old `Services` props, old `Portfolio`, and the old before/after presentation from the rendered homepage. Do not delete their files.

- [ ] **Step 8: Verify GREEN and commit**

```powershell
npm test -- src/components/home/services.test.tsx src/components/home/editorial-sections.test.tsx
npm test
git add src/app/globals.css src/components/home/Services.tsx src/components/home/services.test.tsx src/components/home/SelectedWork.tsx src/components/home/BeforeAfterFeature.tsx src/components/home/editorial-sections.test.tsx src/components/home/HomePage.tsx
git commit -m "feat: add editorial services and portfolio proof"
```

---

### Task 5: Add condensed trust, videography, and process sections

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

- [ ] **Step 1: Extend tests and verify RED**

Add imports for the three new components and these assertions to `editorial-sections.test.tsx`:

```tsx
it("condenses trust into four proof points", () => {
  render(<WhyChooseMe content={homeEditorialContent.why} />);
  expect(screen.getByText("Ясна цена предварително")).toBeInTheDocument();
  expect(screen.getByText("Директна комуникация с фотографа")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Повече за мен →" })).toHaveAttribute("href", "/about");
});

it("presents videography as one concise feature", () => {
  render(<VideoFeature content={homeEditorialContent.video} />);
  expect(screen.getByText("от €50 / видео")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Виж видеография →" })).toHaveAttribute(
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

Run:

```powershell
npm test -- src/components/home/editorial-sections.test.tsx
```

Expected: FAIL because the components do not exist.

- [ ] **Step 2: Create `WhyChooseMe.tsx`**

```tsx
import { homeEditorialContent } from "@/data/home-editorial-content";

type WhyContent = typeof homeEditorialContent.why;

export function WhyChooseMe({ content }: { content: WhyContent }) {
  return (
    <section id="about" className="bg-[var(--pp-ivory)] px-4 py-24 text-[var(--pp-text-dark)] sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h2 className="pp-display max-w-4xl text-5xl leading-[0.95] sm:text-7xl">{content.title}</h2>
          <div className="mt-10 border-t border-[var(--pp-line-light)] pt-6">
            <p className="font-semibold">{content.name}</p>
            <p className="mt-1 text-sm text-black/60">{content.role}</p>
            <a href={content.href} className="mt-6 inline-flex text-sm font-semibold">Повече за мен →</a>
          </div>
        </div>
        <ol className="grid gap-0 border-t border-[var(--pp-line-light)]">
          {content.points.map((point, index) => (
            <li key={point} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[var(--pp-line-light)] py-6">
              <span className="text-xs font-semibold">0{index + 1}</span>
              <span className="text-lg">{point}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `VideoFeature.tsx`**

```tsx
import Image from "next/image";
import { homeEditorialContent } from "@/data/home-editorial-content";

type VideoContent = typeof homeEditorialContent.video;

export function VideoFeature({ content }: { content: VideoContent }) {
  return (
    <section id="videography" className="bg-[var(--pp-ink)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.5rem]">
          <Image src={content.image.src} alt={content.image.alt} fill sizes="(max-width: 1024px) 100vw, 62vw" className="object-cover" />
        </div>
        <div className="pb-2">
          <h2 className="pp-display text-5xl sm:text-7xl">{content.title}</h2>
          <p className="mt-4 text-lg text-[var(--pp-brass)]">{content.price}</p>
          <p className="mt-5 max-w-md text-base leading-7 text-[var(--pp-muted)]">{content.description}</p>
          <a href={content.href} className="mt-8 inline-flex text-sm font-semibold">Виж видеография →</a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `HowItWorks.tsx`**

```tsx
import { homeEditorialContent } from "@/data/home-editorial-content";

type Step = (typeof homeEditorialContent.process)[number];

export function HowItWorks({ steps }: { steps: readonly Step[] }) {
  return (
    <section id="process" className="bg-[var(--pp-ivory)] px-4 py-24 text-[var(--pp-text-dark)] sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display text-5xl sm:text-7xl">Как работим.</h2>
        <div className="mt-12 grid border-t border-[var(--pp-line-light)] lg:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="border-b border-[var(--pp-line-light)] py-8 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0">
              <p className="text-xs font-semibold">{step.number}</p>
              <h3 className="pp-display mt-8 text-3xl">{step.title}</h3>
              <p className="mt-4 max-w-sm text-sm leading-6 text-black/65">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Insert the sections in final order around BeforeAfter**

The relevant HomePage sequence becomes:

```tsx
<SelectedWork items={homeEditorialContent.selectedWork} />
<WhyChooseMe content={homeEditorialContent.why} />
<BeforeAfterFeature content={homeEditorialContent.beforeAfter} />
<VideoFeature content={homeEditorialContent.video} />
<HowItWorks steps={homeEditorialContent.process} />
```

- [ ] **Step 6: Verify GREEN and commit**

```powershell
npm test -- src/components/home/editorial-sections.test.tsx
npm test
git add src/components/home/WhyChooseMe.tsx src/components/home/VideoFeature.tsx src/components/home/HowItWorks.tsx src/components/home/editorial-sections.test.tsx src/components/home/HomePage.tsx
git commit -m "feat: add trust video and process sections"
```

---

### Task 6: Replace carousel trust and card-heavy contact with simpler conversion sections

**Files:**
- Modify: `src/components/home/Reviews.tsx`
- Modify: `src/components/home/reviews.test.tsx`
- Modify: `src/components/home/Faq.tsx`
- Modify: `src/components/home/faq.test.tsx`
- Modify: `src/components/home/Contact.tsx`
- Modify: `src/components/home/contact.test.tsx`
- Modify: `src/components/home/HomePage.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- `Reviews` consumes a readonly array of existing `ReviewItem` values.
- `Faq` consumes a readonly array of existing `FaqItem` values.
- `Contact` continues consuming existing `ContactContent` and preserves `validateContactForm()` / `submitContactForm()`.

- [ ] **Step 1: Write failing tests**

Update `reviews.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { Reviews } from "@/components/home/Reviews";
import { homeEditorialContent } from "@/data/home-editorial-content";

test("renders all three reviews without carousel controls", () => {
  render(<Reviews content={homeEditorialContent.reviews} />);
  expect(screen.getAllByRole("article")).toHaveLength(3);
  expect(screen.queryByRole("button", { name: /Следващ отзив/i })).not.toBeInTheDocument();
});
```

Update `faq.test.tsx` so it renders `<Faq items={homeEditorialContent.faq} />`, asserts exactly five question buttons, clicks `Включена ли е обработката в цената?`, and verifies the answer appears.

Retain existing contact validation/submission tests and add:

```tsx
expect(screen.getByRole("heading", { name: "Нека заснемем следващия ви проект." })).toBeInTheDocument();
expect(screen.getByText("Имоти · Автомобили · Продукти · Видео")).toBeInTheDocument();
```

- [ ] **Step 2: Verify RED**

```powershell
npm test -- src/components/home/reviews.test.tsx src/components/home/faq.test.tsx src/components/home/contact.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Rewrite `Reviews.tsx`**

```tsx
import type { ReviewItem } from "@/lib/content-types";

export function Reviews({ content }: { content: readonly ReviewItem[] }) {
  return (
    <section id="reviews" className="bg-[var(--pp-ink)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display text-5xl sm:text-7xl">Отзиви.</h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {content.map((review, index) => (
            <article
              key={`${review.author}-${review.role}`}
              className={index === 0 ? "border-t border-[var(--pp-line-dark)] pt-7 lg:col-span-1" : "border-t border-[var(--pp-line-dark)] pt-7"}
            >
              <blockquote className="pp-display text-2xl leading-[1.15] text-[var(--pp-warm-white)]">“{review.quote}”</blockquote>
              <p className="mt-7 text-sm font-semibold">{review.author}</p>
              <p className="mt-1 text-xs text-[var(--pp-muted)]">{review.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Rewrite `Faq.tsx` as a light five-item accordion**

```tsx
"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { FaqItem } from "@/lib/content-types";

export function Faq({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-[var(--pp-ivory)] px-4 py-24 text-[var(--pp-text-dark)] sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display text-5xl sm:text-7xl">Въпроси.</h2>
        <div className="mt-10 border-t border-[var(--pp-line-light)]">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <article key={item.question} className="border-b border-[var(--pp-line-light)]">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="text-base font-medium sm:text-lg">{item.question}</span>
                  {isOpen ? <X className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}
                </button>
                {isOpen ? <p className="max-w-3xl pb-6 text-sm leading-7 text-black/65">{item.answer}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Preserve the existing Contact state/submission functions exactly and replace only its returned JSX**

Keep `initialValues`, state hooks, `canSubmit`, `updateField()`, and `handleSubmit()` unchanged. Replace the current `return` with:

```tsx
return (
  <section id="contact" className="bg-[var(--pp-ink)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
    <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h2 className="pp-display max-w-xl text-5xl leading-[0.95] sm:text-7xl">
          Нека заснемем следващия ви проект.
        </h2>
        <p className="mt-6 text-sm text-[var(--pp-muted)]">Имоти · Автомобили · Продукти · Видео</p>
        <a href={`tel:${content.phone}`} className="mt-8 inline-flex text-lg font-semibold">0889 755 406</a>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        <label className="grid gap-2 text-sm">
          Име
          <input className="pp-form-input" value={values.name} onChange={(event) => updateField("name", event.target.value)} />
          {errors.name ? <span className="form-error">{errors.name}</span> : null}
        </label>
        <label className="grid gap-2 text-sm">
          Телефон
          <input className="pp-form-input" value={values.phone} onChange={(event) => updateField("phone", event.target.value)} />
          {errors.phone ? <span className="form-error">{errors.phone}</span> : null}
        </label>
        <label className="grid gap-2 text-sm">
          Тип заснемане
          <select className="pp-form-input" value={values.service} onChange={(event) => updateField("service", event.target.value)}>
            <option value="">Изберете услуга</option>
            {content.serviceOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.service ? <span className="form-error">{errors.service}</span> : null}
        </label>
        <label className="grid gap-2 text-sm">
          Съобщение
          <textarea className="pp-form-input min-h-36 resize-y" value={values.message} onChange={(event) => updateField("message", event.target.value)} />
          {errors.message ? <span className="form-error">{errors.message}</span> : null}
        </label>
        <button type="submit" className="pp-button-primary mt-2 w-full" disabled={!canSubmit || isSubmitting}>
          Изпрати запитване
        </button>
        {statusMessage ? (
          <p role="status" aria-live="polite" className={statusMessage.tone === "success" ? "text-sm text-[var(--pp-warm-white)]" : "text-sm text-[#ffb9a9]"}>
            {statusMessage.text}
          </p>
        ) : null}
      </form>
    </div>
  </section>
);
```

Remove `IconToken`, `Reveal`, and `SectionShell` imports from `Contact.tsx` after replacing the JSX.

- [ ] **Step 6: Add homepage form CSS**

```css
.home-editorial .pp-form-input {
  width: 100%;
  border: 0;
  border-bottom: 1px solid var(--pp-line-dark);
  border-radius: 0;
  background: transparent;
  padding: 0.8rem 0;
  color: var(--pp-warm-white);
}

.home-editorial .pp-form-input:focus {
  border-bottom-color: var(--pp-brass);
}

.home-editorial .pp-form-input option {
  color: #111;
}
```

- [ ] **Step 7: Insert final trust/FAQ/contact tail in HomePage**

After `HowItWorks`:

```tsx
<Reviews content={homeEditorialContent.reviews} />
<Faq items={homeEditorialContent.faq} />
<Contact content={homeEditorialContent.contact} />
```

Remove old `FooterCta` and `FloatingCallButton` from the rendered homepage. Do not delete their files.

- [ ] **Step 8: Verify GREEN and commit**

```powershell
npm test -- src/components/home/reviews.test.tsx src/components/home/faq.test.tsx src/components/home/contact.test.tsx
npm test
git add src/app/globals.css src/components/home/Reviews.tsx src/components/home/reviews.test.tsx src/components/home/Faq.tsx src/components/home/faq.test.tsx src/components/home/Contact.tsx src/components/home/contact.test.tsx src/components/home/HomePage.tsx
git commit -m "feat: simplify homepage trust and booking flow"
```

---

### Task 7: Final orchestration, unit gate, lint, and production build

**Files:**
- Modify: `src/components/home/HomePage.tsx`
- Modify: `src/components/home/home-page.test.tsx`

**Interfaces:**
- `HomePage` is the sole Phase 1 orchestration layer.

- [ ] **Step 1: Write the final section-order test**

Add to `home-page.test.tsx`:

```tsx
it("renders the approved conversion narrative in order", () => {
  const { container } = render(<HomePage />);
  const ids = Array.from(container.querySelectorAll("main > section[id]")).map((node) => node.id);

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

- [ ] **Step 2: Make `HomePage.tsx` exactly the final Phase 1 orchestrator**

```tsx
import { BeforeAfterFeature } from "@/components/home/BeforeAfterFeature";
import { Contact } from "@/components/home/Contact";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { HomePage as HomePageTypeGuard } from "@/components/home/HomePage";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Navbar } from "@/components/home/Navbar";
import { Reviews } from "@/components/home/Reviews";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Services } from "@/components/home/Services";
import { VideoFeature } from "@/components/home/VideoFeature";
import { WhyChooseMe } from "@/components/home/WhyChooseMe";
import { homeEditorialContent } from "@/data/home-editorial-content";

void HomePageTypeGuard;

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

Before implementing this step, remove the two self-reference lines shown above (`import { HomePage as HomePageTypeGuard } ...` and `void HomePageTypeGuard;`). They are printed here only to make the invalid self-import explicit: the final file must contain no import from `@/components/home/HomePage`.

The exact final imports are therefore the section imports plus `homeEditorialContent` only.

- [ ] **Step 3: Verify no legacy homepage components remain in the final render**

Run:

```powershell
rg -n "PointerGlow|FloatingCallButton|FooterCta|<About|<Terms|<Videography|<Portfolio" src/components/home/HomePage.tsx
```

Expected: no matches.

- [ ] **Step 4: Run the full local code gate**

```powershell
npm test
npm run lint
npm run build
```

Expected: all PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/components/home/HomePage.tsx src/components/home/home-page.test.tsx
git commit -m "refactor: finalize editorial homepage composition"
```

---

### Task 8: Responsive, SSR, non-home isolation, and safe Vercel rollout

**Files:**
- Modify: `tests/e2e/home.spec.ts`
- Modify: `tests/e2e/brochure-pages.spec.ts`

**Interfaces:**
- Produces the release gate for Phase 1 and the explicit owner-preview checkpoint.

- [ ] **Step 1: Replace stale homepage E2E behavior with the new desktop flow**

In `tests/e2e/home.spec.ts`, replace the old desktop test with:

```ts
import { expect, test } from "@playwright/test";

test("desktop editorial homepage stays minimal and completes booking flow", async ({ page }) => {
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
    await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  ).toBe(false);
});
```

Keep the existing Formspree 429/retry test, adapting only selectors if the final Contact markup requires it.

- [ ] **Step 2: Replace mobile/tablet tests with minimal-opening checks**

Add:

```ts
test("mobile opening remains dark, complete, and uncluttered", async ({ page }) => {
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
    await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  ).toBe(false);
});

test("tablet homepage has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  ).toBe(false);
});
```

- [ ] **Step 3: Add JavaScript-disabled SSR visibility proof**

```ts
test("critical homepage content remains visible without JavaScript", async ({ browser }) => {
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

- [ ] **Step 4: Add explicit non-home isolation smoke test**

Append to `tests/e2e/brochure-pages.spec.ts`:

```ts
test("phase 1 homepage scope does not leak onto brochure routes", async ({ page }) => {
  for (const route of ["/about", "/services", "/services/automotive", "/portfolio"]) {
    await page.goto(route);
    await expect(page.locator(".home-editorial")).toHaveCount(0);
    await expect(page.locator("main")).toBeVisible();
  }
});
```

- [ ] **Step 5: Run the complete release gate**

```powershell
npm test
npm run lint
npm run build
npm run test:e2e
```

Expected: all PASS.

- [ ] **Step 6: Perform manual responsive review before pushing**

Run:

```powershell
npm run dev
```

Inspect these exact viewport sizes:

- 390×844
- 768×1024
- 1280×800
- 1440×900
- 1920×1080

Confirm all of the following:

- no ivory/light strip is visible at first load;
- hero contains no removed eyebrow, description, trust line, or service-card UI;
- headline and both hero CTAs remain readable;
- hero image crop looks intentional at every viewport;
- transition from dark hero into the service section is gradual;
- services have equal visual weight;
- selected work is visibly asymmetric/editorial;
- no horizontal overflow;
- FAQ, slider, and mobile menu remain usable;
- non-home routes look like their pre-Phase-1 versions.

- [ ] **Step 7: Commit E2E release gates before remote push**

```powershell
git add tests/e2e/home.spec.ts tests/e2e/brochure-pages.spec.ts
git commit -m "test: gate editorial homepage rollout"
```

- [ ] **Step 8: Push the implementation branch**

```powershell
git push -u origin feat/homepage-editorial-commerce
```

Expected: Vercel creates a Preview deployment for the branch.

- [ ] **Step 9: Verify Vercel Preview**

Confirm in project `pavlov-photography`:

- deployment state `READY`;
- source repository `todevan/pavlov-photography`;
- source branch `feat/homepage-editorial-commerce`;
- Next.js build succeeds;
- preview homepage matches the approved Editorial Commerce direction;
- `/about`, `/services`, `/services/automotive`, and `/portfolio` still render normally.

- [ ] **Step 10: Owner visual approval gate**

Provide the Vercel Preview to the owner. Stop here until the owner explicitly approves the preview.

- [ ] **Step 11: Merge to production only after explicit approval**

After approval, merge the implementation branch into `main` without force-push. Verify the resulting production deployment becomes `READY` and has both aliases:

- `pavlovphotography.eu`
- `www.pavlovphotography.eu`

Fetch the live homepage after deployment and verify the server HTML contains `Снимки, които продават.` plus service copy without critical `opacity: 0` wrappers.

---

## Self-Review Checklist for the Implementer

Before claiming completion, confirm:

- [ ] The plan's Task 1 product-image truth gate is satisfied with owner-approved work.
- [ ] The old OpenCode design direction is retired in `DESIGN.md`.
- [ ] New global tokens are additive and homepage behavior is selected by `.home-editorial`.
- [ ] The hero is server-rendered and contains only the approved minimal content.
- [ ] No floating call CTA appears on the opening mobile viewport.
- [ ] Services are static deep links, not tabs.
- [ ] Selected Work contains only local owner-approved images.
- [ ] Before/after keyboard behavior remains intact.
- [ ] Why, video, and process sections match the approved narrative.
- [ ] All three testimonials are visible without carousel interaction.
- [ ] FAQ has exactly five booking-blocking questions.
- [ ] Formspree behavior and error handling are unchanged.
- [ ] `HomePage.tsx` renders section ids in the approved order.
- [ ] Critical content is visible with JavaScript disabled.
- [ ] Unit tests, lint, build, and Playwright pass.
- [ ] Non-home routes do not contain `.home-editorial`.
- [ ] Vercel Preview is approved by the owner before production merge.
