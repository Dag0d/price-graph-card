import { KNOWN_CURRENCY_SET } from "./const";
import { safeNumber } from "./data";
import { localize } from "./i18n";

export function formatUnitByMode(unit: any, mode: any) {
  const raw = String(unit || "").trim();
  if (!raw) return "";
  if (mode !== "value_only") return raw;
  return raw.replace(/\/\s*kwh$/i, "").trim();
}

function escapeRegExp(value: any) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCurrencySymbols(code: any) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(normalized)) return [];
  const out = new Set<string>();
  const currencyDisplayModes: Array<Intl.NumberFormatOptions["currencyDisplay"]> = ["symbol", "narrowSymbol"];
  for (const currencyDisplay of currencyDisplayModes) {
    try {
      const parts = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: normalized,
        currencyDisplay,
      }).formatToParts(1);
      const currencyPart = parts.find((p) => p.type === "currency")?.value;
      if (currencyPart && currencyPart !== normalized) out.add(currencyPart.trim());
    } catch (_err) {
    }
  }
  return [...out];
}

export function buildEntityUnitTokens(st: any, unit: any) {
  const fullUnit = String(st?.attributes?.unit_of_measurement || "").trim();
  const attrCurrency = String(st?.attributes?.currency || "").trim();
  const base = [fullUnit, unit, attrCurrency].filter(Boolean);
  const tokens = new Set(base);
  for (const token of base) {
    for (const symbol of getCurrencySymbols(token)) tokens.add(symbol);
  }
  return [...tokens].sort((a, b) => b.length - a.length);
}

export function stripEntityUnitTokens(value: any, tokens: any[]) {
  let out = String(value ?? "").replace(/\u00A0/g, " ").trim();
  for (const token of tokens) {
    if (!token) continue;
    const esc = escapeRegExp(token);
    out = out.replace(new RegExp(`^\\s*${esc}\\s*`, "i"), "").trim();
    out = out.replace(new RegExp(`\\s*${esc}\\s*$`, "i"), "").trim();
  }
  return out;
}

export function splitEntityValueAndUnit(value: any, tokens: any[]) {
  const rendered = String(value ?? "").replace(/\u00A0/g, " ").trim();
  for (const token of tokens) {
    if (!token) continue;
    const esc = escapeRegExp(token);
    const endMatch = rendered.match(new RegExp(`^(.*?)\\s*(${esc})\\s*$`, "i"));
    if (endMatch?.[1]?.trim()) {
      return { value: endMatch[1].trim(), unit: endMatch[2].trim() };
    }
    const startMatch = rendered.match(new RegExp(`^(${esc})\\s*(.*?)$`, "i"));
    if (startMatch?.[2]?.trim()) {
      return { value: startMatch[2].trim(), unit: startMatch[1].trim() };
    }
  }
  return { value: rendered, unit: "" };
}

function getCurrencyCodeFromUnit(unit: any) {
  const compact = String(unit || "").replace(/\s+/g, "");
  if (!compact) return "";
  const codeMatch = compact.match(/^([A-Z]{3})\/kWh$/i);
  if (codeMatch) {
    const code = codeMatch[1].toUpperCase();
    if (KNOWN_CURRENCY_SET.has(code)) return code;
  }
  const normalized = compact.toLowerCase();
  const symbolMap = [
    ["€/kwh", "EUR"],
    ["£/kwh", "GBP"],
    ["chf/kwh", "CHF"],
    ["zł/kwh", "PLN"],
    ["kč/kwh", "CZK"],
    ["ft/kwh", "HUF"],
    ["lei/kwh", "RON"],
  ];
  const match = symbolMap.find(([token]) => normalized === token);
  return match ? match[1] : "";
}

export function getCurrencyCode(attrs: any) {
  const cur = (attrs?.currency && String(attrs.currency).trim()) || "";
  if (cur) return cur.toUpperCase();
  return getCurrencyCodeFromUnit(attrs?.unit_of_measurement);
}

export function isKnownCurrency(code: any) {
  return KNOWN_CURRENCY_SET.has(code);
}

export function getEffectiveCurrency(cfg: any, attrs: any) {
  if (cfg.currency_override && cfg.currency_override !== "auto") {
    if (cfg.currency_override === "custom") {
      return String(cfg.currency_custom || "").trim().toUpperCase();
    }
    return String(cfg.currency_override).trim().toUpperCase();
  }
  return getCurrencyCode(attrs);
}

export function getUnitFactor(cfg: any, currency: any) {
  if (cfg.unit_format !== "minor") return 1;
  if (currency && isKnownCurrency(currency)) return 100;
  const n = safeNumber(cfg.unit_factor);
  return n && n > 0 ? n : 100;
}

export function applyUnitFactor(points: any[], factor: number) {
  if (!points.length || factor === 1) {
    return { points, scaled: false, factor };
  }
  return {
    points: points.map(p => ({ ...p, price: p.price * factor })),
    scaled: true,
    factor,
  };
}

export function getMinorLabel(cfg: any, currency: any, lang: any) {
  if (cfg.currency_override === "custom") {
    return cfg.minor_label || localize("unit_minor", lang);
  }
  if (currency && isKnownCurrency(currency)) {
    const label = localize(`minor_${currency}`, lang);
    return label && !label.startsWith("minor_") ? label : "";
  }
  return "";
}

export function getDisplayUnit(cfg: any, attrs: any, lang: any) {
  const currency = getEffectiveCurrency(cfg, attrs);
  if (cfg.unit_format === "minor") {
    const minor = getMinorLabel(cfg, currency, lang);
    return minor ? `${minor}/kWh` : "minor/kWh";
  }
  return currency ? `${currency}/kWh` : "";
}
