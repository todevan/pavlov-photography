import { homeEditorialContent } from "@/data/home-editorial-content";

describe("homeEditorialContent", () => {
  it("uses only local portfolio imagery for all surfaced owner work", () => {
    const serviceImages = homeEditorialContent.services.flatMap((service) =>
      service.image ? [service.image.src] : [],
    );
    const imageSources = [
      ...homeEditorialContent.hero.images.map((image) => image.src),
      ...serviceImages,
      ...homeEditorialContent.selectedWork.map((item) => item.image),
    ];

    expect(imageSources.length).toBeGreaterThan(0);
    expect(imageSources.every((source) => source.startsWith("/portfolio/"))).toBe(true);
    expect(imageSources.some((source) => source.includes("unsplash"))).toBe(false);
  });

  it("does not fake product photography while an owner image is unavailable", () => {
    const productService = homeEditorialContent.services.find(
      (service) => service.category === "products",
    );

    expect(productService).toBeDefined();
    expect(productService?.image).toBeNull();
    expect(homeEditorialContent.hero.images).toHaveLength(2);
  });

  it("uses the BMW photograph as the dominant hero image", () => {
    expect(homeEditorialContent.hero.images[0]?.src).toBe("/portfolio/bmw-m-series.png");
    expect(homeEditorialContent.hero.images[1]?.src).toBe("/portfolio/urban-apartment.png");
  });
});
