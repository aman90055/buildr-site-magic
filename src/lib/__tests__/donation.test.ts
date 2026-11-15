import { describe, expect, it } from "vitest";
import { DONATION_UPI_ID, DONATION_UPI_LINK } from "../donation";

describe("Donation QR recipient", () => {
  it("uses the recipient encoded in the uploaded QR", () => {
    expect(DONATION_UPI_ID).toBe("7905970907@ybl");
    expect(new URL(DONATION_UPI_LINK).searchParams.get("pa")).toBe("7905970907@ybl");
  });
  it("allows the donor to choose the amount", () => {
    expect(new URL(DONATION_UPI_LINK).searchParams.has("am")).toBe(false);
  });
});