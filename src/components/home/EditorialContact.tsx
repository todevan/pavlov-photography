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
  const [errors, setErrors] =
    useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  const canSubmit = useMemo(() => Object.values(values).every((value) => value.trim()), [values]);

  function updateField<Key extends keyof ContactFormValues>(
    key: Key,
    value: ContactFormValues[Key],
  ) {
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
        text:
          error instanceof Error
            ? error.message
            : "Не успях да изпратя запитването. Моля, опитайте отново след малко.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="bg-[var(--pp-ink)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16">
      <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="pp-display max-w-xl text-5xl leading-[0.95] text-[var(--pp-warm-white)] sm:text-7xl">
            Нека заснемем следващия ви проект.
          </h2>
          <p className="mt-6 text-sm text-[var(--pp-muted)]">
            Имоти · Автомобили · Продукти · Видео
          </p>
          <a
            href={`tel:${content.phone}`}
            className="mt-8 inline-flex text-lg font-semibold text-[var(--pp-warm-white)]"
          >
            0889 755 406
          </a>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          <label className="grid gap-2 text-sm text-[var(--pp-warm-white)]">
            Име
            <input
              className="border-0 border-b border-[var(--pp-line-dark)] bg-transparent px-0 py-3 text-base text-[var(--pp-warm-white)]"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
            {errors.name ? <span className="form-error">{errors.name}</span> : null}
          </label>

          <label className="grid gap-2 text-sm text-[var(--pp-warm-white)]">
            Телефон
            <input
              className="border-0 border-b border-[var(--pp-line-dark)] bg-transparent px-0 py-3 text-base text-[var(--pp-warm-white)]"
              value={values.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
            {errors.phone ? <span className="form-error">{errors.phone}</span> : null}
          </label>

          <label className="grid gap-2 text-sm text-[var(--pp-warm-white)]">
            Тип заснемане
            <select
              className="border-0 border-b border-[var(--pp-line-dark)] bg-transparent px-0 py-3 text-base text-[var(--pp-warm-white)]"
              value={values.service}
              onChange={(event) => updateField("service", event.target.value)}
            >
              <option value="" className="text-black">Изберете услуга</option>
              {content.serviceOptions.map((option) => (
                <option key={option} value={option} className="text-black">
                  {option}
                </option>
              ))}
            </select>
            {errors.service ? <span className="form-error">{errors.service}</span> : null}
          </label>

          <label className="grid gap-2 text-sm text-[var(--pp-warm-white)]">
            Съобщение
            <textarea
              className="min-h-36 resize-y border-0 border-b border-[var(--pp-line-dark)] bg-transparent px-0 py-3 text-base text-[var(--pp-warm-white)]"
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
            {errors.message ? <span className="form-error">{errors.message}</span> : null}
          </label>

          <button
            type="submit"
            className="pp-button-primary mt-2 w-full"
            disabled={!canSubmit || isSubmitting}
          >
            Изпрати запитване
          </button>

          {statusMessage ? (
            <p
              role="status"
              aria-live="polite"
              className={
                statusMessage.tone === "success"
                  ? "text-sm text-[var(--pp-warm-white)]"
                  : "text-sm text-[#ffb9a9]"
              }
            >
              {statusMessage.text}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
