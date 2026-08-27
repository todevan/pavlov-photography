import { render, screen } from "@testing-library/react";
import { BeforeAfterFeature } from "@/components/home/BeforeAfterFeature";
import { SelectedWork } from "@/components/home/SelectedWork";
import { WhyChooseMe } from "@/components/home/WhyChooseMe";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("Editorial proof sections", () => {
  it("renders curated owner-approved work only", () => {
    render(<SelectedWork items={homeEditorialContent.selectedWork} />);

    expect(screen.getByText("AUTOMOTIVE · BMW M SERIES")).toBeInTheDocument();
    expect(screen.getByText("REAL ESTATE · SOFIA")).toBeInTheDocument();
    expect(screen.queryByText("Luxury Timepiece")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Разгледай цялото портфолио →" }),
    ).toHaveAttribute("href", "/portfolio");
  });

  it("condenses trust to four proof points", () => {
    render(<WhyChooseMe content={homeEditorialContent.why} />);

    expect(screen.getByText("Ясна цена предварително")).toBeInTheDocument();
    expect(screen.getByText("Директна комуникация с фотографа")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Повече за мен →" })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it("keeps the existing before-after slider", () => {
    render(<BeforeAfterFeature content={homeEditorialContent.beforeAfter} />);

    expect(screen.getByRole("slider", { name: "Плъзгач преди и след" })).toBeInTheDocument();
    expect(screen.getByText("Снимането е половината работа.")).toBeInTheDocument();
  });
});
