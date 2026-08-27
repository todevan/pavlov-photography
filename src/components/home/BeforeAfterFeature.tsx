import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { homeEditorialContent } from "@/data/home-editorial-content";

type BeforeAfterContent = typeof homeEditorialContent.beforeAfter;

export function BeforeAfterFeature({ content }: { content: BeforeAfterContent }) {
  return (
    <section
      id="before-after"
      className="bg-[var(--pp-soft-black)] px-4 py-24 sm:px-8 lg:px-10 xl:px-16"
    >
      <div className="mx-auto max-w-[92rem]">
        <h2 className="pp-display text-5xl sm:text-7xl">Снимането е половината работа.</h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--pp-muted)]">
          Всеки финален кадър преминава през корекция на светлина, цвят, перспектива и детайл.
        </p>
        <div className="mt-10">
          <BeforeAfterSlider
            beforeLabel="Преди"
            afterLabel="След"
            beforeImage={{
              src: content.beforeImage,
              alt: `${content.alt} преди обработка`,
            }}
            afterImage={{
              src: content.afterImage,
              alt: `${content.alt} след обработка`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
