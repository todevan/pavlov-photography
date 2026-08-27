import { render, screen } from "@testing-library/react";
import { EditorialHero } from "@/components/home/EditorialHero";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("EditorialHero", () => {
  it("renders only the approved opening copy and actions", () => {
    render(<EditorialHero content={homeEditorialContent.hero} />);

    expect(screen.getByRole("heading", { name: /Снимки, които продават\./i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Запази снимане" })).toHaveAttribute(
      "href",
      "#contact",
    );
    expect(screen.getByRole("link", { name: "Виж услугите" })).toHaveAttribute(
      "href",
      "#services",
    );

    expect(screen.queryByText(/Commercial Photography/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/24–48ч/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/София и региона/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/От €20/i)).not.toBeInTheDocument();
  });

  it("shows only the approved local hero photographs", () => {
    render(<EditorialHero content={homeEditorialContent.hero} />);

    expect(screen.getAllByRole("img")).toHaveLength(2);
    for (const image of homeEditorialContent.hero.images) {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    }
  });
});
