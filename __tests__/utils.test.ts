import {
  formatCurrency,
  calculateDiscountPercentage,
  generateOrderNumber,
  slugify,
} from "@/lib/utils";

describe("Core Utility Helpers Unit Tests", () => {
  test("formatCurrency formats numbers into INR format", () => {
    const formatted = formatCurrency(499);
    expect(formatted).toContain("499");
  });

  test("calculateDiscountPercentage calculates correct percentage", () => {
    const discount = calculateDiscountPercentage(500, 399);
    expect(discount).toBe(20);
  });

  test("calculateDiscountPercentage returns 0 if no discount", () => {
    const discount = calculateDiscountPercentage(500, 500);
    expect(discount).toBe(0);
  });

  test("generateOrderNumber generates string with ORCH prefix", () => {
    const orderNo = generateOrderNumber();
    expect(orderNo).toMatch(/^ORCH-\d{8}-\d{4}$/);
  });

  test("slugify creates clean URL slugs", () => {
    const slug = slugify("M9 T337 Clonal Rootstock (Bundle of 10)");
    expect(slug).toBe("m9-t337-clonal-rootstock-bundle-of-10");
  });
});
