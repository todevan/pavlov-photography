import { render, screen, within } from "@testing-library/react";
import { HomePage } from "@/components/home/HomePage";

describe("HomePage editorial integration", () => {
  it("scopes the new visual system to the homepage", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector(".home-editorial")).toBeInTheDocument();
  });

  it("uses the minimal editorial opening instead of the legacy hero controls", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /Снимки, които продават\./i })).toBeInTheDocument();

    const bookingLinks = screen.getAllByRole("link", { name: "Запази снимане" });
    expect(bookingLinks).toHaveLength(2);
    for (const link of bookingLinks) {
      expect(link).toHaveAttribute("href", "#contact");
    }

    expect(screen.queryByRole("button", { name: /Недвижими имоти/i })).not.toBeInTheDocument();
  });

  it("uses the static three-service editorial section instead of pricing tabs", () => {
    render(<HomePage />);

    const services = document.getElementById("services");
    expect(services).not.toBeNull();
    expect(within(services!).queryByRole("tablist")).not.toBeInTheDocument();
    expect(within(services!).getByRole("link", { name: /Недвижими имоти/i })).toHaveAttribute(
      "href",
      "/services/real-estate",
    );
    expect(within(services!).getByRole("link", { name: /Автомобили/i })).toHaveAttribute(
      "href",
      "/services/automotive",
    );
    expect(within(services!).getByRole("link", { name: /Продукти/i })).toHaveAttribute(
      "href",
      "/services/products",
    );
  });
});
