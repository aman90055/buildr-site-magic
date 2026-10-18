import { describe, expect, it } from "vitest";
import { PUBLIC_PDF_START_PATH } from "../homeAccess";
import { checkFileSizeLimit, FREE_FILE_SIZE_LIMIT } from "../fileSizeLimit";

describe("Public PDF access", () => {
  it("starts at the public merge tool, not sign-in", () => {
    expect(PUBLIC_PDF_START_PATH).toBe("/merge");
  });
  it("does not impose a free-user file-size cap", () => {
    expect(FREE_FILE_SIZE_LIMIT).toBe(Infinity);
    const file = new File(["pdf"], "large.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 2 * 1024 ** 3 });
    expect(checkFileSizeLimit(file, false)).toBe(true);
  });
});