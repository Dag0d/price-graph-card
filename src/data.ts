import { addDaysInTimeZone } from "./time";

export function safeNumber(v: any) {
  if (v === null || v === undefined) return null;
  if (typeof v === "string" && !v.trim()) return null;
  if (typeof v === "boolean") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function readAttrNumber(attrs: any, key: string) {
  return safeNumber(attrs?.[key]);
}

export function mean(arr: number[]) {
  if (!arr.length) return null;
  const s = arr.reduce((a, b) => a + b, 0);
  return s / arr.length;
}

export function quantile(sorted: number[], q: number) {
  if (!sorted.length) return null;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] === undefined) return sorted[base];
  return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
}

export function extractTimelineFromAttributes(attrs: any) {
  if (!attrs || typeof attrs !== "object") return [];
  const arr = attrs.data;
  if (!Array.isArray(arr) || !arr.length) return [];
  const out = [];
  for (const it of arr) {
    if (!it || typeof it !== "object") continue;
    const dt = new Date(it.start_time);
    const price = safeNumber(it.price_per_kwh);
    if (!Number.isFinite(dt.getTime()) || price === null) continue;
    out.push({ start: dt, price });
  }
  out.sort((a, b) => a.start.getTime() - b.start.getTime());
  return out;
}

export function filterToDay(timeline: any[], now = new Date(), offsetDays = 0, timeZone = "UTC") {
  const dayStart = addDaysInTimeZone(now, offsetDays, timeZone);
  const dayEnd = addDaysInTimeZone(now, offsetDays + 1, timeZone);
  return timeline.filter((p) => p.start >= dayStart && p.start < dayEnd);
}
