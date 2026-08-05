import { normalizeRangeDay } from "./config";
import { mean, quantile, readAttrNumber, extractTimelineFromAttributes, filterToDay, safeNumber } from "./data";
import { formatDisplayValue } from "./format";
import { normalizePriceLevelTarget, priceLevelKey } from "./graph";
import { localize } from "./i18n";
import { addDaysInTimeZone, alignTimeToDayInTimeZone, formatHHMMInTimeZone, startOfDayInTimeZone } from "./time";
import { applyUnitFactor, formatUnitByMode, getDisplayUnit, getEffectiveCurrency, getUnitFactor } from "./units";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function resolveMetricDay(rangeDay, dayView) {
  const normalized = normalizeRangeDay(rangeDay);
  return normalized === "selected" ? normalizeDayView(dayView) : normalized;
}



export function getRangeDayLabel(day, lang, dayView = "today") {
  const normalized = resolveMetricDay(day, dayView);
  const key = normalized === "tomorrow"
    ? "label_tomorrow"
    : (normalized === "two_days" ? "label_two_days" : "label_today");
  return localize(key, lang);
}



function inferTimelineStepMinutes(points) {
  if (!Array.isArray(points) || points.length < 2) return null;
  let step = null;
  for (let i = 1; i < points.length; i++) {
    const diffMs = points[i].start - points[i - 1].start;
    const diff = Math.round(diffMs / 60000);
    if (!Number.isFinite(diff) || diff <= 0) return null;
    if (step === null) step = diff;
    else if (Math.abs(diff - step) > 1) return null;
  }
  return step === 15 || step === 60 ? step : null;
}

function inferTimelineIntervalMs(points, index) {
  const current = points[index];
  if (!current) return 15 * 60 * 1000;
  const previousDiff = index > 0
    ? current.start.getTime() - points[index - 1].start.getTime()
    : null;
  const nextDiff = points[index + 1]
    ? points[index + 1].start.getTime() - current.start.getTime()
    : null;
  if (previousDiff > 0 && nextDiff > 0) {
    return nextDiff > previousDiff * 1.5 ? previousDiff : nextDiff;
  }
  if (nextDiff > 0) return nextDiff;
  if (previousDiff > 0) return previousDiff;
  return 15 * 60 * 1000;
}

function isCompleteDayTimeline(points, offsetDays = 1, timeZone = "UTC", now = new Date()) {
  if (!Array.isArray(points) || !points.length) return false;
  const step = inferTimelineStepMinutes(points);
  if (!step) return false;
  const dayStart = addDaysInTimeZone(now, offsetDays, timeZone);
  const dayEnd = addDaysInTimeZone(now, offsetDays + 1, timeZone);
  const expected = Math.round((dayEnd.getTime() - dayStart.getTime()) / (step * 60000));
  if (expected <= 0 || points.length !== expected) return false;
  for (let i = 0; i < points.length; i++) {
    const expectedTs = dayStart.getTime() + (i * step * 60000);
    if (Math.abs(points[i].start.getTime() - expectedTs) > 1000) return false;
  }
  return true;
}



function hasTomorrowStatusAttr(attrs) {
  return !!attrs && Object.prototype.hasOwnProperty.call(attrs, "tomorrow_status");
}



function hasTomorrowData(attrs, timelineAll = null, timeZone = "UTC") {
  if (hasTomorrowStatusAttr(attrs)) {
    const status = String(attrs?.tomorrow_status || "").toLowerCase();
    return status === "ok" || status === "preview";
  }
  const sourceTimeline = Array.isArray(timelineAll) ? timelineAll : extractTimelineFromAttributes(attrs);
  const tomorrowPoints = filterToDay(sourceTimeline, new Date(), 1, timeZone);
  return isCompleteDayTimeline(tomorrowPoints, 1, timeZone);
}



function getMetricTimelinePoints(attrs, day, timeZone = "UTC") {
  const timelineAll = extractTimelineFromAttributes(attrs);
  if (day === "today") {
    return filterToDay(timelineAll, new Date(), 0, timeZone);
  }
  if (day === "tomorrow") {
    return filterToDay(timelineAll, new Date(), 1, timeZone);
  }
  const todayPoints = filterToDay(timelineAll, new Date(), 0, timeZone);
  const tomorrowPoints = filterToDay(timelineAll, new Date(), 1, timeZone);
  return [...todayPoints, ...tomorrowPoints];
}



export function getDayPriceMetricText(cfg, attrs, lang, rangeDay = "today", metric = "range", dayView = "today", includeUnit = true, unitDisplayMode = "per_kwh", timeZone = "UTC") {
  const day = resolveMetricDay(rangeDay, dayView);
  if ((day === "tomorrow" || day === "two_days") && !hasTomorrowData(attrs, null, timeZone)) {
    return localize("price_range_unavailable", lang);
  }

  const suffix = day === "today" ? "today" : (day === "tomorrow" ? "tomorrow" : "today_tomorrow");
  const factor = getUnitFactor(cfg, getEffectiveCurrency(cfg, attrs));
  const unit = formatUnitByMode(getDisplayUnit(cfg, attrs, lang), unitDisplayMode);
  const scaledPoints = () => applyUnitFactor(getMetricTimelinePoints(attrs, day, timeZone), factor).points;

  if (metric === "avg") {
    let avg = readAttrNumber(attrs, `avg_${suffix}`);
    if (avg === null) {
      const vals = scaledPoints().map((p) => p.price).filter((v) => Number.isFinite(v));
      avg = mean(vals);
      if (avg === null) return localize("price_range_unavailable", lang);
    } else {
      avg *= factor;
    }
    return `${formatDisplayValue(avg, cfg.decimals)}${includeUnit && unit ? ` ${unit}` : ""}`;
  }

  let min = readAttrNumber(attrs, `min_${suffix}`);
  let max = readAttrNumber(attrs, `max_${suffix}`);
  if (min !== null) min *= factor;
  if (max !== null) max *= factor;
  if (min === null || max === null) {
    const vals = scaledPoints().map((p) => p.price).filter((v) => Number.isFinite(v));
    if (!vals.length) return localize("price_range_unavailable", lang);
    if (min === null) min = Math.min(...vals);
    if (max === null) max = Math.max(...vals);
  }
  if (max < min) [min, max] = [max, min];
  return `${formatDisplayValue(min, cfg.decimals)} - ${formatDisplayValue(max, cfg.decimals)}${includeUnit && unit ? ` ${unit}` : ""}`;
}



export function getThresholdsForDay(cfg, attrs, points, factor, dayKey) {
  const suffix = dayKey === "today_tomorrow" ? "_today_tomorrow" : (dayKey === "tomorrow" ? "_tomorrow" : "_today");
  let p20 = readAttrNumber(attrs, `p20${suffix}`);
  let avg = readAttrNumber(attrs, `avg${suffix}`);
  let p70 = readAttrNumber(attrs, `p70${suffix}`);

  if (factor !== 1) {
    if (p20 !== null) p20 *= factor;
    if (avg !== null) avg *= factor;
    if (p70 !== null) p70 *= factor;
  }

  if (p20 === null || avg === null || p70 === null) {
    const vals = (points || [])
      .map(p => p.price)
      .filter(v => typeof v === "number" && Number.isFinite(v))
      .slice();

    vals.sort((a, b) => a - b);

    const p20c = quantile(vals, 0.2);
    const avgc = mean(vals);
    const p70c = quantile(vals, 0.7);

    if (p20 === null) p20 = p20c;
    if (avg === null) avg = avgc;
    if (p70 === null) p70 = p70c;
  }

  if (p20 === null && avg === null && p70 === null) {
    return { p20: 0, avg: 0, p70: 0 };
  }

  const fixedP20 = getFixedThresholdValue(cfg, "use_fixed_p20", "fixed_p20_value", factor);
  const fixedAvg = getFixedThresholdValue(cfg, "use_fixed_avg", "fixed_avg_value", factor);
  const fixedP70 = getFixedThresholdValue(cfg, "use_fixed_expensive", "fixed_expensive_value", factor);
  if (fixedP20 !== null) p20 = fixedP20;
  if (fixedAvg !== null) avg = fixedAvg;
  if (fixedP70 !== null) p70 = fixedP70;

  const a = Math.min(p20 ?? avg ?? p70, avg ?? p20 ?? p70, p70 ?? avg ?? p20);
  const c = Math.max(p20 ?? avg ?? p70, avg ?? p20 ?? p70, p70 ?? avg ?? p20);
  const b = clamp(avg ?? a, a, c);

  return { p20: a, avg: b, p70: c, fixed: null, detailed: !!cfg.detailed_colors };
}

export function getNextPriceLevelTimeText(cfg, attrs, timelineAll, requestedLevel, lang, timeZone = "UTC", now = new Date()) {
  const detailed = !!cfg?.detailed_colors;
  const targetLevel = normalizePriceLevelTarget(requestedLevel, detailed);
  const factor = getUnitFactor(cfg, getEffectiveCurrency(cfg, attrs));

  for (const offsetDays of [0, 1]) {
    const dayKey = offsetDays === 0 ? "today" : "tomorrow";
    const rawPoints = filterToDay(timelineAll, now, offsetDays, timeZone);
    const points = applyUnitFactor(rawPoints, factor).points;
    if (!points.length) continue;
    const thresholds = getThresholdsForDay(cfg, attrs, points, factor, dayKey);

    for (let index = 0; index < points.length; index++) {
      const point = points[index];
      if (priceLevelKey(point.price, thresholds, detailed) !== targetLevel) continue;
      const startMs = point.start.getTime();
      if (startMs > now.getTime()) {
        const time = formatHHMMInTimeZone(point.start, timeZone);
        return offsetDays === 0 ? time : localize("next_price_level_tomorrow", lang, { time });
      }
      const endMs = startMs + inferTimelineIntervalMs(points, index);
      if (now.getTime() >= startMs && now.getTime() < endMs) return localize("label_now", lang);
    }
  }

  return "—";
}



function autoScaleToCtIfNeeded(cfg, attrs, points) {
  const currency = getEffectiveCurrency(cfg, attrs);
  const factor = getUnitFactor(cfg, currency);
  return applyUnitFactor(points, factor);
}

function getFixedThresholdValue(cfg, enabledKey, valueKey, factor) {
  if (!cfg?.detailed_colors || !cfg?.[enabledKey]) return null;
  const fixed = safeNumber(cfg?.[valueKey]);
  return fixed === null ? null : fixed * (factor || 1);
}



export function normalizeDayView(dayView) {
  return dayView === "tomorrow" ? "tomorrow" : (dayView === "two_days" ? "two_days" : "today");
}



export function buildDayContext(cfg, st, dayViewInput, timeZone = "UTC") {
  const attrs = st?.attributes || {};
  const timelineAll = extractTimelineFromAttributes(attrs);
  const dayView = normalizeDayView(dayViewInput);
  const currency = getEffectiveCurrency(cfg, attrs);
  const tomorrowOk = hasTomorrowData(attrs, timelineAll, timeZone);
  const twoDayMode = cfg.two_day_mode || "span";

  let dayPoints = [];
  let overlayPoints = null;
  let overlayShifted = null;
  let thresholds = null;
  let scaled = { factor: 1, points: [] };
  const now = new Date();
  const todayStart = startOfDayInTimeZone(now, timeZone);
  const tomorrowStart = addDaysInTimeZone(now, 1, timeZone);
  const afterTomorrowStart = addDaysInTimeZone(now, 2, timeZone);
  const hoursBetween = (start, end) => (end.getTime() - start.getTime()) / (3600 * 1000);
  const firstDayHours = hoursBetween(todayStart, tomorrowStart);
  let dayStart = todayStart;
  let dayHours = firstDayHours;
  let debugPointsCount = 0;

  if (dayView === "tomorrow") {
    if (tomorrowOk) {
      const dayPointsRaw = filterToDay(timelineAll, now, 1, timeZone);
      scaled = autoScaleToCtIfNeeded(cfg, attrs, dayPointsRaw);
      dayPoints = scaled.points;
      thresholds = getThresholdsForDay(cfg, attrs, dayPoints, scaled.factor, "tomorrow");
      debugPointsCount = dayPoints.length;
      dayStart = tomorrowStart;
      dayHours = hoursBetween(tomorrowStart, afterTomorrowStart);
    }
  } else if (dayView === "two_days") {
    if (tomorrowOk) {
      const todayRaw = filterToDay(timelineAll, now, 0, timeZone);
      const tomorrowRaw = filterToDay(timelineAll, now, 1, timeZone);
      scaled = autoScaleToCtIfNeeded(cfg, attrs, todayRaw);
      const factor = scaled.factor;
      const todayScaled = scaled.points;
      const tomorrowScaled = applyUnitFactor(tomorrowRaw, factor).points;
      if (tomorrowScaled.length) {
        if (twoDayMode === "span") {
          dayPoints = [...todayScaled, ...tomorrowScaled];
          thresholds = getThresholdsForDay(cfg, attrs, dayPoints, factor, "today_tomorrow");
          dayHours = hoursBetween(todayStart, afterTomorrowStart);
          debugPointsCount = dayPoints.length;
        } else {
          dayPoints = todayScaled;
          overlayPoints = tomorrowScaled;
          overlayShifted = tomorrowScaled.map(p => ({
            ...p,
            start: alignTimeToDayInTimeZone(p.start, todayStart, timeZone),
          }));
          thresholds = getThresholdsForDay(cfg, attrs, dayPoints, factor, "today");
          dayHours = hoursBetween(todayStart, tomorrowStart);
          debugPointsCount = dayPoints.length;
        }
      }
      dayStart = todayStart;
    }
  } else {
    const dayPointsRaw = filterToDay(timelineAll, now, 0, timeZone);
    scaled = autoScaleToCtIfNeeded(cfg, attrs, dayPointsRaw);
    dayPoints = scaled.points;
    thresholds = getThresholdsForDay(cfg, attrs, dayPoints, scaled.factor, "today");
    debugPointsCount = dayPoints.length;
    dayStart = todayStart;
  }

  const showPending = (dayView === "tomorrow" || dayView === "two_days") && !tomorrowOk;
  if (showPending && !thresholds) thresholds = { p20: 0, avg: 0, p70: 0, detailed: !!cfg.detailed_colors };

  return {
    attrs,
    timelineAll,
    dayView,
    currency,
    tomorrowOk,
    twoDayMode,
    dayPoints,
    overlayPoints,
    overlayShifted,
    thresholds,
    scaled,
    dayStart,
    dayHours,
    firstDayHours,
    debugPointsCount,
    showPending,
  };
}



export function buildCurrentTodayContext(cfg, attrs, timelineAll, timeZone = "UTC") {
  const nowPointsRaw = filterToDay(timelineAll, new Date(), 0, timeZone);
  const nowScaled = autoScaleToCtIfNeeded(cfg, attrs, nowPointsRaw);
  const nowPoints = nowScaled.points;
  const thresholds = nowPoints.length
    ? getThresholdsForDay(cfg, attrs, nowPoints, nowScaled.factor, "today")
    : null;
  let currentPoint = null;
  let currentWindow = "";
  if (nowPoints.length) {
    const now = new Date();
    let currentIndex = -1;
    for (let i = 0; i < nowPoints.length; i++) {
      const p = nowPoints[i];
      if (p.start <= now) currentIndex = i;
      else break;
    }
    if (currentIndex >= 0) {
      const candidate = nowPoints[currentIndex];
      const inferredIntervalMs = inferTimelineIntervalMs(nowPoints, currentIndex);
      const nextPoint = nowPoints[currentIndex + 1];
      const inferredEnd = candidate.start.getTime() + inferredIntervalMs;
      const endMs = nextPoint?.start
        ? Math.min(nextPoint.start.getTime(), inferredEnd)
        : inferredEnd;
      if (now.getTime() < endMs) {
        currentPoint = candidate;
        const end = new Date(endMs);
        const fmt = (d) => formatHHMMInTimeZone(d, timeZone);
        currentWindow = `${fmt(currentPoint.start)}-${fmt(end)}`;
      }
    }
  }
  return { currentPoint, thresholds, currentWindow };
}
