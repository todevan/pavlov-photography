import type { ReviewItem } from "@/lib/content-types";

export function EditorialReviews({ content }: { content: readonly ReviewItem[] }) {
  return (
    <section id="reviews" className="bg-[var(--pp-soft-black)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display text-5xl leading-none text-[var(--pp-warm-white)] sm:text-7xl">Отзиви.</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {content.map((review) => (
            <article key={`${review.author}-${review.role}`} className="border-t border-[var(--pp-line-dark)] pt-7">
              <blockquote className="pp-display text-2xl leading-[1.15] text-[var(--pp-warm-white)]">“{review.quote}”</blockquote>
              <p className="mt-7 text-sm font-semibold text-[var(--pp-warm-white)]">{review.author}</p>
              <p className="mt-1 text-xs text-[var(--pp-muted)]">{review.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
