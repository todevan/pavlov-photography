# Homepage Editorial Commerce Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved site-wide Editorial Commerce visual system to the homepage first while keeping every non-home route visually and functionally unchanged in Phase 1.

**Architecture:** Build a parallel set of homepage-only Editorial components instead of modifying shared brochure components. `HomePage.tsx` becomes the only integration point, wrapped in `.home-editorial`; existing `Navbar`, `SiteFrame`, and brochure-page components remain unchanged. New sections are server components unless interaction is required; mobile navigation, FAQ, contact, and the existing `BeforeAfterSlider` remain client-side. Critical content is visible in SSR HTML without animation gates.

**Tech Stack:** Next.js 16.2.3, React 19.2.4, TypeScript 5, Tailwind CSS 4, Vitest 4.1.4, Testing Library, Playwright 1.59.1, Next Image, existing Formspree contact utilities.

**Spec:** `docs/superpowers/specs/2026-08-27-homepage-editorial-commerce-design.md`

## Global Constraints

- Site-wide design direction, homepage-only Phase 1 implementation.
- Do not modify `src/components/home/Navbar.tsx` in Phase 1; `src/components/site/SiteFrame.tsx` uses it for brochure routes.
- Do not modify dedicated brochure page components in Phase 1.
- The first viewport contains only the minimal dark hero and navigation; no light section may visibly intrude at initial load.
- Hero content is limited to `Снимки, които продават.`, `Запази снимане`, `Виж услугите`, and owner-approved photography.
- Hero must not contain eyebrow text, decorative line, supporting paragraph, trust metadata, icons, emojis, stats, or service cards.
- Hero-to-services color change is gradual and CSS-driven, not a hard black-to-white cut.
- Do not present Unsplash or other stock images as Teodor Pavlov's work.
- Before implementation reaches the asset task's GREEN state, the owner must supply one real product photograph at `public/portfolio/product-service.jpg`.
- Do not add dependencies.
- Critical headings, service names/prices, selected work, and booking controls remain visible without JavaScript.
- Preserve existing contact validation, Formspree endpoint, success behavior, and rate-limit behavior.
- Preserve keyboard access to mobile navigation, FAQ, before/after slider, and form controls.
- Respect `prefers-reduced-motion`.
- Keep old homepage components in the repository during Phase 1; only stop rendering them from `HomePage.tsx`.
- Execute in an isolated worktree/feature branch created from `design/homepage-editorial-commerce`.
- Obtain a Vercel Preview and explicit owner visual approval before merging to `main`.

## Execution Preflight

Use `superpowers:using-git-worktrees` at execution time. Create branch `feat/homepage-editorial-commerce` from `design/homepage-editorial-commerce` in an isolated worktree, then verify the baseline:

```powershell
npm test
npm run lint
npm run build
```

Expected: all PASS before implementation starts.

---

## File Structure

### Create

- `src/data/home-editorial-content.ts` — truthful content and image references for Phase 1.
- `src/data/home-editorial-content.test.ts` — asset/truth guard.
- `src/components/home/EditorialNavbar.tsx` — homepage-only navigation.
- `src/components/home/EditorialNavbar.test.tsx` — navigation behavior.
- `src/components/home/EditorialHero.tsx` — minimal full-viewport hero.
- `src/components/home/EditorialHero.test.tsx` — hero content contract.
- `src/components/home/EditorialServices.tsx` — three equal service choices and prices.
- `src/components/home/EditorialServices.test.tsx` — service contract.
- `src/components/home/SelectedWork.tsx` — asymmetric owner-work proof.
- `src/components/home/WhyChooseMe.tsx` — condensed trust/about.
- `src/components/home/BeforeAfterFeature.tsx` — large editing proof.
- `src/components/home/VideoFeature.tsx` — simplified videography.
- `src/components/home/HowItWorks.tsx` — three-step process.
- `src/components/home/editorial-proof.test.tsx` — proof/trust/video/process unit coverage.
- `src/components/home/EditorialReviews.tsx` — all three reviews visible.
- `src/components/home/EditorialReviews.test.tsx` — review contract.
- `src/components/home/EditorialFaq.tsx` — five-question accordion.
- `src/components/home/EditorialFaq.test.tsx` — FAQ behavior.
- `src/components/home/EditorialContact.tsx` — simplified booking form preserving existing behavior.
- `src/components/home/EditorialContact.test.tsx` — contact behavior.

### Modify

- `DESIGN.md` — retire the OpenCode-derived design direction and point to the approved spec.
- `src/app/globals.css` — additive `--pp-*` tokens and `.home-editorial`-scoped styles only.
- `src/components/home/HomePage.tsx` — replace old homepage composition with Editorial components.
- `src/components/home/home-page.test.tsx` — assert scope and section order.
- `tests/e2e/home.spec.ts` — new desktop/mobile/SSR release gate.
- `tests/e2e/brochure-pages.spec.ts` — explicit Phase 1 isolation smoke test.

### Must remain unchanged in Phase 1

- `src/components/home/Navbar.tsx`
- `src/components/site/SiteFrame.tsx`
- `src/components/site/AboutPageView.tsx`
- `src/components/site/ServicesHubPageView.tsx`
- `src/components/site/ServiceDetailPageView.tsx`
- `src/components/ui/BeforeAfterSlider.tsx`
- `src/lib/contact.ts`
- dedicated portfolio/detail page views

---

### Task 1: Establish truthful Editorial content and retire the stale design reference

**Files:**
- Create: `src/data/home-editorial-content.test.ts`
- Create: `src/data/home-editorial-content.ts`
- Modify: `DESIGN.md`
- Required input: `public/portfolio/product-service.jpg`

**Interfaces:**
- Produces `homeEditorialContent` used by every Editorial homepage component.
- `hero.images`, `services[*].image`, and `selectedWork[*].image` must all be local `/portfolio/...` paths.

- [ ] **Step 1: Verify the owner product photograph exists**

```powershell
Test-Path "public\portfolio\product-service.jpg"
```

Expected: `True`. If `False`, stop Task 1 and request the owner's actual product photograph. No stock substitute is allowed.

- [ ] **Step 2: Write the failing truth test**

Create `src/data/home-editorial-content.test.ts`:

```tsx
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("homeEditorialContent", () => {
  it("uses only local portfolio imagery for hero, services, and selected work", () => {
    const sources = [
      ...homeEditorialContent.hero.images.map((image) => image.src),
      ...homeEditorialContent.services.map((service) => service.image.src),
      ...homeEditorialContent.selectedWork.map((item) => item.image),
    ];

    expect(sources.every((source) => source.startsWith("/portfolio/"))).toBe(true);
    expect(sources.some((source) => source.includes("unsplash"))).toBe(false);
  });

  it("requires the approved product photograph", () => {
    expect(
      existsSync(join(process.cwd(), "public", "portfolio", "product-service.jpg")),
    ).toBe(true);
  });
});
```

- [ ] **Step 3: Run the focused test to verify RED**

```powershell
npm test -- src/data/home-editorial-content.test.ts
```

Expected: FAIL because `src/data/home-editorial-content.ts` does not exist.

- [ ] **Step 4: Create the content model**

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

- [ ] **Step 5: Replace `DESIGN.md` with the canonical pointer**

```md
# Pavlov Photography Design System

The previous OpenCode-derived terminal visual direction is retired.

The canonical site-wide design is:

`docs/superpowers/specs/2026-08-27-homepage-editorial-commerce-design.md`

Phase 1 applies this system to the homepage only. Other routes migrate later and must not be restyled accidentally by Phase 1 changes.
```

- [ ] **Step 6: Run the focused test to verify GREEN**

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

### Task 2: Add homepage-scoped design tokens, navigation, and minimal hero

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/home/EditorialNavbar.tsx`
- Create: `src/components/home/EditorialNavbar.test.tsx`
- Create: `src/components/home/EditorialHero.tsx`
- Create: `src/components/home/EditorialHero.test.tsx`

**Interfaces:**
- `EditorialNavbar({ links })` consumes `homeEditorialContent.nav`.
- `EditorialHero({ content })` consumes `homeEditorialContent.hero`.
- Produces the `.home-editorial` visual token family used in Tasks 3–7.

- [ ] **Step 1: Write failing navigation test**

Create `src/components/home/EditorialNavbar.test.tsx`:

```tsx
"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditorialNavbar } from "@/components/home/EditorialNavbar";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("EditorialNavbar", () => {
  it("renders the approved homepage navigation and booking CTA", () => {
    render(<EditorialNavbar links={homeEditorialContent.nav} />);

    expect(screen.getByRole("link", { name: "PAVLOV PHOTOGRAPHY" })).toHaveAttribute("href", "#hero");
    expect(screen.getByRole("link", { name: "Работа" })).toHaveAttribute("href", "#portfolio");
    expect(screen.getByRole("link", { name: "Услуги" })).toHaveAttribute("href", "#services");
    expect(screen.getByRole("link", { name: "За мен" })).toHaveAttribute("href", "#about");
    expect(screen.getByRole("link", { name: "Контакт" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "Запази снимане" })).toHaveAttribute("href", "#contact");
  });

  it("opens an accessible mobile menu", async () => {
    const user = userEvent.setup();
    render(<EditorialNavbar links={homeEditorialContent.nav} />);

    await user.click(screen.getByRole("button", { name: "Отвори менюто" }));
    expect(screen.getByRole("button", { name: "Затвори менюто" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Работа" })).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Write failing hero test**

Create `src/components/home/EditorialHero.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { EditorialHero } from "@/components/home/EditorialHero";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("EditorialHero", () => {
  it("renders only the approved opening copy and actions", () => {
    render(<EditorialHero content={homeEditorialContent.hero} />);

    expect(screen.getByRole("heading", { name: "Снимки, които продават." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Запази снимане" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "Виж услугите" })).toHaveAttribute("href", "#services");
    expect(screen.queryByText(/Commercial Photography/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/24–48ч/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/София и региона/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/От €20/i)).not.toBeInTheDocument();
  });

  it("renders all approved hero images", () => {
    render(<EditorialHero content={homeEditorialContent.hero} />);
    for (const image of homeEditorialContent.hero.images) {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 3: Run both tests to verify RED**

```powershell
npm test -- src/components/home/EditorialNavbar.test.tsx src/components/home/EditorialHero.test.tsx
```

Expected: FAIL because both components are missing.

- [ ] **Step 4: Create `EditorialNavbar.tsx`**

```tsx
"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavLink } from "@/lib/content-types";

export function EditorialNavbar({ links }: { links: readonly NavLink[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={isScrolled || isOpen ? "pp-nav pp-nav-solid" : "pp-nav pp-nav-clear"}>
        <a href="#hero" className="pp-brand">PAVLOV PHOTOGRAPHY</a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="pp-nav-link">{link.label}</a>
          ))}
        </nav>

        <a href="#contact" className="pp-nav-cta hidden lg:inline-flex">Запази снимане</a>

        <button
          type="button"
          className="pp-menu-button lg:hidden"
          aria-label={isOpen ? "Затвори менюто" : "Отвори менюто"}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {isOpen ? (
          <nav className="pp-mobile-menu lg:hidden">
            {links.map((link) => (
              <a
                key={`${link.href}-mobile`}
                href={link.href}
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
}
```

- [ ] **Step 5: Create `EditorialHero.tsx`**

```tsx
import Image from "next/image";
import { homeEditorialContent } from "@/data/home-editorial-content";

type EditorialHeroContent = typeof homeEditorialContent.hero;

export function EditorialHero({ content }: { content: EditorialHeroContent }) {
  return (
    <section id="hero" className="pp-hero">
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

- [ ] **Step 6: Append the homepage-only token and hero/nav styles to `globals.css`**

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

.home-editorial .pp-hero {
  position: relative;
  display: flex;
  min-height: 100svh;
  align-items: center;
  overflow: hidden;
  background: var(--pp-ink);
  padding: 6.5rem 1rem 3rem;
}

.home-editorial .pp-nav {
  position: relative;
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

.home-editorial .pp-nav-cta,
.home-editorial .pp-button-primary,
.home-editorial .pp-button-secondary {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem;
  padding: 0.78rem 1.05rem;
  font-size: 0.82rem;
  font-weight: 600;
  transition: transform 180ms ease, background-color 180ms ease;
}

.home-editorial .pp-nav-cta,
.home-editorial .pp-button-primary {
  background: var(--pp-warm-white);
  color: var(--pp-text-dark);
}

.home-editorial .pp-button-secondary {
  border: 1px solid var(--pp-line-dark);
  color: var(--pp-warm-white);
}

.home-editorial .pp-menu-button {
  display: inline-flex;
  height: 2.75rem;
  width: 2.75rem;
  align-items: center;
  justify-content: center;
  color: var(--pp-warm-white);
}

.home-editorial .pp-mobile-menu {
  position: absolute;
  inset-inline: 1rem;
  top: calc(100% + 0.5rem);
  display: grid;
  border: 1px solid var(--pp-line-dark);
  background: var(--pp-soft-black);
  padding: 0.75rem;
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

@media (min-width: 640px) {
  .home-editorial .pp-hero {
    padding-inline: 2rem;
  }
}

@media (min-width: 1024px) {
  .home-editorial .pp-hero {
    padding-inline: 2.5rem;
  }
}

@media (max-width: 1023px) {
  .home-editorial .pp-nav {
    grid-template-columns: 1fr auto;
  }
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

- [ ] **Step 7: Run tests to verify GREEN**

```powershell
npm test -- src/components/home/EditorialNavbar.test.tsx src/components/home/EditorialHero.test.tsx
```

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add src/app/globals.css src/components/home/EditorialNavbar.tsx src/components/home/EditorialNavbar.test.tsx src/components/home/EditorialHero.tsx src/components/home/EditorialHero.test.tsx
git commit -m "feat: add editorial homepage opening"
```

---

### Task 3: Build the gradual transition and three-service commercial section

**Files:**
- Create: `src/components/home/EditorialServices.tsx`
- Create: `src/components/home/EditorialServices.test.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes `homeEditorialContent.services`.
- Produces section id `services` used by hero CTA and E2E tests.

- [ ] **Step 1: Write the failing service test**

Create `src/components/home/EditorialServices.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { EditorialServices } from "@/components/home/EditorialServices";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("EditorialServices", () => {
  it("renders three equal services with truthful starting prices", () => {
    render(<EditorialServices services={homeEditorialContent.services} />);

    expect(screen.getByRole("link", { name: /Недвижими имоти/i })).toHaveAttribute("href", "/services/real-estate");
    expect(screen.getByRole("link", { name: /Автомобили/i })).toHaveAttribute("href", "/services/automotive");
    expect(screen.getByRole("link", { name: /Продукти/i })).toHaveAttribute("href", "/services/products");
    expect(screen.getAllByText("от €30")).toHaveLength(2);
    expect(screen.getByText("от €20")).toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verify RED**

```powershell
npm test -- src/components/home/EditorialServices.test.tsx
```

Expected: FAIL because the component is missing.

- [ ] **Step 3: Create `EditorialServices.tsx`**

```tsx
import Image from "next/image";
import { homeEditorialContent } from "@/data/home-editorial-content";

type Service = (typeof homeEditorialContent.services)[number];

export function EditorialServices({ services }: { services: readonly Service[] }) {
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
                <span className="mt-7 inline-flex text-sm font-semibold">Виж пакетите →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add the exact transition/card CSS**

Append to `globals.css`:

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

- [ ] **Step 5: Verify GREEN**

```powershell
npm test -- src/components/home/EditorialServices.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/app/globals.css src/components/home/EditorialServices.tsx src/components/home/EditorialServices.test.tsx
git commit -m "feat: add editorial service section"
```

---

### Task 4: Build image-led work, trust, and before/after proof

**Files:**
- Create: `src/components/home/SelectedWork.tsx`
- Create: `src/components/home/WhyChooseMe.tsx`
- Create: `src/components/home/BeforeAfterFeature.tsx`
- Create: `src/components/home/editorial-proof.test.tsx`

**Interfaces:**
- `SelectedWork({ items })` consumes `homeEditorialContent.selectedWork` and produces id `portfolio`.
- `WhyChooseMe({ content })` consumes `homeEditorialContent.why` and produces id `about`.
- `BeforeAfterFeature({ content })` consumes `homeEditorialContent.beforeAfter` and produces id `before-after`.

- [ ] **Step 1: Write the failing proof tests**

Create `src/components/home/editorial-proof.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { BeforeAfterFeature } from "@/components/home/BeforeAfterFeature";
import { SelectedWork } from "@/components/home/SelectedWork";
import { WhyChooseMe } from "@/components/home/WhyChooseMe";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("Editorial proof sections", () => {
  it("renders curated owner-approved work only", () => {
    render(<SelectedWork items={homeEditorialContent.selectedWork} />);
    expect(screen.getByText("AUTOMOTIVE · BMW M SERIES")).toBeInTheDocument();
    expect(screen.getByText("REAL ESTATE · SOFIA")).toBeInTheDocument();
    expect(screen.queryByText("Luxury Timepiece")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Разгледай цялото портфолио →" })).toHaveAttribute("href", "/portfolio");
  });

  it("condenses trust to four proof points", () => {
    render(<WhyChooseMe content={homeEditorialContent.why} />);
    expect(screen.getByText("Ясна цена предварително")).toBeInTheDocument();
    expect(screen.getByText("Директна комуникация с фотографа")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Повече за мен →" })).toHaveAttribute("href", "/about");
  });

  it("keeps the existing before-after slider", () => {
    render(<BeforeAfterFeature content={homeEditorialContent.beforeAfter} />);
    expect(screen.getByRole("slider", { name: "Плъзгач преди и след" })).toBeInTheDocument();
    expect(screen.getByText("Снимането е половината работа.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verify RED**

```powershell
npm test -- src/components/home/editorial-proof.test.tsx
```

Expected: FAIL because the components are missing.

- [ ] **Step 3: Create `SelectedWork.tsx`**

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
          <a href="/portfolio" className="hidden text-sm font-semibold sm:inline-flex">Разгледай цялото портфолио →</a>
        </div>
        <div className="grid gap-4 md:grid-cols-12">
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
        <a href="/portfolio" className="mt-7 inline-flex text-sm font-semibold sm:hidden">Разгледай цялото портфолио →</a>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `WhyChooseMe.tsx`**

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
        <ol className="border-t border-[var(--pp-line-light)]">
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

- [ ] **Step 5: Create `BeforeAfterFeature.tsx`**

```tsx
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { homeEditorialContent } from "@/data/home-editorial-content";

type BeforeAfterContent = typeof homeEditorialContent.beforeAfter;

export function BeforeAfterFeature({ content }: { content: BeforeAfterContent }) {
  return (
    <section id="before-after" className="bg-[var(--pp-soft-black)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display text-5xl sm:text-7xl">Снимането е половината работа.</h2>
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

- [ ] **Step 6: Verify GREEN**

```powershell
npm test -- src/components/home/editorial-proof.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add src/components/home/SelectedWork.tsx src/components/home/WhyChooseMe.tsx src/components/home/BeforeAfterFeature.tsx src/components/home/editorial-proof.test.tsx
git commit -m "feat: add editorial photography proof"
```

---

### Task 5: Add videography, process, reviews, and FAQ

**Files:**
- Create: `src/components/home/VideoFeature.tsx`
- Create: `src/components/home/HowItWorks.tsx`
- Create: `src/components/home/EditorialReviews.tsx`
- Create: `src/components/home/EditorialReviews.test.tsx`
- Create: `src/components/home/EditorialFaq.tsx`
- Create: `src/components/home/EditorialFaq.test.tsx`
- Modify: `src/components/home/editorial-proof.test.tsx`

**Interfaces:**
- `VideoFeature({ content })` consumes `homeEditorialContent.video`, id `videography`.
- `HowItWorks({ steps })` consumes `homeEditorialContent.process`, id `process`.
- `EditorialReviews({ content })` consumes the readonly array `homeEditorialContent.reviews`, id `reviews`.
- `EditorialFaq({ items })` consumes `homeEditorialContent.faq`, id `faq`.

- [ ] **Step 1: Add failing video/process tests to `editorial-proof.test.tsx`**

Add imports and tests:

```tsx
import { HowItWorks } from "@/components/home/HowItWorks";
import { VideoFeature } from "@/components/home/VideoFeature";

it("presents videography as one concise feature", () => {
  render(<VideoFeature content={homeEditorialContent.video} />);
  expect(screen.getByText("от €50 / видео")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Виж видеография →" })).toHaveAttribute("href", "/services/videography");
  expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
});

it("renders the three-step process", () => {
  render(<HowItWorks steps={homeEditorialContent.process} />);
  expect(screen.getByText("01")).toBeInTheDocument();
  expect(screen.getByText("02")).toBeInTheDocument();
  expect(screen.getByText("03")).toBeInTheDocument();
});
```

- [ ] **Step 2: Write failing reviews test**

Create `src/components/home/EditorialReviews.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { EditorialReviews } from "@/components/home/EditorialReviews";
import { homeEditorialContent } from "@/data/home-editorial-content";

test("renders all three reviews without carousel controls", () => {
  render(<EditorialReviews content={homeEditorialContent.reviews} />);
  expect(screen.getAllByRole("article")).toHaveLength(3);
  expect(screen.queryByRole("button", { name: /Следващ отзив/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 3: Write failing FAQ test**

Create `src/components/home/EditorialFaq.test.tsx`:

```tsx
"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditorialFaq } from "@/components/home/EditorialFaq";
import { homeEditorialContent } from "@/data/home-editorial-content";

test("renders five booking questions and opens an answer", async () => {
  const user = userEvent.setup();
  render(<EditorialFaq items={homeEditorialContent.faq} />);

  expect(screen.getAllByRole("button")).toHaveLength(5);
  const processing = screen.getByRole("button", { name: "Включена ли е обработката в цената?" });
  await user.click(processing);
  expect(processing).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText(/Стандартната обработка включва светлина, цвят и изправяне/)).toBeInTheDocument();
});
```

- [ ] **Step 4: Verify RED**

```powershell
npm test -- src/components/home/editorial-proof.test.tsx src/components/home/EditorialReviews.test.tsx src/components/home/EditorialFaq.test.tsx
```

Expected: FAIL because the new components are missing.

- [ ] **Step 5: Create `VideoFeature.tsx`**

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

- [ ] **Step 6: Create `HowItWorks.tsx`**

```tsx
import { homeEditorialContent } from "@/data/home-editorial-content";

type ProcessStep = (typeof homeEditorialContent.process)[number];

export function HowItWorks({ steps }: { steps: readonly ProcessStep[] }) {
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

- [ ] **Step 7: Create `EditorialReviews.tsx`**

```tsx
import type { ReviewItem } from "@/lib/content-types";

export function EditorialReviews({ content }: { content: readonly ReviewItem[] }) {
  return (
    <section id="reviews" className="bg-[var(--pp-ink)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display text-5xl sm:text-7xl">Отзиви.</h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {content.map((review) => (
            <article key={`${review.author}-${review.role}`} className="border-t border-[var(--pp-line-dark)] pt-7">
              <blockquote className="pp-display text-2xl leading-[1.15]">“{review.quote}”</blockquote>
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

- [ ] **Step 8: Create `EditorialFaq.tsx`**

```tsx
"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { FaqItem } from "@/lib/content-types";

export function EditorialFaq({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-[var(--pp-ivory)] px-4 py-24 text-[var(--pp-text-dark)] sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display text-5xl sm:text-7xl">Въпроси.</h2>
        <div className="mt-10 border-t border-[var(--pp-line-light)]">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;

            return (
              <article key={item.question} className="border-b border-[var(--pp-line-light)]">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="text-base font-medium sm:text-lg">{item.question}</span>
                  {isOpen ? <X className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}
                </button>
                {isOpen ? (
                  <p id={answerId} className="max-w-3xl pb-6 text-sm leading-7 text-black/65">{item.answer}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 9: Verify GREEN**

```powershell
npm test -- src/components/home/editorial-proof.test.tsx src/components/home/EditorialReviews.test.tsx src/components/home/EditorialFaq.test.tsx
```

Expected: PASS.

- [ ] **Step 10: Commit**

```powershell
git add src/components/home/VideoFeature.tsx src/components/home/HowItWorks.tsx src/components/home/EditorialReviews.tsx src/components/home/EditorialReviews.test.tsx src/components/home/EditorialFaq.tsx src/components/home/EditorialFaq.test.tsx src/components/home/editorial-proof.test.tsx
git commit -m "feat: add editorial trust and process sections"
```

---

### Task 6: Build the simplified booking section without changing contact behavior

**Files:**
- Create: `src/components/home/EditorialContact.tsx`
- Create: `src/components/home/EditorialContact.test.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- `EditorialContact({ content })` consumes existing `ContactContent`.
- Reuses `validateContactForm(values)` and `submitContactForm(values, endpoint)` from `src/lib/contact.ts` unchanged.
- Produces id `contact`.

- [ ] **Step 1: Write failing contact tests**

Create `src/components/home/EditorialContact.test.tsx`:

```tsx
"use client";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditorialContact } from "@/components/home/EditorialContact";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("EditorialContact", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the simplified booking message", () => {
    render(<EditorialContact content={homeEditorialContent.contact} />);
    expect(screen.getByRole("heading", { name: "Нека заснемем следващия ви проект." })).toBeInTheDocument();
    expect(screen.getByText("Имоти · Автомобили · Продукти · Видео")).toBeInTheDocument();
  });

  it("posts to the existing Formspree endpoint and shows success", async () => {
    const user = userEvent.setup();
    let resolveRequest: ((value: Response) => void) | undefined;
    const fetchMock = vi.fn(() => new Promise<Response>((resolve) => { resolveRequest = resolve; }));
    vi.stubGlobal("fetch", fetchMock);

    render(<EditorialContact content={homeEditorialContent.contact} />);
    await user.type(screen.getByLabelText("Име"), "Иван Петров");
    await user.type(screen.getByLabelText("Телефон"), "0888 123 456");
    await user.selectOptions(screen.getByLabelText("Тип заснемане"), "Автомобили");
    await user.type(screen.getByLabelText("Съобщение"), "Търся автомобилна фотосесия.");
    const submit = screen.getByRole("button", { name: "Изпрати запитване" });
    await user.click(submit);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://formspree.io/f/mnjoooke",
      expect.objectContaining({ method: "POST", headers: { Accept: "application/json" }, body: expect.any(FormData) }),
    );
    expect(submit).toBeDisabled();

    resolveRequest?.(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } }));
    await waitFor(() => expect(screen.getByText(/Запитването беше изпратено успешно/i)).toBeInTheDocument());
  });

  it("keeps the Bulgarian Formspree rate-limit message", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ errors: [] }), { status: 429, headers: { "Content-Type": "application/json" } })));

    render(<EditorialContact content={homeEditorialContent.contact} />);
    await user.type(screen.getByLabelText("Име"), "Иван Петров");
    await user.type(screen.getByLabelText("Телефон"), "0888 123 456");
    await user.selectOptions(screen.getByLabelText("Тип заснемане"), "Автомобили");
    await user.type(screen.getByLabelText("Съобщение"), "Тест за rate limit.");
    await user.click(screen.getByRole("button", { name: "Изпрати запитване" }));

    await waitFor(() => expect(screen.getByText(/Твърде много изпратени запитвания/i)).toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Verify RED**

```powershell
npm test -- src/components/home/EditorialContact.test.tsx
```

Expected: FAIL because the component is missing.

- [ ] **Step 3: Create `EditorialContact.tsx` with the complete existing behavior**

```tsx
"use client";

import { useMemo, useState } from "react";
import type { ContactContent, ContactFormValues } from "@/lib/content-types";
import { submitContactForm, validateContactForm } from "@/lib/contact";

const initialValues: ContactFormValues = {
  name: "",
  phone: "",
  service: "",
  message: "",
};

export function EditorialContact({ content }: { content: ContactContent }) {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const canSubmit = useMemo(() => Object.values(values).every((value) => value.trim()), [values]);

  function updateField<Key extends keyof ContactFormValues>(key: Key, value: ContactFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setStatusMessage(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateContactForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatusMessage(null);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await submitContactForm(values, content.formEndpoint);
      setValues(initialValues);
      setStatusMessage({
        tone: "success",
        text: "Запитването беше изпратено успешно. Ще се свържа с вас възможно най-скоро.",
      });
    } catch (error) {
      setStatusMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "Не успях да изпратя запитването. Моля, опитайте отново след малко.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="bg-[var(--pp-ink)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="pp-display max-w-xl text-5xl leading-[0.95] sm:text-7xl">Нека заснемем следващия ви проект.</h2>
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
              {content.serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {errors.service ? <span className="form-error">{errors.service}</span> : null}
          </label>
          <label className="grid gap-2 text-sm">
            Съобщение
            <textarea className="pp-form-input min-h-36 resize-y" value={values.message} onChange={(event) => updateField("message", event.target.value)} />
            {errors.message ? <span className="form-error">{errors.message}</span> : null}
          </label>
          <button type="submit" className="pp-button-primary mt-2 w-full" disabled={!canSubmit || isSubmitting}>Изпрати запитване</button>
          {statusMessage ? (
            <p role="status" aria-live="polite" className={statusMessage.tone === "success" ? "text-sm text-[var(--pp-warm-white)]" : "text-sm text-[#ffb9a9]"}>
              {statusMessage.text}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add booking-form styles to `globals.css`**

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

- [ ] **Step 5: Verify GREEN**

```powershell
npm test -- src/components/home/EditorialContact.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/app/globals.css src/components/home/EditorialContact.tsx src/components/home/EditorialContact.test.tsx
git commit -m "feat: add editorial booking section"
```

---

### Task 7: Switch only the homepage to the Editorial composition and run the local release gate

**Files:**
- Modify: `src/components/home/HomePage.tsx`
- Modify: `src/components/home/home-page.test.tsx`

**Interfaces:**
- Consumes all Editorial components from Tasks 2–6.
- Produces the final section order: `hero`, `services`, `portfolio`, `about`, `before-after`, `videography`, `process`, `reviews`, `faq`, `contact`.

- [ ] **Step 1: Replace the stale HomePage test with the final scope/order test**

Set `src/components/home/home-page.test.tsx` to:

```tsx
import { render } from "@testing-library/react";
import { HomePage } from "@/components/home/HomePage";

describe("HomePage Editorial Commerce composition", () => {
  it("scopes the new visual system to the homepage", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector(".home-editorial")).toBeInTheDocument();
  });

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
});
```

- [ ] **Step 2: Verify RED**

```powershell
npm test -- src/components/home/home-page.test.tsx
```

Expected: FAIL because the old homepage is still rendered.

- [ ] **Step 3: Replace `HomePage.tsx` completely**

```tsx
import { BeforeAfterFeature } from "@/components/home/BeforeAfterFeature";
import { EditorialContact } from "@/components/home/EditorialContact";
import { EditorialFaq } from "@/components/home/EditorialFaq";
import { EditorialHero } from "@/components/home/EditorialHero";
import { EditorialNavbar } from "@/components/home/EditorialNavbar";
import { EditorialReviews } from "@/components/home/EditorialReviews";
import { EditorialServices } from "@/components/home/EditorialServices";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SelectedWork } from "@/components/home/SelectedWork";
import { VideoFeature } from "@/components/home/VideoFeature";
import { WhyChooseMe } from "@/components/home/WhyChooseMe";
import { homeEditorialContent } from "@/data/home-editorial-content";

export function HomePage() {
  return (
    <div className="home-editorial">
      <EditorialNavbar links={homeEditorialContent.nav} />
      <main className="relative overflow-x-clip">
        <EditorialHero content={homeEditorialContent.hero} />
        <EditorialServices services={homeEditorialContent.services} />
        <SelectedWork items={homeEditorialContent.selectedWork} />
        <WhyChooseMe content={homeEditorialContent.why} />
        <BeforeAfterFeature content={homeEditorialContent.beforeAfter} />
        <VideoFeature content={homeEditorialContent.video} />
        <HowItWorks steps={homeEditorialContent.process} />
        <EditorialReviews content={homeEditorialContent.reviews} />
        <EditorialFaq items={homeEditorialContent.faq} />
        <EditorialContact content={homeEditorialContent.contact} />
      </main>
    </div>
  );
}
```

Do not delete the old homepage section files; they remain available for Phase 2 migration reference.

- [ ] **Step 4: Verify HomePage GREEN**

```powershell
npm test -- src/components/home/home-page.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Run the complete unit/lint/build gate**

```powershell
npm test
npm run lint
npm run build
```

Expected: all PASS. If an old homepage unit test fails only because its component is no longer rendered, the component's own test should still pass independently; do not delete or weaken unrelated tests.

- [ ] **Step 6: Verify shared brochure files were not changed**

```powershell
git diff design/homepage-editorial-commerce -- src/components/home/Navbar.tsx src/components/site/SiteFrame.tsx src/components/site/AboutPageView.tsx src/components/site/ServicesHubPageView.tsx src/components/site/ServiceDetailPageView.tsx
```

Expected: no output.

- [ ] **Step 7: Commit**

```powershell
git add src/components/home/HomePage.tsx src/components/home/home-page.test.tsx
git commit -m "feat: switch homepage to editorial commerce"
```

---

### Task 8: Add responsive/SSR release proof and use Vercel Preview as the production gate

**Files:**
- Modify: `tests/e2e/home.spec.ts`
- Modify: `tests/e2e/brochure-pages.spec.ts`

**Interfaces:**
- Produces the executable Phase 1 release gate and the owner-preview checkpoint.

- [ ] **Step 1: Replace the desktop homepage E2E test**

In `tests/e2e/home.spec.ts`, keep the existing import and replace the old desktop flow with:

```ts
test("desktop editorial homepage stays minimal and completes booking flow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route("https://formspree.io/f/mnjoooke", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Снимки, които продават." })).toBeVisible();
  await expect(page.locator("#hero")).not.toContainText("Commercial Photography");
  await expect(page.locator("#hero")).not.toContainText("24–48ч");
  await expect(page.locator("#hero")).not.toContainText("София и региона");
  await expect(page.locator("#hero")).not.toContainText("От €20");

  const servicesTop = await page.locator("#services").evaluate((element) => element.getBoundingClientRect().top);
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

  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});
```

- [ ] **Step 2: Keep the existing 429 test and replace old mobile/tablet assertions with these tests**

```ts
test("mobile opening remains dark, complete, and uncluttered", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Снимки, които продават." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Обади се сега" })).toHaveCount(0);
  const servicesTop = await page.locator("#services").evaluate((element) => element.getBoundingClientRect().top);
  expect(servicesTop).toBeGreaterThanOrEqual(834);

  await page.getByRole("button", { name: "Отвори менюто" }).click();
  await expect(page.locator('a[href="#portfolio"]').last()).toBeVisible();
  await expect(page.locator('a[href="#contact"]').last()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test("tablet homepage has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});
```

- [ ] **Step 3: Add JavaScript-disabled SSR visibility test**

```ts
test("critical homepage content remains visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
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

- [ ] **Step 4: Add brochure isolation test**

Append to `tests/e2e/brochure-pages.spec.ts`:

```ts
test("phase 1 homepage styling does not leak onto brochure routes", async ({ page }) => {
  for (const route of ["/about", "/services", "/services/automotive", "/portfolio"]) {
    await page.goto(route);
    await expect(page.locator(".home-editorial")).toHaveCount(0);
    await expect(page.locator("main")).toBeVisible();
  }
});
```

- [ ] **Step 5: Run the complete local release gate**

```powershell
npm test
npm run lint
npm run build
npm run test:e2e
```

Expected: all PASS.

- [ ] **Step 6: Perform manual responsive review**

```powershell
npm run dev
```

Inspect exactly:

- 390×844
- 768×1024
- 1280×800
- 1440×900
- 1920×1080

At every viewport confirm: no light strip on first load; no removed hero copy; intentional image crops; gradual dark-to-warm transition; equal service weight; asymmetric portfolio; no horizontal overflow; usable mobile menu, FAQ, slider, and form.

- [ ] **Step 7: Commit the E2E release gates**

```powershell
git add tests/e2e/home.spec.ts tests/e2e/brochure-pages.spec.ts
git commit -m "test: gate editorial homepage rollout"
```

- [ ] **Step 8: Push the feature branch**

```powershell
git push -u origin feat/homepage-editorial-commerce
```

Expected: Vercel creates a Preview deployment.

- [ ] **Step 9: Verify Vercel Preview before asking for approval**

Confirm project `pavlov-photography` shows:

- state `READY`;
- source repo `todevan/pavlov-photography`;
- source branch `feat/homepage-editorial-commerce`;
- successful Next.js build.

Open the preview and smoke-test `/`, `/about`, `/services`, `/services/automotive`, and `/portfolio`.

- [ ] **Step 10: Stop for explicit owner visual approval**

Do not merge or promote the preview. Present the Preview URL and wait for an explicit approval message.

- [ ] **Step 11: Merge to `main` only after approval and verify production**

Merge without force-push. Confirm production deployment is `READY`, aliases include `pavlovphotography.eu` and `www.pavlovphotography.eu`, and live server HTML contains `Снимки, които продават.` and service copy without hidden-by-default `opacity: 0` wrappers.

---

## Self-Review Checklist

- [ ] Product photograph is real owner-approved work.
- [ ] Old OpenCode design reference is retired.
- [ ] Legacy shared `Navbar` and `SiteFrame` are unchanged in Phase 1.
- [ ] New CSS is additive and activated by `.home-editorial`.
- [ ] Hero contains only the approved minimal content.
- [ ] First viewport does not expose the light section.
- [ ] Transition is gradual and CSS-driven.
- [ ] Services show the three equal categories and starting prices.
- [ ] Selected Work contains only local owner-approved imagery.
- [ ] Before/after keyboard behavior remains intact.
- [ ] Video/process/reviews/FAQ follow the approved compressed structure.
- [ ] Contact still uses the existing Formspree endpoint and error behavior.
- [ ] No floating-call CTA appears on the homepage opening.
- [ ] Critical content remains visible without JavaScript.
- [ ] Non-home routes do not contain `.home-editorial`.
- [ ] Unit tests, lint, build, and E2E all pass.
- [ ] Vercel Preview receives owner approval before production merge.
