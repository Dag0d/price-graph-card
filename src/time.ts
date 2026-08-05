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

export function alignTimeToDayInTimeZone(sourceDate: Date, targetDay: Date, timeZone: string) {
  const source = getDateTimePartsInTimeZone(sourceDate, timeZone);
  const target = getDateTimePartsInTimeZone(targetDay, timeZone);
  return zonedDateTimeToUtc(
    target.year,
    target.month,
    target.day,
    source.hour,
    source.minute,
    source.second,
    sourceDate.getMilliseconds(),
    timeZone,
  );
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
