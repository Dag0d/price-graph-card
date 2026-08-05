import { describe, expect, it } from "vitest";
import { getMappedPrice } from "../src/card-update";

describe("overlay price lookup", () => {
  it("keeps a valid zero price", () => {
    expect(getMappedPrice(new Map([[60, 0]]), 60)).toBe(0);
  });

  it("returns null only for missing points", () => {
    expect(getMappedPrice(new Map(), 60)).toBeNull();
    expect(getMappedPrice(null, 60)).toBeNull();
  });
});
