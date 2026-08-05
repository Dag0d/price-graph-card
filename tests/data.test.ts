import { describe, expect, it } from "vitest";
import { safeNumber } from "../src/data";

describe("safeNumber", () => {
  it("keeps real zero values", () => {
    expect(safeNumber(0)).toBe(0);
    expect(safeNumber("0")).toBe(0);
  });

  it("rejects absent and non-numeric values", () => {
    expect(safeNumber(null)).toBeNull();
    expect(safeNumber(undefined)).toBeNull();
    expect(safeNumber("")).toBeNull();
    expect(safeNumber("   ")).toBeNull();
    expect(safeNumber(false)).toBeNull();
    expect(safeNumber("not-a-number")).toBeNull();
  });
});
