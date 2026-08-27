# Pavlov Photography Homepage — Editorial Commerce Redesign

**Date:** 2026-08-27  
**Status:** Design approved; implementation not started  
**Scope:** Homepage only  
**Branch:** `design/homepage-editorial-commerce`

## 1. Goal

Redesign the Pavlov Photography homepage from a dark, component-heavy portfolio into a conversion-first commercial photography landing page that still feels premium and image-led.

The homepage must make a new visitor understand, within the first 5–10 seconds:

1. what Teodor Pavlov photographs;
2. who the service is for;
3. that pricing is clear;
4. what the work looks like;
5. how to book.

The three primary commercial categories are equal in importance:

- real estate;
- automotive;
- products.

Videography remains a supported secondary service.

The design direction is **Editorial Commerce**: cinematic photography and editorial typography combined with clear commercial structure and strong booking actions.

## 2. Design Principles

### 2.1 Conversion first

The homepage is not a passive portfolio. Every major section should reduce uncertainty and move the visitor toward booking.

The narrative order is:

**Photography → Service → Price → Proof → Trust → Process → Book**

### 2.2 Less UI, more proof

Prefer real work over decorative interface.

- Prefer a strong project image over a “premium” badge.
- Prefer a before/after example over a card claiming professional editing.
- Prefer a clear price and CTA over repeated statistics.
- Avoid UI patterns that make a photography business look like a SaaS dashboard.

### 2.3 Hybrid visual rhythm

The site alternates between cinematic dark sections and warm light sections rather than rendering the entire homepage on near-black.

Target rhythm:

1. Dark — Hero
2. Ivory — Services
3. Dark — Selected Work
4. Ivory — Why Pavlov Photography
5. Dark — Before / After
6. Dark photographic — Videography
7. Ivory — How It Works
8. Dark — Reviews
9. Ivory — FAQ
10. Dark — Final Booking CTA

### 2.4 Content must be true

Do not invent clients, awards, project counts, testimonials, statistics, service capabilities, prices, or turnaround promises.

The implementation may only use claims already supported by the current site content or explicitly provided by the owner.

### 2.5 Progressive enhancement, never hidden-by-default content

Critical content must be visible in server-rendered HTML.

Animations may add polish after hydration, but hero copy, service information, pricing, portfolio proof, contact information, and major headings must never rely on JavaScript to become visible.

The previous failure mode is explicitly prohibited:

`SSR → opacity: 0 → wait for hydration / in-view animation`

## 3. Visual Direction

### 3.1 Visual north star

The approved hypothetical mockup establishes the intended feeling, not a pixel-perfect implementation contract:

- dark cinematic hero;
- editorial serif display typography;
- restrained muted-brass accent;
- a three-image hero composition representing real estate, automotive, and products;
- clean top navigation;
- strong booking CTA;
- immediate transition into a warm ivory services section.

Production must use real owner-approved photography. The hypothetical mockup imagery is reference-only and must not be treated as portfolio evidence.

### 3.2 Color system

#### Dark surfaces

- **Ink:** approximately `#151515`
- **Soft black:** approximately `#1C1B19`
- **Warm white:** approximately `#F5F1E8`
- **Muted dark text:** warm neutral gray, never blue-gray

#### Light surfaces

- **Ivory:** approximately `#F2EEE5`
- **Paper:** approximately `#E9E2D6`
- **Light-section text:** approximately `#191816`

#### Accent

Use a restrained warm ochre / muted brass around `#B79052`.

The accent must be sparse. It can support:

- eyebrow labels;
- fine rules;
- selected focus states;
- subtle CTA emphasis;
- small metadata.

It must not become a dominant “gold UI” theme. The photographs are the primary source of color.

### 3.3 Typography

Retain the existing font pairing because it already supports Latin and Cyrillic:

- **Cormorant Garamond** — display/editorial voice;
- **Inter** — navigation, body copy, pricing, metadata, forms, controls.

Target hierarchy:

- Hero display: roughly 80–96px on large desktop, responsive downward;
- Major section headings: roughly 48–64px desktop;
- Mobile major headings: roughly 36–44px;
- Body: comfortable commercial reading size, approximately 16–18px depending on context.

Use less uppercase text and less extreme letter-spacing than the current homepage.

Hero headline direction:

**Снимки, които**  
*продават.*

The second line may use Cormorant italic and muted brass, but the accent must remain refined rather than fluorescent.

### 3.4 Image treatment

Photography must dominate the page.

Use:

- mixed portrait and landscape crops;
- large editorial image blocks;
- controlled asymmetry;
- minimal overlays;
- minimal or square-ish corner radii, approximately 4–10px where needed;
- purposeful responsive crops.

Avoid:

- putting every image inside the same rounded card;
- excessive gradients over images;
- decorative glow around images;
- uniform masonry that makes every project feel equally important.

### 3.5 Cards

Cards are primarily appropriate for the three service choices immediately below the hero.

Service cards should use:

- ivory/paper surfaces;
- thin borders;
- little or no shadow;
- one strong image;
- service name;
- prominent starting price;
- one concise description;
- a text-forward CTA.

Avoid nested cards, glassmorphism, glow, and heavy elevation.

### 3.6 Buttons

Primary CTA wording:

**Запази снимане →**

Treatment:

- solid dark on light sections;
- warm ivory or brass-accented treatment on dark sections;
- modest radius around 4–8px;
- not a large pill;
- subtle arrow movement on hover is acceptable.

Secondary CTA example:

**Виж услугите ↘**

Secondary actions should be visually quieter than the booking CTA.

### 3.7 Navigation

Desktop navigation direction:

**PAVLOV PHOTOGRAPHY** — `Работа` · `Услуги` · `За мен` · `Контакт` — **Запази снимане**

At the top of the page:

- transparent over the hero;
- no large floating capsule;
- no decorative oversized frame.

After scroll:

- subtle warm-dark solid/translucent surface;
- light blur only if it improves readability;
- clear focus and hover states.

Mobile:

- brand remains visible;
- menu control is compact and accessible;
- booking remains easy to reach.

### 3.8 Motion

Motion should be restrained and optional.

Target:

- 150–300ms interaction transitions;
- subtle image scale on hover where appropriate;
- underline or arrow movement;
- very light reveal enhancement only for non-critical content;
- support `prefers-reduced-motion`.

Do not hide content by default for animation.

## 4. Homepage Information Architecture

### 4.1 Hero — dark cinematic

Purpose: explain the service and show quality immediately.

Desktop structure:

- approximately 45% copy / 55% imagery;
- left: eyebrow, H1, supporting text, two CTAs, three trust signals;
- right: a visually balanced three-image composition representing real estate, automotive, and products.

Approved copy direction:

**Eyebrow**  
`Теодор Павлов · Commercial Photography · София`

**H1**  
`Снимки, които продават.`

**Supporting text**  
`Професионална фотография за имоти, автомобили и продукти — с ясни цени, бързо предаване и кадри, готови за обяви, кампании и социални мрежи.`

**Primary CTA**  
`Запази снимане`

**Secondary CTA**  
`Виж услугите`

**Trust signals**

- `24–48ч предаване`
- `София и региона`
- `От €20`

The current large hero service cards are removed from the hero.

Mobile order:

1. navigation;
2. H1;
3. supporting text;
4. CTAs;
5. hero photography;
6. trust signals.

The photography must appear early enough that the page still feels like a photography business on mobile.

### 4.2 Services + starting prices — warm ivory

This is the first section after the hero.

Three equal service choices:

#### Недвижими имоти

- starting price: `от €30`;
- audience direction: brokers, agencies, Airbnb, private listings;
- one real project image;
- CTA: `Виж пакетите →`.

#### Автомобили

- starting price: `от €20`;
- audience direction: private listings, dealerships, premium listings;
- one real project image;
- CTA: `Виж пакетите →`.

#### Продукти

- starting price: `от €30`;
- audience direction: e-commerce, social content, campaigns;
- one real project image;
- CTA: `Виж пакетите →`.

The section must make service type and entry price understandable with one quick scan.

### 4.3 Selected Work — dark editorial

Purpose: prove quality before asking the visitor to trust marketing claims.

Use approximately 4–6 high-quality images in an asymmetric editorial composition.

Possible representation:

- one dominant automotive landscape;
- one tall interior image;
- one dominant real-estate image;
- one product image;
- one or two additional strong projects if they improve composition.

Metadata should be minimal, for example:

`AUTOMOTIVE · BMW M SERIES`

CTA:

`Разгледай цялото портфолио →`

Do not reproduce the current eight equally weighted rounded gallery cards on the homepage.

### 4.4 Why Pavlov Photography — ivory

Merge and condense the current long About content, statistics, quote treatment, and relevant terms/trust content.

Heading direction:

`Професионално заснемане без излишно усложнение.`

Four trust points:

1. `Ясна цена предварително`
2. `Предаване до 24–48 часа`
3. `Обработени готови файлове`
4. `Директна комуникация с фотографа`

Include a concise personal identity block:

**Теодор Павлов**  
`Commercial photographer · Sofia`

CTA:

`Повече за мен →`

The homepage should not repeat the full biography already available on `/about`.

### 4.5 Before / After — dark

Promote the existing before/after interaction into a stronger proof section.

Use a large, dominant comparison slider.

Copy direction:

**Heading**  
`Снимането е половината работа.`

**Supporting copy**  
`Всеки финален кадър преминава през корекция на светлина, цвят, перспектива и детайл.`

Avoid surrounding this proof with unnecessary cards.

### 4.6 Videography — cinematic strip

Videography remains visible but is simplified.

Use one large visual/thumbnail with concise supporting copy.

Content direction:

**Видеография**  
`от €50 / видео`

`Кратки cinematic видеа за имоти, автомобили и продукти.`

CTA:

`Виж видеография →`

Remove the homepage’s current large videography tab system and repetitive feature-card grid. Detailed information remains available on the dedicated service page.

### 4.7 How It Works — ivory

Three-step conversion section:

#### 01 Запитване

`Казваш какво и кога трябва да снимаме.`

#### 02 Заснемане

`Идвам на локация и изпълняваме предварително уточнения план.`

#### 03 Получаваш готовите кадри

`Обработени файлове до 24–48 часа.`

This section should make the service feel simple and low-friction.

### 4.8 Reviews — dark

Display all three current testimonials at once on desktop rather than hiding two behind a carousel.

One review may be visually featured, but all three should be discoverable without interaction.

On smaller screens, stacking is acceptable.

Do not invent additional testimonials.

### 4.9 FAQ — ivory

Keep the homepage FAQ short and focused on booking blockers.

Target questions:

1. `Кога получавам снимките?`
2. `Как се запазва час?`
3. `Включена ли е обработката?`
4. `Снимаш ли извън София?`
5. `Как се плаща?`

Long-tail information can remain on service/detail pages.

### 4.10 Final Booking Section — dark

End with a strong booking decision rather than a passive footer.

Heading direction:

`Нека заснемем следващия ви проект.`

Supporting categories:

`Имоти · Автомобили · Продукти · Видео`

Primary action:

`Изпрати запитване`

Direct alternative:

`0889 755 406`

Retain the existing contact functionality and Formspree integration unless a separate feature request changes it.

The form remains concise:

- Name;
- Phone;
- Service;
- Message.

## 5. Content Consolidation

The redesign does not delete valid business information from the site. It removes duplication from the homepage and leaves detailed information on dedicated pages.

Remove or merge as standalone homepage sections:

- the current long About presentation;
- the six-card Terms section;
- the large videography tabs and repeated feature cards;
- the current presentation of three pricing cards per category on the homepage;
- repeated statistics cards;
- carousel-only testimonial presentation;
- repeated statements about 48-hour delivery, Sofia, Drive/WeTransfer, and payment when they do not add new information.

Dedicated pages such as `/about`, `/services`, service detail pages, and portfolio pages remain available for depth.

## 6. Component Architecture

`HomePage.tsx` should become an orchestration layer rather than carrying substantial visual logic.

Recommended homepage component boundaries:

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

Reuse existing focused components when they already satisfy the new design cleanly. Do not refactor unrelated site architecture.

Each homepage component should have one clear responsibility and should consume structured content rather than duplicating business copy inside presentation logic where practical.

## 7. Responsive Behavior

### Desktop

- Hero roughly 45/55 copy-to-image balance;
- three-column service section;
- asymmetric editorial portfolio;
- three reviews visible simultaneously;
- generous display typography and whitespace.

### Tablet

- preserve strong hero imagery while reducing complexity;
- service cards may use 2+1 or a clean stacked arrangement depending on width;
- selected work becomes a controlled two-column composition;
- avoid cramped typography or tiny metadata.

### Mobile

- copy precedes hero imagery;
- both hero CTAs remain prominent;
- service cards stack;
- no horizontal overflow;
- touch targets should be approximately 44px minimum where applicable;
- typography scales without awkward one-word lines;
- booking remains easy to reach;
- portfolio crops must remain meaningful, not arbitrary center-crops.

## 8. Performance Requirements

Photography is the heaviest content, so image delivery is a design requirement rather than a later optimization.

Use Next.js image optimization appropriately:

- `next/image` for production photography where compatible;
- correct `sizes` values;
- priority/preload only for truly above-the-fold hero imagery;
- lazy loading below the fold;
- defined dimensions/aspect ratios to prevent layout shift;
- avoid shipping multi-megabyte originals directly where a properly optimized derivative can preserve visual quality;
- avoid heavy JavaScript for decorative effects.

Existing large local source images should be reviewed during implementation for appropriate web delivery.

## 9. Accessibility Requirements

The redesign must preserve or improve accessibility.

Requirements:

- meaningful alt text for portfolio and commercial photography;
- sufficient contrast on dark and ivory backgrounds;
- visible keyboard focus;
- semantic heading order;
- explicit accessible names for controls;
- keyboard-operable before/after comparison;
- real labels for form controls;
- accessible validation feedback;
- `prefers-reduced-motion` support;
- navigation/menu operable without pointer input.

## 10. Functional Constraints

The redesign must not break:

- `/about`;
- `/services`;
- service detail pages;
- `/portfolio`;
- portfolio detail routes;
- navbar anchors/links;
- before/after control;
- FAQ interaction;
- contact form submission;
- telephone CTA;
- current Vercel deployment workflow and custom domains.

No new backend is required for this redesign.

## 11. Testing and Acceptance Criteria

The redesign is complete only when both functional verification and visual goals pass.

### Automated / build gates

- existing unit/component tests pass or are intentionally updated when the approved UI contract changes;
- lint passes;
- production `next build` passes;
- no TypeScript errors.

### Functional smoke gates

- homepage renders all critical content without animation dependency;
- navbar and homepage navigation work;
- service links target correct destinations;
- portfolio CTA and relevant project links work;
- before/after interaction works;
- FAQ interaction works;
- contact form retains current functionality;
- telephone CTA is correct;
- no horizontal overflow at target mobile/tablet/desktop widths.

### Responsive visual gates

Verify at representative mobile, tablet, and desktop sizes.

The page must preserve:

- clear hero hierarchy;
- visible photography early on mobile;
- readable service pricing;
- intentional image crops;
- stable spacing rhythm;
- usable touch targets.

### Performance / rendering gates

- critical homepage content is present and visible in initial server-rendered HTML;
- no major layout shift from undefined media dimensions;
- hero media is intentionally prioritized and lower sections are not unnecessarily eager-loaded;
- no regression to the previous `opacity:0` initial-render defect.

### Production verification

After merge/deployment:

- Vercel production deployment is `READY`;
- deployment corresponds to the intended commit SHA;
- `pavlovphotography.eu` and `www.pavlovphotography.eu` resolve to the new production deployment;
- live homepage smoke check passes;
- initial HTML confirms critical content is visible without hydration.

### Visual acceptance

Compare the implementation against the approved hypothetical mockup and this specification using five criteria:

1. **Hierarchy** — the visitor knows what the business offers immediately;
2. **Image dominance** — photography leads, UI recedes;
3. **Light/dark rhythm** — the page has deliberate visual chapters;
4. **Typography** — editorial, premium, readable, and Cyrillic-safe;
5. **Conversion clarity** — services, starting prices, proof, and booking are obvious.

## 12. Out of Scope

Unless separately approved, this redesign does not include:

- redesigning all internal pages to the new system;
- changing backend/contact providers;
- adding a CMS;
- adding booking/calendar software;
- inventing new portfolio material;
- changing pricing strategy;
- changing the three primary commercial service categories;
- unrelated repository refactors;
- DNS/domain migration;
- Vercel project replacement.

## 13. Implementation Safety

Implementation should happen on a non-production feature branch first.

Do not use `main` as the experimentation surface. The existing live production homepage remains the rollback baseline until the redesign passes tests and visual review.

Production promotion should be a deliberate final step after local/build verification and review.
