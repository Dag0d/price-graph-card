import { describe, expect, it } from "vitest";
import {
  addDaysInTimeZone,
  alignTimeToDayInTimeZone,
  formatHHMMInTimeZone,
  millisecondsUntilNextMinute,
  startOfDayInTimeZone,
} from "../src/time";

const BERLIN = "Europe/Berlin";

function dayLengthHours(date: Date) {
  const start = startOfDayInTimeZone(date, BERLIN);
  const end = addDaysInTimeZone(date, 1, BERLIN);
  return (end.getTime() - start.getTime()) / 3_600_000;
}

describe("Home Assistant time zone handling", () => {
  it("uses a 23-hour spring DST day", () => {
    expect(dayLengthHours(new Date("2026-03-29T12:00:00Z"))).toBe(23);
  });

  it("uses a 25-hour autumn DST day", () => {
    expect(dayLengthHours(new Date("2026-10-25T12:00:00Z"))).toBe(25);
  });

  it("aligns overlay points by local wall-clock time", () => {
    const targetDay = startOfDayInTimeZone(new Date("2026-03-28T12:00:00Z"), BERLIN);
    const source = new Date("2026-03-29T01:00:00Z");
    const aligned = alignTimeToDayInTimeZone(source, targetDay, BERLIN);
    expect(formatHHMMInTimeZone(source, BERLIN)).toBe("03:00");
    expect(formatHHMMInTimeZone(aligned, BERLIN)).toBe("03:00");
  });

  it("aligns the clock update just after the next minute boundary", () => {
    expect(millisecondsUntilNextMinute(Date.UTC(2026, 0, 1, 12, 0, 30, 500))).toBe(29_525);
  });
});
