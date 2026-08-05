import { DETAILED_PRICE_LEVELS, SIMPLE_HIGH_COLOR, SIMPLE_LOW_COLOR, SIMPLE_PRICE_LEVELS, TICK_STEPS } from "./const";
import { safeNumber } from "./data";
import { localize } from "./i18n";
import { startOfLocalDay } from "./time";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function normalizeColor(c, fallback = "#ffffff") {
  if (typeof c === "string" && c.trim()) return c.trim();

  if (Array.isArray(c) && c.length >= 3) {
    const r = safeNumber(c[0]);
    const g = safeNumber(c[1]);
    const b = safeNumber(c[2]);
    if (r !== null && g !== null && b !== null) {
      return `rgb(${clamp(Math.round(r), 0, 255)}, ${clamp(Math.round(g), 0, 255)}, ${clamp(Math.round(b), 0, 255)})`;
    }
  }

  if (c && typeof c === "object") {
    const r = safeNumber(c.r ?? c.red);
    const g = safeNumber(c.g ?? c.green);
    const b = safeNumber(c.b ?? c.blue);
    if (r !== null && g !== null && b !== null) {
      return `rgb(${clamp(Math.round(r), 0, 255)}, ${clamp(Math.round(g), 0, 255)}, ${clamp(Math.round(b), 0, 255)})`;
    }
  }
  return fallback;
}



export function normalizeHexColor(value, fallback = "#ffffff") {
  if (!value) return fallback;
  let v = String(value).trim();
  if (!v.startsWith("#")) v = `#${v}`;
  if (/^#([0-9a-f]{3})$/i.test(v)) {
    const m = v.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    if (m) return `#${m[1]}${m[1]}${m[2]}${m[2]}${m[3]}${m[3]}`.toLowerCase();
  }
  if (/^#([0-9a-f]{6})$/i.test(v)) return v.toLowerCase();
  return fallback;
}



function parseRgbChannels(color) {
  if (typeof color !== "string") return null;
  const m = color.trim().match(/^rgba?\(([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (!m) return null;
  return [clamp(Number(m[1]), 0, 255), clamp(Number(m[2]), 0, 255), clamp(Number(m[3]), 0, 255)];
}



function resolveCssColor(el, color) {
  if (!el || !color) return "";
  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.color = color;
  el.appendChild(probe);
  const resolved = getComputedStyle(probe).color || "";
  probe.remove();
  return resolved;
}



export function getTimelinePastOverlayColor(el) {
  if (!el) return "rgba(38, 14, 25, 0.6)";
  const cs = getComputedStyle(el);
  let base = cs.getPropertyValue("--card-background-color")?.trim() || "";
  if (!base) base = cs.backgroundColor || "";
  if (!base || base === "transparent" || base === "rgba(0, 0, 0, 0)") {
    base = getComputedStyle(document.documentElement).getPropertyValue("--card-background-color")?.trim() || "";
  }
  const resolved = resolveCssColor(el, base || "#ffffff");
  const rgb = parseRgbChannels(resolved);
  if (!rgb) return "rgba(38, 14, 25, 0.6)";
  const [r, g, b] = rgb.map((v) => v / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.5 ? "rgba(38, 14, 25, 0.6)" : "rgba(235, 238, 241, 0.7)";
}



export function normalizePriceLevelTarget(value, detailed = false) {
  const raw = String(value || "");
  if (detailed) {
    if (DETAILED_PRICE_LEVELS.includes(raw)) return raw;
    return raw === "above_avg" ? "expensive" : "cheap";
  }
  if (SIMPLE_PRICE_LEVELS.includes(raw)) return raw;
  return raw === "expensive" || raw === "very_expensive" ? "above_avg" : "below_avg";
}

export function priceLevelKey(price, thr, detailed = !!thr?.detailed) {
  if (!thr || !Number.isFinite(price) || !Number.isFinite(thr.avg)) return "";
  if (!detailed) return price <= thr.avg ? "below_avg" : "above_avg";
  if (thr?.fixed !== null && thr?.fixed !== undefined && price >= thr.fixed) return "very_expensive";
  if (price <= thr.p20) return "cheap";
  if (price <= thr.avg) return "normal";
  if (price <= thr.p70) return "expensive";
  return "very_expensive";
}

export function zoneColor(cfg, price, thr) {
  const level = priceLevelKey(price, thr, !!cfg?.detailed_colors);
  if (!cfg?.detailed_colors) return level === "below_avg" ? SIMPLE_LOW_COLOR : SIMPLE_HIGH_COLOR;
  const cheap = normalizeColor(cfg.color_cheap, "#CDDC39");
  const norm = normalizeColor(cfg.color_normal, "#FF9800");
  const exp = normalizeColor(cfg.color_expensive, "#F44336");
  const veryExp = normalizeColor(cfg.color_very_expensive, "#B71C1C");
  return level === "cheap" ? cheap : (level === "normal" ? norm : (level === "expensive" ? exp : veryExp));
}



export function zoneLabel(price, thr, lang) {
  const level = priceLevelKey(price, thr);
  return level ? localize(`region_${level}`, lang) : "";
}



function getZoneBreaks(cfg, thr) {
  if (!thr) return [];
  if (!thr.detailed) return [thr.avg].filter((v) => Number.isFinite(v));
  const out = [thr.p20, thr.avg, thr.p70];
  if (thr.fixed !== null && thr.fixed !== undefined) out.push(thr.fixed);
  return out.filter((v) => Number.isFinite(v));
}



function niceTickStep(range) {
  return (TICK_STEPS.find(([max]) => range <= max) ?? [null, 20])[1];
}



export function computeYScaleCt(points, unitFormat) {
  if (!points.length) {
    return { yMin: 0, yMax: 10, ticks: [0,2,4,6,8,10] };
  }

  let min = Infinity;
  let max = -Infinity;
  for (const p of points) {
    min = Math.min(min, p.price);
    max = Math.max(max, p.price);
  }

  let range = max - min;
  if (range <= 0) range = unitFormat === "currency" ? 0.04 : 4;

  const step = niceTickStep(range);
  const pad = clamp(range * 0.08, step * 0.5, step * 1.0);

  let yMin = min - pad;
  let yMax = max + pad;

  if (yMax <= yMin) yMax = yMin + step * 4;

  yMin = Math.floor(yMin / step) * step;
  yMax = Math.ceil(yMax / step) * step;

  const ticks = [];
  for (let v = yMin; v <= yMax + 1e-9; v += step) ticks.push(v);

  return { yMin, yMax, ticks };
}



export function buildStepSegments(cfg, points, dims, thr, dayStart, dayHours = 24, colorFn = null) {
  const { left, top, innerW, innerH, yMin, yMax } = dims;
  const lineWidth = 2;

  const baseStart = dayStart || startOfLocalDay(new Date());
  const dayEnd = new Date(baseStart.getTime() + dayHours * 3600 * 1000);
  const xFor = makeXFor(baseStart, dayHours, left, innerW);
  const yFor = makeYFor(top, innerH, yMin, yMax);

  const pts = [...points].sort((a, b) => a.start - b.start);
  const lines = [];

  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    const next = pts[i + 1] || { start: dayEnd, price: cur.price };

    const x1 = xFor(cur.start);
    const x2 = xFor(next.start);
    const y = yFor(cur.price);
    const c = colorFn ? colorFn(cur.price) : zoneColor(cfg, cur.price, thr);

    lines.push({ x1, y1: y, x2, y2: y, stroke: c, width: lineWidth });

    if (i < pts.length - 1) {
      const y2 = yFor(next.price);
      const v1 = cur.price;
      const v2 = next.price;

      if (v1 === v2) {
        lines.push({ x1: x2, y1: y, x2, y2, stroke: c, width: lineWidth });
      } else {
        const low = Math.min(v1, v2);
        const high = Math.max(v1, v2);
        const breaks = getZoneBreaks(cfg, thr)
          .filter(v => v > low && v < high)
          .sort((a, b) => a - b);

        const values = v1 < v2
          ? [v1, ...breaks, v2]
          : [v1, ...breaks.reverse(), v2];

        for (let k = 0; k < values.length - 1; k++) {
          const a = values[k];
          const b = values[k + 1];
          const mid = (a + b) / 2;
          const color = colorFn ? colorFn(mid) : zoneColor(cfg, mid, thr);
          lines.push({
            x1: x2,
            y1: yFor(a),
            x2,
            y2: yFor(b),
            stroke: color,
            width: lineWidth,
          });
        }
      }
    }
  }

  return lines;
}



export function makeXFor(dayStart, dayHours, left, innerW) {
  const dayEnd = new Date(dayStart.getTime() + dayHours * 3600 * 1000);
  return (dt) => {
    const t = clamp(dt.getTime(), dayStart.getTime(), dayEnd.getTime());
    return left + ((t - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime())) * innerW;
  };
}



export function makeYFor(top, innerH, yMin, yMax) {
  return (v) => top + (1 - clamp((v - yMin) / (yMax - yMin || 1), 0, 1)) * innerH;
}



export function appendSvgLineSegments(svg, svgNS, segments) {
  for (const s of segments) {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("stroke-linecap", s.cap || "square");
    line.setAttribute("stroke-linejoin", s.join || "miter");
    line.setAttribute("x1", s.x1);
    line.setAttribute("y1", s.y1);
    line.setAttribute("x2", s.x2);
    line.setAttribute("y2", s.y2);
    line.setAttribute("stroke", s.stroke);
    line.setAttribute("stroke-width", s.width);
    svg.appendChild(line);
  }
}
