"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { FaqItem } from "@/lib/content-types";

export function EditorialFaq({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="bg-[var(--pp-ivory)] px-4 py-24 text-[var(--pp-text-dark)] sm:px-8 lg:px-10 xl:px-16"
    >
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display text-5xl leading-none sm:text-7xl">Въпроси.</h2>
        <div className="mt-10 border-t border-[var(--pp-line-light)]">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `editorial-faq-answer-${index}`;

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
                  {isOpen ? (
                    <X className="h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                </button>
                {isOpen ? (
                  <p id={answerId} className="max-w-3xl pb-6 text-sm leading-7 text-black/65">
                    {item.answer}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
