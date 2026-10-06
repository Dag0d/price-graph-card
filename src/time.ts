export function startOfLocalDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

export function formatHour2(h: number) {
  return String(h).padStart(2, "0");
}

const TIME_PARTS_FORMATTER_CACHE = new Map<string, Intl.DateTimeFormat>();

function getTimePartsFormatter(timeZone: string) {
  const tz = timeZone || "UTC";
  let fmt = TIME_PARTS_FORMATTER_CACHE.get(tz);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      hourCycle: "h23",
    });
    TIME_PARTS_FORMATTER_CACHE.set(tz, fmt);
  }
  return fmt;
}

function getDateTimePartsInTimeZone(date: Date, timeZone: string) {
  const parts = getTimePartsFormatter(timeZone).formatToParts(date);
  const out: Record<string, number> = {};
  for (const p of parts) {
    if (p.type === "year") out.year = Number(p.value);
    else if (p.type === "month") out.month = Number(p.value);
    else if (p.type === "day") out.day = Number(p.value);
    else if (p.type === "hour") out.hour = Number(p.value);
    else if (p.type === "minute") out.minute = Number(p.value);
    else if (p.type === "second") out.second = Number(p.value);
  }
  return out;
}

function zonedDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  ms: number,
  timeZone: string,
) {
  const desired = Date.UTC(year, month - 1, day, hour, minute, second, 0);
  let ts = desired;
  for (let i = 0; i < 4; i++) {
    const p = getDateTimePartsInTimeZone(new Date(ts), timeZone);
    const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second, 0);
    const diff = desired - asUTC;
    if (!diff) break;
    ts += diff;
  }
  return new Date(ts + (ms || 0));
}

export function addDaysInTimeZone(baseDate: Date, days: number, timeZone: string) {
  const p = getDateTimePartsInTimeZone(baseDate, timeZone);
  return zonedDateTimeToUtc(p.year, p.month, p.day + days, 0, 0, 0, 0, timeZone);
}

export function startOfDayInTimeZone(date: Date, timeZone: string) {
  return addDaysInTimeZone(date, 0, timeZone);
}

// Real timestamp of each full local clock hour of a day (0..24). Hours that do not exist (DST start)
// are skipped, repeated hours (DST end) use their first occurrence.
function getClockHourAnchors(dayStart: Date, timeZone: string) {
  const d = getDateTimePartsInTimeZone(dayStart, timeZone);
  const anchors = new Map<number, number>();
  for (let h = 0; h < 24; h++) {
    let t = zonedDateTimeToUtc(d.year, d.month, d.day, h, 0, 0, 0, timeZone);
    const p = getDateTimePartsInTimeZone(t, timeZone);
    if (p.day !== d.day || p.hour !== h || p.minute !== 0) continue;
    const earlier = new Date(t.getTime() - 3_600_000);
    const pe = getDateTimePartsInTimeZone(earlier, timeZone);
    if (pe.day === d.day && pe.hour === h && pe.minute === 0) t = earlier;
    anchors.set(h, t.getTime());
  }
  anchors.set(24, addDaysInTimeZone(dayStart, 1, timeZone).getTime());
  return anchors;
}

// Maps points of one day onto the target day by local clock time. Between full hours that exist on
// both days the mapping is linear, so around a DST switch a 23h day is stretched and a 25h day squeezed.
export function alignPointsToDayByClock<T extends { start: Date }>(points: T[], targetDayStart: Date, timeZone: string): T[] {
  if (!points.length) return [];
  const source = getClockHourAnchors(startOfDayInTimeZone(points[0].start, timeZone), timeZone);
  const target = getClockHourAnchors(targetDayStart, timeZone);
  const pairs: Array<[number, number]> = [];
  for (let h = 0; h <= 24; h++) {
    if (source.has(h) && target.has(h)) pairs.push([source.get(h)!, target.get(h)!]);
  }
  let i = 0;
  return points.map((p) => {
    const t = p.start.getTime();
    while (i < pairs.length - 2 && t >= pairs[i + 1][0]) i++;
    const [s0, d0] = pairs[i];
    const [s1, d1] = pairs[i + 1];
    return { ...p, start: new Date(d0 + ((t - s0) * (d1 - d0)) / (s1 - s0)) };
  });
}

// Local clock hour at each elapsed hour of the axis; a clock hour seen right before (DST end) is flagged.
export function buildHourTicks(dayStart: Date, dayHours: number, timeZone: string) {
  const ticks: Array<{ index: number; hour: number; repeated: boolean }> = [];
  let previousHour: number | null = null;
  for (let index = 0; index <= dayHours; index++) {
    const hour = getDateTimePartsInTimeZone(new Date(dayStart.getTime() + index * 3_600_000), timeZone).hour;
    ticks.push({ index, hour, repeated: hour === previousHour });
    previousHour = hour;
  }
  return ticks;
}

export function formatHHMMInTimeZone(date: Date, timeZone: string) {
  const p = getDateTimePartsInTimeZone(date, timeZone);
  return `${formatHour2(p.hour)}:${formatHour2(p.minute)}`;
}

export function millisecondsUntilNextMinute(nowMs = Date.now()) {
  return 60_000 - (nowMs % 60_000) + 25;
}

export function getHaTimeZone(hass: any) {
  return hass?.config?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}
