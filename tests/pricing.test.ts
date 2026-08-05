import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCurrentTodayContext, getDayPriceMetricText } from "../src/pricing";

const BERLIN = "Europe/Berlin";
const CFG = {
  unit_format: "currency",
  decimals: 2,
  detailed_colors: false,
};

afterEach(() => {
  vi.useRealTimers();
});

describe("current price window", () => {
  it("infers an hourly final interval from hourly data", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:30:00Z"));
    const timeline = [
      { start: new Date("2026-01-15T10:00:00Z"), price: 0.2 },
      { start: new Date("2026-01-15T11:00:00Z"), price: 0.21 },
      { start: new Date("2026-01-15T12:00:00Z"), price: 0.22 },
    ];
    const result = buildCurrentTodayContext(CFG, { currency: "EUR" }, timeline, BERLIN);
    expect(result.currentWindow).toBe("13:00-14:00");
  });

  it("keeps a 15-minute final interval for quarter-hour data", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:32:00Z"));
    const timeline = [
      { start: new Date("2026-01-15T12:00:00Z"), price: 0.2 },
      { start: new Date("2026-01-15T12:15:00Z"), price: 0.21 },
      { start: new Date("2026-01-15T12:30:00Z"), price: 0.22 },
    ];
    const result = buildCurrentTodayContext(CFG, { currency: "EUR" }, timeline, BERLIN);
    expect(result.currentWindow).toBe("13:30-13:45");
  });

  it("does not use a future point as the current price", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    const timeline = [
      { start: new Date("2026-01-15T13:00:00Z"), price: 0.2 },
      { start: new Date("2026-01-15T14:00:00Z"), price: 0.21 },
    ];
    const result = buildCurrentTodayContext(CFG, { currency: "EUR" }, timeline, BERLIN);
    expect(result.currentPoint).toBeNull();
    expect(result.currentWindow).toBe("");
  });

  it("stops using the final price after its inferred interval", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T14:30:00Z"));
    const timeline = [
      { start: new Date("2026-01-15T12:00:00Z"), price: 0.2 },
      { start: new Date("2026-01-15T13:00:00Z"), price: 0.21 },
    ];
    const result = buildCurrentTodayContext(CFG, { currency: "EUR" }, timeline, BERLIN);
    expect(result.currentPoint).toBeNull();
    expect(result.currentWindow).toBe("");
  });
});

describe("price range scaling", () => {
  it("scales an existing minimum when the maximum is derived from timeline data", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    const attrs = {
      currency: "EUR",
      min_today: 0.1,
      data: [
        { start_time: "2026-01-15T10:00:00Z", price_per_kwh: 0.2 },
        { start_time: "2026-01-15T11:00:00Z", price_per_kwh: 0.3 },
      ],
    };
    const cfg = { ...CFG, unit_format: "minor" };
    expect(getDayPriceMetricText(cfg, attrs, "en", "today", "range", "today", false, "per_kwh", BERLIN)).toBe("10 - 30");
  });

  it("scales an existing maximum when the minimum is derived from timeline data", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
    const attrs = {
      currency: "EUR",
      max_today: 0.4,
      data: [
        { start_time: "2026-01-15T10:00:00Z", price_per_kwh: 0.2 },
        { start_time: "2026-01-15T11:00:00Z", price_per_kwh: 0.3 },
      ],
    };
    const cfg = { ...CFG, unit_format: "minor" };
    expect(getDayPriceMetricText(cfg, attrs, "en", "today", "range", "today", false, "per_kwh", BERLIN)).toBe("20 - 40");
  });
});
