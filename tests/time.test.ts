import { describe, expect, it } from "vitest";
import {
  addDaysInTimeZone,
  alignPointsToDayByClock,
  buildHourTicks,
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

function hourlyPoints(start: Date, hours: number) {
  return Array.from({ length: hours }, (_, i) => ({ start: new Date(start.getTime() + i * 3_600_000), price: i }));
}

describe("Home Assistant time zone handling", () => {
  it("uses a 23-hour spring DST day", () => {
    expect(dayLengthHours(new Date("2026-03-29T12:00:00Z"))).toBe(23);
  });

  it("uses a 25-hour autumn DST day", () => {
    expect(dayLengthHours(new Date("2026-10-25T12:00:00Z"))).toBe(25);
  });

  it("aligns overlay points by local wall-clock time", () => {
    const targetDay = startOfDayInTimeZone(new Date("2026-06-10T12:00:00Z"), BERLIN);
    const source = startOfDayInTimeZone(new Date("2026-06-11T12:00:00Z"), BERLIN);
    const points = hourlyPoints(source, 24);
    const aligned = alignPointsToDayByClock(points, targetDay, BERLIN);
    expect(aligned.map((p) => formatHHMMInTimeZone(p.start, BERLIN))).toEqual(points.map((p) => formatHHMMInTimeZone(p.start, BERLIN)));
    expect(aligned[0].start.getTime()).toBe(targetDay.getTime());
  });

  it("stretches a 23-hour overlay day over the missing hour", () => {
    const targetDay = startOfDayInTimeZone(new Date("2026-03-28T12:00:00Z"), BERLIN);
    const source = startOfDayInTimeZone(new Date("2026-03-29T12:00:00Z"), BERLIN);
    const aligned = alignPointsToDayByClock(hourlyPoints(source, 23), targetDay, BERLIN);
    expect(aligned).toHaveLength(23);
    expect(aligned.slice(0, 4).map((p) => formatHHMMInTimeZone(p.start, BERLIN))).toEqual(["00:00", "01:00", "03:00", "04:00"]);
  });

  it("squeezes a 25-hour overlay day into the repeated hour", () => {
    const targetDay = startOfDayInTimeZone(new Date("2026-10-24T12:00:00Z"), BERLIN);
    const source = startOfDayInTimeZone(new Date("2026-10-25T12:00:00Z"), BERLIN);
    const aligned = alignPointsToDayByClock(hourlyPoints(source, 25), targetDay, BERLIN);
    expect(aligned).toHaveLength(25);
    expect(aligned.slice(0, 5).map((p) => formatHHMMInTimeZone(p.start, BERLIN))).toEqual(["00:00", "01:00", "02:00", "02:30", "03:00"]);
    expect(aligned.at(-1)!.start < addDaysInTimeZone(targetDay, 1, BERLIN)).toBe(true);
  });

  it("labels DST day axes by local clock hour without duplicates", () => {
    const autumn = startOfDayInTimeZone(new Date("2026-10-25T12:00:00Z"), BERLIN);
    const labels = buildHourTicks(autumn, 25, BERLIN).filter((t) => !t.repeated && t.hour % 2 === 0).map((t) => t.hour);
    expect(labels.slice(0, 4)).toEqual([0, 2, 4, 6]);
    const spring = startOfDayInTimeZone(new Date("2026-03-29T12:00:00Z"), BERLIN);
    expect(buildHourTicks(spring, 23, BERLIN).slice(0, 4).map((t) => t.hour)).toEqual([0, 1, 3, 4]);
  });

  it("aligns the clock update just after the next minute boundary", () => {
    expect(millisecondsUntilNextMinute(Date.UTC(2026, 0, 1, 12, 0, 30, 500))).toBe(29_525);
  });
});
