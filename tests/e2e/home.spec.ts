import { expect, test } from "@playwright/test";

test("desktop editorial homepage stays minimal and completes booking flow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route("https://formspree.io/f/mnjoooke", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/");

  await expect(page.getByRole("link", { name: "Pavlov Photography" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Отвори менюто" })).toBeHidden();
  await expect(page.getByRole("heading", { name: "Снимки, които продават." })).toBeVisible();
  await expect(page.locator("#hero")).not.toContainText("Commercial Photography");
  await expect(page.locator("#hero")).not.toContainText("24–48ч");
  await expect(page.locator("#hero")).not.toContainText("София и региона");
  await expect(page.locator("#hero")).not.toContainText("От €20");

  const servicesTop = await page.locator("#services").evaluate(
    (element) => element.getBoundingClientRect().top,
  );
  expect(servicesTop).toBeGreaterThanOrEqual(890);

  await page.getByRole("link", { name: "Виж услугите" }).click();
  await expect(page.locator("#services")).toBeInViewport();
  await expect(page.locator("#services").getByRole("link", { name: /Недвижими имоти/i })).toBeVisible();
  await expect(page.locator("#services").getByRole("link", { name: /Автомобили/i })).toBeVisible();
  await expect(page.locator("#services").getByRole("link", { name: /Продукти/i })).toBeVisible();

  await expect(page.locator("#reviews article")).toHaveCount(3);

  const slider = page.getByRole("slider", { name: "Плъзгач преди и след" });
  await slider.scrollIntoViewIfNeeded();
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "55");

  await page.getByRole("button", { name: "Включена ли е обработката в цената?" }).click();
  await expect(
    page.getByText(/Стандартната обработка включва светлина, цвят и изправяне/),
  ).toBeVisible();

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByLabel("Име").fill("Иван Петров");
  await page.getByLabel("Телефон").fill("0888 123 456");
  await page.getByLabel("Тип заснемане").selectOption("Автомобили");
  await page.getByLabel("Съобщение").fill("Търся автомобилна фотосесия за обява.");
  await page.getByRole("button", { name: "Изпрати запитване" }).click();
  await expect(page.getByText(/Запитването беше изпратено успешно/i)).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test("mobile opening remains dark, minimal, and uncluttered", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Снимки, които продават." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Обади се сега" })).toHaveCount(0);

  const servicesTop = await page.locator("#services").evaluate(
    (element) => element.getBoundingClientRect().top,
  );
  expect(servicesTop).toBeGreaterThanOrEqual(834);

  await page.getByRole("button", { name: "Отвори менюто" }).click();
  await expect(page.locator('a[href="#portfolio"]').last()).toBeVisible();
  await expect(page.locator('a[href="#contact"]').last()).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test("critical homepage content is visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Снимки, които продават." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Запази снимане" }).first()).toBeVisible();
  await expect(page.locator("#services")).toContainText("Недвижими имоти");
  await expect(page.locator("#services")).toContainText("от €20");
  await expect(page.locator("#portfolio")).toContainText("BMW M SERIES");

  await context.close();
});

test("contact form shows a retry message when Formspree rate-limits the request", async ({ page }) => {
  await page.route("https://formspree.io/f/mnjoooke", async (route) => {
    await route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({ errors: [] }),
    });
  });

  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByLabel("Име").fill("Иван Петров");
  await page.getByLabel("Телефон").fill("0888 123 456");
  await page.getByLabel("Тип заснемане").selectOption("Автомобили");
  await page.getByLabel("Съобщение").fill("Тест за rate limit.");
  await page.getByRole("button", { name: "Изпрати запитване" }).click();

  await expect(page.getByText(/Твърде много изпратени запитвания/i)).toBeVisible();
});
