import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ensureLanguage } from "../src/i18n";
import { buildCurrentTodayContext, getDayPriceMetricText, getNextPriceLevelTimeText } from "../src/pricing";

const BERLIN = "Europe/Berlin";
const CFG = {
  unit_format: "currency",
  decimals: 2,
  detailed_colors: false,
};

beforeAll(async () => {
  await ensureLanguage("en");
});

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

describe("next price level", () => {
  it("uses the simple graph levels and reports the current matching interval as now", () => {
    const now = new Date("2026-01-15T12:05:00Z");
    const timeline = [
      { start: new Date("2026-01-15T12:00:00Z"), price: 0.2 },
      { start: new Date("2026-01-15T13:00:00Z"), price: 0.4 },
    ];
    const attrs = { currency: "EUR", avg_today: 0.3 };
    expect(getNextPriceLevelTimeText(CFG, attrs, timeline, "below_avg", "en", "UTC", now)).toBe("Now");
    expect(getNextPriceLevelTimeText(CFG, attrs, timeline, "above_avg", "en", "UTC", now)).toBe("13:00");
  });

  it("uses the graph's fixed detailed thresholds", () => {
    const now = new Date("2026-01-15T12:05:00Z");
    const timeline = [
      { start: new Date("2026-01-15T12:00:00Z"), price: 0.1 },
      { start: new Date("2026-01-15T13:00:00Z"), price: 0.25 },
      { start: new Date("2026-01-15T14:00:00Z"), price: 0.45 },
      { start: new Date("2026-01-15T15:00:00Z"), price: 0.65 },
    ];
    const cfg = {
      ...CFG,
      detailed_colors: true,
      use_fixed_p20: true,
      fixed_p20_value: 0.2,
      use_fixed_avg: true,
      fixed_avg_value: 0.4,
      use_fixed_expensive: true,
      fixed_expensive_value: 0.6,
    };
    expect(getNextPriceLevelTimeText(cfg, { currency: "EUR" }, timeline, "very_expensive", "en", "UTC", now)).toBe("15:00");
  });
});
