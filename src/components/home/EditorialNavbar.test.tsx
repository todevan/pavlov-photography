"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditorialNavbar } from "@/components/home/EditorialNavbar";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("EditorialNavbar", () => {
  it("renders the refined homepage wordmark, navigation, and booking action", () => {
    render(<EditorialNavbar links={homeEditorialContent.nav} />);

    expect(screen.getByRole("link", { name: "Pavlov Photography" })).toHaveAttribute(
      "href",
      "#hero",
    );
    expect(screen.getByRole("link", { name: "Работа" })).toHaveAttribute("href", "#portfolio");
    expect(screen.getByRole("link", { name: "Услуги" })).toHaveAttribute("href", "#services");
    expect(screen.getByRole("link", { name: "За мен" })).toHaveAttribute("href", "#about");
    expect(screen.getByRole("link", { name: "Контакт" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "Запази снимане" })).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  it("opens and closes the mobile menu accessibly", async () => {
    const user = userEvent.setup();
    render(<EditorialNavbar links={homeEditorialContent.nav} />);

    const menuButton = screen.getByRole("button", { name: "Отвори менюто" });
    await user.click(menuButton);

    expect(screen.getByRole("button", { name: "Затвори менюто" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Работа" })).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Затвори менюто" }));
    expect(screen.getByRole("button", { name: "Отвори менюто" })).toBeInTheDocument();
  });
});
