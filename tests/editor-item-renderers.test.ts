import { describe, expect, it } from "vitest";
import { shouldShowItemLabel } from "../src/editor-item-renderers";

describe("item label editor visibility", () => {
  it("shows labels for every extra slot source", () => {
    expect(shouldShowItemLabel({ source: "attribute" })).toBe(true);
    expect(shouldShowItemLabel({ source: "entity" })).toBe(true);
    expect(shouldShowItemLabel({ source: "current_price" })).toBe(true);
  });

  it("shows the current-price header label when time overwrite is enabled", () => {
    expect(shouldShowItemLabel({ source: "current_price", time_overwrite: false }, true)).toBe(false);
    expect(shouldShowItemLabel({ source: "current_price", time_overwrite: true }, true)).toBe(true);
  });

  it("shows labels for other header sources", () => {
    expect(shouldShowItemLabel({ source: "attribute" }, true)).toBe(true);
    expect(shouldShowItemLabel({ source: "next_price_level" }, true)).toBe(true);
  });
});
