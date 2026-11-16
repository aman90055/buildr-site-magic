import { describe, expect, it } from "vitest";
import { CHANGELOG } from "@/lib/changelog";

describe("changelog", () => {
  it("is ordered newest first", () => {
    const dates = CHANGELOG.map((e) => e.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("never mentions removed ad networks", () => {
    expect(JSON.stringify(CHANGELOG).toLowerCase()).not.toContain("adsterra");
  });
});
