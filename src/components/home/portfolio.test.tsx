"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Portfolio } from "@/components/home/Portfolio";
import { homeContent } from "@/data/home-content";

describe("Portfolio", () => {
  it("filters gallery items and updates the visible count", async () => {
    const user = userEvent.setup();

    render(<Portfolio content={homeContent.portfolio} />);

    expect(screen.getByText("8 проекта")).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Видео" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Автомобили" }));

    expect(screen.getByText("2 проекта")).toBeInTheDocument();
    expect(screen.getByText("BMW M Series")).toBeInTheDocument();
    expect(screen.getByText("Интериорен детайл")).toBeInTheDocument();
    expect(screen.queryByText("Градски апартамент")).not.toBeInTheDocument();
  });

  it("keeps only the centered processing label above the before/after slider", () => {
    render(<Portfolio content={homeContent.portfolio} />);

    expect(screen.getByText("Обработка").parentElement).toHaveClass(
      "flex",
      "justify-center",
      "lg:col-span-2",
    );
    expect(screen.queryByRole("heading", { name: /Преди и/i })).not.toBeInTheDocument();
    expect(screen.queryByText(homeContent.portfolio.beforeAfter.description)).not.toBeInTheDocument();
  });

  it("packs the portfolio controls and gallery cards more tightly", () => {
    render(<Portfolio content={homeContent.portfolio} />);

    expect(screen.getByRole("tablist").parentElement).toHaveClass(
      "soft-card",
      "flex",
      "flex-col",
      "items-stretch",
      "gap-2.5",
      "sm:flex-row",
      "sm:flex-wrap",
      "sm:items-center",
      "sm:gap-4",
    );
    expect(screen.getByText("BMW M Series").closest("article")).toHaveClass(
      "mb-3",
      "sm:mb-4",
      "block",
      "w-full",
      "break-inside-avoid",
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});