import { describe, expect, it } from "vitest";
import { DONATION_UPI_ID, DONATION_UPI_LINK } from "../donation";

describe("Donation UPI recipient", () => {
  it("uses the owner's UPI ID Docu2026@nyes", () => {
    expect(DONATION_UPI_ID).toBe("Docu2026@nyes");
    expect(new URL(DONATION_UPI_LINK).searchParams.get("pa")).toBe("Docu2026@nyes");
  });
  it("allows the donor to choose the amount", () => {
    expect(new URL(DONATION_UPI_LINK).searchParams.has("am")).toBe(false);
  });
});
