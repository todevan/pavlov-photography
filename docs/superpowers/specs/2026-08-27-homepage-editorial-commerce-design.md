# Pavlov Photography — Site-wide Editorial Commerce Visual System + Homepage Phase 1

**Date:** 2026-08-27  
**Status:** Design approved; implementation not started  
**Design scope:** Site-wide visual system  
**Phase 1 implementation scope:** Homepage only  
**Branch:** `design/homepage-editorial-commerce`

## 1. Goal

Create a coherent site-wide visual language for Pavlov Photography, then apply it first to the homepage.

The redesign must move the site away from its current dark, component-heavy, SaaS-like presentation and toward a premium commercial-photography identity that is image-led, editorial, restrained, and conversion-focused.

Phase 1 changes only the homepage implementation. `/about`, `/services`, service-detail pages, portfolio pages, and other routes remain functionally unchanged in Phase 1, but the visual system is intentionally designed so those pages can later migrate to the same language without redesigning the system again.

The three primary commercial categories remain equal in importance:

- real estate;
- automotive;
- products.

Videography remains a visible secondary service.

## 2. Core Direction

The approved direction is **Editorial Commerce**.

It combines:

- cinematic photography;
- strong editorial typography;
- minimal UI chrome;
- clear commercial hierarchy;
- restrained pricing and booking cues;
- smooth tonal transitions between dark and light areas;
- confidence through proof rather than decorative interface.

The homepage narrative is:

**Impact → Services → Price → Proof → Trust → Process → Book**

The visual principle is:

**Less UI, more proof.**

Whenever there is a choice between a decorative card and a strong photograph, prefer the photograph. Whenever there is a choice between repeated marketing copy and clear commercial information, prefer the clear information.

## 3. Site-wide Visual System

### 3.1 Scope rule

The system in this document is not a homepage-only aesthetic.

Typography, color logic, spacing, image treatment, navigation behavior, button language, motion rules, and surface treatment are intended to become the shared design language of the whole site.

Phase 1 applies the system only to the homepage. Later phases may migrate the remaining routes to the same system without changing the core design direction.

### 3.2 Color system

#### Dark surfaces

- **Ink:** approximately `#151515`
- **Soft black:** approximately `#1C1B19`
- **Warm white:** approximately `#F5F1E8`
- **Muted text:** warm neutral gray, never blue-gray

#### Light surfaces

- **Ivory:** approximately `#F2EEE5`
- **Paper:** approximately `#E9E2D6`
- **Primary text on light:** approximately `#191816`

#### Accent

Use a restrained warm ochre / muted brass around `#B79052`.

The accent is sparse and functional. Appropriate uses include:

- small rules;
- selected hover/focus details;
- occasional typographic emphasis;
- subtle CTA emphasis;
- compact metadata.

The interface must not become a dominant “gold UI” theme. Photography remains the main source of color.

### 3.3 Typography

Retain the existing font pair:

- **Cormorant Garamond** — display/editorial voice;
- **Inter** — navigation, body, pricing, metadata, controls, forms.

Cormorant Garamond should be used more deliberately than in the current site rather than appearing only as an italic accent word.

Target hierarchy:

- hero display: roughly 80–96px on large desktop, responsive downward;
- major section headings: roughly 48–64px desktop;
- mobile major headings: roughly 36–44px;
- body text: approximately 16–18px depending on context.

Use less uppercase copy and less extreme letter-spacing than the current site.

### 3.4 Image treatment

Photography must dominate the layout.

Use:

- large editorial image blocks;
- mixed portrait and landscape crops;
- controlled asymmetry;
- meaningful responsive crop positions;
- minimal overlays;
- minimal or square-ish radii, approximately 4–10px where needed.

Avoid:

- placing every image inside an identical rounded card;
- excessive image gradients;
- decorative glow;
- glassmorphism;
- uniform card grids that give every project the same visual weight.

Production imagery presented as portfolio proof must be owner-approved work. Stock imagery must not be presented as the photographer’s own work.

### 3.5 Cards

Cards are used only when they help commercial scanning.

The main card use in Phase 1 is the three service choices after the hero.

Service cards should use:

- light paper/ivory surfaces or a restrained transitional equivalent;
- thin borders;
- little or no shadow;
- one strong image;
- service name;
- clear starting price;
- one concise description;
- text-forward CTA.

Avoid nested cards and card-within-card layouts.

### 3.6 Buttons

Primary CTA:

**Запази снимане →**

Secondary CTA:

**Виж услугите ↘**

Treatment:

- modest radius, approximately 4–8px;
- no oversized pill treatment;
- clear contrast;
- subtle arrow movement on hover is acceptable;
- dark-on-light and warm-light-on-dark variants should share the same geometry.

### 3.7 Navigation

Desktop direction:

**PAVLOV PHOTOGRAPHY** — `Работа` · `Услуги` · `За мен` · `Контакт` — **Запази снимане**

At the top of the page:

- visually minimal;
- transparent or nearly transparent over the dark hero;
- no large floating capsule;
- no decorative oversized frame.

After scroll:

- subtle warm-dark surface;
- light blur only if needed for legibility;
- clear focus and hover states.

Mobile:

- brand remains visible;
- compact accessible menu control;
- booking remains easy to reach.

### 3.8 Motion

Motion is restrained enhancement, never a visibility dependency.

Target:

- 150–300ms transitions;
- subtle image scale where useful;
- underline/arrow movement;
- gentle tonal interpolation between sections where technically appropriate;
- support `prefers-reduced-motion`.

Critical rule:

**Server-rendered critical content must be visible by default.**

The previous failure mode is prohibited:

`SSR → opacity: 0 → wait for hydration / in-view animation`

Hero copy, service information, prices, portfolio proof, major headings, and booking controls must be visible without JavaScript animation.

## 4. Homepage Phase 1 Information Architecture

### 4.1 Hero — full-viewport dark cinematic opening

Purpose: create immediate visual confidence with almost no explanatory clutter.

The initial viewport must read as one complete dark composition. The next light section must not visibly intrude at first load on normal desktop or mobile viewport heights.

#### Hero content

The hero contains only:

- site navigation;
- headline;
- primary CTA;
- secondary CTA;
- hero photography.

#### Explicitly removed from the hero

Do not include:

- eyebrow text such as `Теодор Павлов · Commercial Photography · София`;
- decorative line above the headline;
- supporting paragraph below the headline;
- trust/stat signals such as `24–48ч`, `София`, or `От €20`;
- icons/emojis accompanying those signals;
- service cards inside the hero.

#### Headline

**Снимки, които**  
*продават.*

The second line may use Cormorant Garamond italic with restrained brass emphasis.

#### Actions

Primary:

`Запази снимане`

Secondary:

`Виж услугите`

#### Desktop composition

Target approximately 40–45% copy / 55–60% imagery.

The image area should represent the breadth of the business through a refined multi-image composition, ideally using real estate, automotive, and product work when owner-approved assets exist.

The hero must not feel like three cards placed beside text. It should feel like one composed photographic spread.

#### Mobile composition

Order:

1. navigation;
2. headline;
3. CTAs;
4. photography.

The opening should remain dark and complete before the next section appears.

### 4.2 Hero-to-content transition

A hard black-to-white cut immediately below the hero is not allowed.

The transition into the next section should feel gradual and intentional.

Preferred approaches include:

- dark charcoal gradually warming toward graphite/taupe;
- layered background interpolation;
- subtle gradient bridge;
- a transitional dark-warm section edge before full ivory appears later.

The first visible content after the hero may remain dark or warm graphite. Full ivory should arrive only after enough scroll that it feels like a new chapter rather than a white strip under the opening screen.

The transition must remain performant and must not depend on expensive scroll-JavaScript effects when CSS can achieve the same result.

### 4.3 Services + starting prices

The three services remain the first major commercial information after the hero transition.

The three choices are equal in visual weight.

#### Недвижими имоти

- starting price: `от €30`;
- audience direction: brokers, agencies, Airbnb, private listings;
- one owner-approved image;
- CTA: `Виж пакетите →`.

#### Автомобили

- starting price: `от €20`;
- audience direction: private listings, dealerships, premium listings;
- one owner-approved image;
- CTA: `Виж пакетите →`.

#### Продукти

- starting price: `от €30`;
- audience direction: e-commerce, social content, campaigns;
- one owner-approved product image before it is presented as portfolio work;
- CTA: `Виж пакетите →`.

The section must communicate service and entry price in one quick scan without turning into a pricing dashboard.

### 4.4 Selected Work — dark editorial proof

Use approximately 4–6 strong owner-approved images in an asymmetric editorial composition.

Possible hierarchy:

- one dominant automotive landscape;
- one tall detail/interior image;
- one dominant real-estate image;
- one product image when approved real product work is available;
- one or two additional images only if they improve composition.

Metadata is minimal.

Example:

`AUTOMOTIVE · BMW M SERIES`

CTA:

`Разгледай цялото портфолио →`

Do not reproduce the current eight equally weighted rounded gallery cards on the homepage.

### 4.5 Why Pavlov Photography

Condense the current About, trust information, and useful terms into one calm section.

Heading direction:

`Професионално заснемане без излишно усложнение.`

Trust points:

1. `Ясна цена предварително`
2. `Предаване до 24–48 часа`
3. `Обработени готови файлове`
4. `Директна комуникация с фотографа`

Identity block:

**Теодор Павлов**  
`Commercial photographer · Sofia`

CTA:

`Повече за мен →`

The homepage does not repeat the full biography from `/about`.

### 4.6 Before / After

Promote the current before/after interaction into a large proof section.

Heading direction:

`Снимането е половината работа.`

Supporting copy:

`Всеки финален кадър преминава през корекция на светлина, цвят, перспектива и детайл.`

Use a large comparison surface and avoid decorative cards around it.

### 4.7 Videography

Simplify videography into one cinematic feature rather than a tab system with repeated feature cards.

Content direction:

**Видеография**  
`от €50 / видео`

`Кратки cinematic видеа за имоти, автомобили и продукти.`

CTA:

`Виж видеография →`

Detailed information remains on the dedicated service page.

### 4.8 How It Works

Three-step section:

#### 01 Запитване

`Казваш какво и кога трябва да снимаме.`

#### 02 Заснемане

`Идвам на локация и изпълняваме предварително уточнения план.`

#### 03 Получаваш готовите кадри

`Обработени файлове до 24–48 часа.`

The goal is to make booking feel simple and low-friction.

### 4.9 Reviews

Show all three existing testimonials without requiring carousel interaction on desktop.

One may be visually featured, but all three remain discoverable immediately.

On smaller screens they may stack.

Do not invent testimonials.

### 4.10 FAQ

Keep only the strongest booking blockers:

1. `Кога получавам снимките?`
2. `Как се запазва час?`
3. `Включена ли е обработката?`
4. `Снимаш ли извън София?`
5. `Как се плаща?`

### 4.11 Final booking section

End with a decisive booking section.

Heading direction:

`Нека заснемем следващия ви проект.`

Categories:

`Имоти · Автомобили · Продукти · Видео`

Primary action:

`Изпрати запитване`

Direct alternative:

`0889 755 406`

Retain the existing contact functionality and Formspree integration unless separately requested.

Form fields remain concise:

- Name;
- Phone;
- Service;
- Message.

## 5. Content Consolidation

The redesign does not delete valid business information from the site. It removes duplication from the homepage and leaves detail on dedicated pages.

Merge or remove as standalone homepage sections:

- the long current About presentation;
- six-card Terms section;
- large videography tabs and repeated feature cards;
- three pricing cards per category on the homepage;
- repeated statistics cards;
- carousel-only testimonial presentation;
- repeated statements about delivery time, Sofia, Drive/WeTransfer, and payment when they add no new information.

The dedicated routes remain the place for depth.

## 6. Component Architecture

`HomePage.tsx` becomes an orchestration layer.

Recommended Phase 1 boundaries:

- `HomeHero`
- `HomeServices`
- `SelectedWork`
- `WhyChooseMe`
- `BeforeAfterFeature`
- `VideoFeature`
- `HowItWorks`
- `HomeReviews`
- `HomeFaq`
- `BookingSection`

Reuse existing focused components where they cleanly fit the new design. Do not refactor unrelated architecture.

Shared design primitives created for Phase 1 should be reusable by later site-wide migration rather than hard-coded exclusively to the homepage.

Examples of reusable primitives/tokens include:

- dark/light section surfaces;
- spacing scale;
- display typography;
- buttons;
- navigation treatment;
- editorial image frame/caption treatment;
- focus states;
- motion durations.

## 7. Responsive Behavior

### Desktop

- full-viewport dark hero;
- roughly 40–45/55–60 copy/image balance;
- no next light section visible at initial load;
- three-column services;
- asymmetric selected-work layout;
- three reviews visible simultaneously.

### Tablet

- preserve strong hero photography with reduced composition complexity;
- service cards may use 2+1 or clean stacking;
- selected work becomes controlled two-column layout;
- no cramped display type.

### Mobile

- full dark opening state;
- headline and CTAs first;
- photography immediately after actions;
- no trust-signal/icon row;
- service cards stack;
- no horizontal overflow;
- touch targets approximately 44px minimum where applicable;
- meaningful image crops;
- booking remains easy to reach.

## 8. Performance

Photography is the largest performance risk.

Requirements:

- use `next/image` where appropriate;
- set accurate `sizes`;
- priority/preload only genuinely above-the-fold imagery;
- lazy-load lower-page imagery;
- avoid shipping multi-megabyte originals unnecessarily when optimized derivatives are possible;
- reserve image dimensions to prevent CLS;
- avoid heavy client JavaScript for decorative effects;
- prefer CSS for tonal transitions where practical.

The hero may use multiple images, but the composition must be performance-budgeted rather than loading three maximum-resolution originals by default.

## 9. Accessibility

Requirements:

- sufficient contrast across dark, transitional, and light surfaces;
- meaningful alt text for portfolio proof;
- visible keyboard focus;
- semantic heading hierarchy;
- accessible menu controls;
- approximately 44px touch targets where practical;
- before/after remains keyboard-operable;
- form labels remain real labels;
- `prefers-reduced-motion` support;
- visual transitions never reduce text readability.

## 10. Content Truth and Asset Integrity

Do not invent:

- clients;
- awards;
- project counts;
- testimonials;
- statistics;
- service capabilities;
- prices;
- turnaround guarantees beyond existing approved claims.

The repository currently contains stock product/real-estate portfolio examples. They may remain on existing pages until separately addressed, but Phase 1 must not elevate stock imagery into hero or selected-work proof as though it were Teodor Pavlov’s own photography.

A real owner-approved product photograph is required before the final production hero/selected-work composition can truthfully represent all three primary categories with portfolio evidence.

## 11. Acceptance Criteria

Phase 1 is complete only when all of the following are true.

### Visual / UX

- initial viewport is fully dark/cinematic and does not show a white/ivory strip from the next section;
- hero shows only navigation, `Снимки, които продават.`, two CTAs, and photography;
- no hero eyebrow, decorative rule, support paragraph, trust signals, icons, or emojis;
- hero-to-content transition is gradual rather than a hard black-to-white cut;
- three primary services and starting prices are easy to scan after the opening transition;
- selected work feels like an editorial photo spread, not a SaaS card grid;
- site-wide tokens/primitives created in Phase 1 are reusable for later route migration.

### Functional

- navigation and anchors work;
- service links target correct routes;
- portfolio links work;
- before/after interaction works;
- FAQ works;
- contact form preserves current functionality;
- telephone action remains usable;
- no horizontal overflow at supported viewport sizes.

### Motion / rendering

- critical SSR content is visible before hydration;
- no critical component ships with hidden-by-default `opacity: 0` behavior;
- reduced-motion users receive a stable experience.

### Verification

- existing relevant unit/component tests pass or are intentionally updated for the approved redesign;
- lint passes;
- production `next build` passes;
- responsive sanity checks pass on mobile, tablet, and desktop;
- live Vercel deployment reaches `READY`;
- `pavlovphotography.eu` and `www.pavlovphotography.eu` serve the new production deployment;
- final live smoke check confirms the opening viewport and SSR visibility requirements.

## 12. Out of Scope for Phase 1

Phase 1 does not redesign the implementation of:

- `/about`;
- `/services`;
- individual service pages;
- `/portfolio` and portfolio detail pages;
- unrelated backend/integrations;
- Formspree behavior;
- deployment architecture.

Those routes are expected to migrate later to the same approved site-wide visual system.

## 13. Design Decision Summary

Approved direction:

- **Site-wide design system:** yes;
- **Phase 1 implementation:** homepage only;
- **Primary mode:** conversion-first;
- **Primary categories:** real estate, automotive, products equally weighted;
- **Style:** Editorial Commerce;
- **Opening:** full-viewport cinematic dark;
- **Hero copy:** headline only, no explanatory microcopy;
- **Hero actions:** `Запази снимане` + `Виж услугите`;
- **Hero clutter:** no eyebrow, rule, paragraph, trust row, icons, or emojis;
- **Color rhythm:** dark opening with gradual tonal transitions, not a visible white cut;
- **Typography:** Cormorant Garamond + Inter;
- **Accent:** restrained muted brass;
- **Portfolio treatment:** image-led editorial proof;
- **Motion:** progressive enhancement only;
- **Content integrity:** owner-approved work only when presented as portfolio proof.
