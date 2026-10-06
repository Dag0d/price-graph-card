import { describe, expect, it } from "vitest";
import { canReuseGraph, getOverlayPricesInRange } from "../src/card-update";

describe("overlay price lookup", () => {
  const t = (minutes: number) => new Date(Date.UTC(2026, 0, 1, 0, minutes));
  const dayEnd = t(240);

  it("keeps a valid zero price", () => {
    const points = [{ start: t(0), price: 0 }, { start: t(60), price: 5 }];
    expect(getOverlayPricesInRange(points, t(0), t(60), dayEnd)).toEqual([0]);
  });

  it("returns the point running at the slot start (stretched overlay)", () => {
    const points = [{ start: t(0), price: 1 }, { start: t(120), price: 2 }];
    expect(getOverlayPricesInRange(points, t(60), t(120), dayEnd)).toEqual([1]);
  });

  it("returns every point inside the slot (squeezed overlay)", () => {
    const points = [{ start: t(0), price: 1 }, { start: t(30), price: 2 }, { start: t(60), price: 3 }];
    expect(getOverlayPricesInRange(points, t(0), t(60), dayEnd)).toEqual([1, 2]);
  });

  it("returns nothing without overlay points", () => {
    expect(getOverlayPricesInRange([], t(0), t(60), dayEnd)).toEqual([]);
    expect(getOverlayPricesInRange(null, t(0), t(60), dayEnd)).toEqual([]);
  });
});

describe("graph redraw guard", () => {
  const host = { firstChild: {} };

  it("reuses the drawn graph for an unchanged signature and host", () => {
    expect(canReuseGraph("sig", "sig", host, host)).toBe(true);
  });

  it("redraws into a replaced host even with an unchanged signature", () => {
    expect(canReuseGraph("sig", "sig", { firstChild: {} }, host)).toBe(false);
  });

  it("redraws when the host was emptied", () => {
    const empty = { firstChild: null };
    expect(canReuseGraph("sig", "sig", empty, empty)).toBe(false);
  });

  it("redraws when the signature changed", () => {
    expect(canReuseGraph("next", "sig", host, host)).toBe(false);
  });
});
