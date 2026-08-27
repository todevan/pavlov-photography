"use client";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditorialContact } from "@/components/home/EditorialContact";
import { homeEditorialContent } from "@/data/home-editorial-content";

describe("EditorialContact", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps the existing Formspree submission behavior in the simplified booking section", async () => {
    const user = userEvent.setup();
    let resolveRequest: ((value: Response) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveRequest = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<EditorialContact content={homeEditorialContent.contact} />);

    expect(
      screen.getByRole("heading", { name: "Нека заснемем следващия ви проект." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Имоти · Автомобили · Продукти · Видео")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Име"), "Иван Петров");
    await user.type(screen.getByLabelText("Телефон"), "0888 123 456");
    await user.selectOptions(screen.getByLabelText("Тип заснемане"), "Автомобили");
    await user.type(screen.getByLabelText("Съобщение"), "Търся автомобилна фотосесия.");

    const submitButton = screen.getByRole("button", { name: "Изпрати запитване" });
    await user.click(submitButton);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://formspree.io/f/mnjoooke",
      expect.objectContaining({ method: "POST" }),
    );
    expect(submitButton).toBeDisabled();

    resolveRequest?.(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await waitFor(() => {
      expect(screen.getByText(/Запитването беше изпратено успешно/i)).toBeInTheDocument();
    });
  });

  it("preserves the Bulgarian rate-limit message", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ errors: [] }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    render(<EditorialContact content={homeEditorialContent.contact} />);

    await user.type(screen.getByLabelText("Име"), "Иван Петров");
    await user.type(screen.getByLabelText("Телефон"), "0888 123 456");
    await user.selectOptions(screen.getByLabelText("Тип заснемане"), "Автомобили");
    await user.type(screen.getByLabelText("Съобщение"), "Тест за rate limit.");
    await user.click(screen.getByRole("button", { name: "Изпрати запитване" }));

    await waitFor(() => {
      expect(screen.getByText(/Твърде много изпратени запитвания/i)).toBeInTheDocument();
    });
  });
});
