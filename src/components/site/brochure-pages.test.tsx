import { render, screen } from "@testing-library/react";
import { AboutPageView } from "@/components/site/AboutPageView";
import { ServiceDetailPageView } from "@/components/site/ServiceDetailPageView";
import { ServicesHubPageView } from "@/components/site/ServicesHubPageView";
import { aboutPageContent } from "@/data/brochure-content";
import { getServicePageBySlug } from "@/lib/brochure";

describe("brochure page views", () => {
  it("renders the standalone about page with a booking CTA", () => {
    render(<AboutPageView content={aboutPageContent} />);

    expect(screen.getByRole("heading", { name: /Кой стои зад кадъра/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Запази снимане" })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });

  it("renders the services hub with links to all four service detail pages", () => {
    render(<ServicesHubPageView />);

    const heading = screen.getByRole("heading", { name: "Услуги" });
    const description = screen.getByText(/Всяка услуга е изградена/i);

    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain("text-center");
    expect(screen.queryByText("Услуги с ясен резултат")).not.toBeInTheDocument();
    expect(description.className).toContain("text-center");
    expect(screen.getByRole("link", { name: "Недвижими имоти" })).toHaveAttribute(
      "href",
      "/services/real-estate",
    );
    expect(screen.getByRole("link", { name: "Видеография" })).toHaveAttribute(
      "href",
      "/services/videography",
    );
  });

  it("tightens the real estate service page hero, included, and process layout", () => {
    const realEstatePage = getServicePageBySlug("real-estate");

    expect(realEstatePage).toBeDefined();
    render(<ServiceDetailPageView content={realEstatePage!} />);

    expect(screen.queryByText(/Недвижими имоти с повече присъствие/i)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Недвижими имоти$/i })).toBeInTheDocument();
    expect(screen.queryByText(/^Включено$/i)).not.toBeInTheDocument();
    expect(screen.getByText("Какво е включено").className).toContain("text-center");
    expect(screen.getByText("Какво е включено").className).toContain("text-[var(--accent)]");
    expect(screen.getByText("Какво е включено").closest("section")?.textContent).toContain(
      "Подготовка за най-подходящите ъгли на заснемане",
    );
    expect(screen.getByText("Стъпки").className).toContain("justify-center");
    expect(screen.getByRole("heading", { name: /Процес без излишен хаос/i }).className).toContain(
      "text-center",
    );
  });

  it("updates automotive, products, and videography detail pages with the cleaned copy and denser gain cards", () => {
    const automotivePage = getServicePageBySlug("automotive");
    const productsPage = getServicePageBySlug("products");
    const videographyPage = getServicePageBySlug("videography");

    expect(automotivePage).toBeDefined();
    expect(productsPage).toBeDefined();
    expect(videographyPage).toBeDefined();

    const { rerender } = render(<ServiceDetailPageView content={automotivePage!} />);

    expect(
      screen.queryByText(/От чисти listing кадри до по-изразени showcase серии/i),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Какво печелите").className).toContain("text-[1rem]");
    expect(screen.getByText("Какво печелите").className).toContain("sm:text-2xl");
    expect(screen.getByText("Какво печелите").className).toContain("text-center");
    expect(screen.getByText("Стъпки").className).toContain("justify-center");

    rerender(<ServiceDetailPageView content={productsPage!} />);

    expect(screen.queryByText(/Продукти с по-чисто и по-желано излъчване/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Продукти с по-желано излъчване/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Какво печелите").className).toContain("text-[1rem]");
    expect(screen.getByText("Какво печелите").className).toContain("sm:text-2xl");
    expect(screen.getByText("Какво печелите").className).toContain("text-center");

    rerender(<ServiceDetailPageView content={videographyPage!} />);

    expect(screen.getByText("Какво печелите").className).toContain("text-[1rem]");
    expect(screen.getByText("Какво печелите").className).toContain("sm:text-2xl");
    expect(screen.getByText("Какво печелите").className).toContain("text-center");
  });
});