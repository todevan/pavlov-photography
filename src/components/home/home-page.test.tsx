import { render, screen } from "@testing-library/react";
import { HomePage } from "@/components/home/HomePage";

describe("HomePage editorial integration", () => {
  it("scopes the new visual system to the homepage", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector(".home-editorial")).toBeInTheDocument();
  });

  it("uses the minimal editorial opening instead of the legacy hero controls", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /Снимки, които продават\./i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Запази снимане" })).toHaveAttribute(
      "href",
      "#contact",
    );
    expect(screen.queryByRole("button", { name: /Недвижими имоти/i })).not.toBeInTheDocument();
  });
});
