import { render, screen } from "@testing-library/react";
import { EditorialReviews } from "@/components/home/EditorialReviews";
import { homeEditorialContent } from "@/data/home-editorial-content";

test("renders all three reviews without carousel controls", () => {
  render(<EditorialReviews content={homeEditorialContent.reviews} />);

  expect(screen.getAllByRole("article")).toHaveLength(3);
  expect(screen.queryByRole("button", { name: /Следващ отзив/i })).not.toBeInTheDocument();
});
