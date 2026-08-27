"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditorialFaq } from "@/components/home/EditorialFaq";
import { homeEditorialContent } from "@/data/home-editorial-content";

test("renders five booking questions and opens an answer", async () => {
  const user = userEvent.setup();
  render(<EditorialFaq items={homeEditorialContent.faq} />);

  expect(screen.getAllByRole("button")).toHaveLength(5);
  const processing = screen.getByRole("button", {
    name: "Включена ли е обработката в цената?",
  });

  await user.click(processing);

  expect(processing).toHaveAttribute("aria-expanded", "true");
  expect(
    screen.getByText(/Стандартната обработка включва светлина, цвят и изправяне/),
  ).toBeInTheDocument();
});
