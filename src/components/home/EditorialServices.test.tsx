import { render, screen, within } from "@testing-library/react";
import { EditorialServices } from "@/components/home/EditorialServices";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("EditorialServices", () => {
  it("renders three equal service choices with starting prices and deep links", () => {
    render(<EditorialServices services={homeEditorialContent.services} />);

    const realEstate = screen.getByRole("link", { name: /Недвижими имоти/i });
    const automotive = screen.getByRole("link", { name: /Автомобили/i });
    const products = screen.getByRole("link", { name: /Продукти/i });

    expect(realEstate).toHaveAttribute("href", "/services/real-estate");
    expect(automotive).toHaveAttribute("href", "/services/automotive");
    expect(products).toHaveAttribute("href", "/services/products");

    expect(within(realEstate).getByText("от €30")).toBeInTheDocument();
    expect(within(automotive).getByText("от €20")).toBeInTheDocument();
    expect(within(products).getByText("от €30")).toBeInTheDocument();
  });

  it("keeps the product service truthful when no owner product image exists", () => {
    render(<EditorialServices services={homeEditorialContent.services} />);

    const products = screen.getByRole("link", { name: /Продукти/i });
    expect(within(products).queryByRole("img")).not.toBeInTheDocument();
    expect(within(products).getByText("Виж пакетите →")).toBeInTheDocument();
  });
});
