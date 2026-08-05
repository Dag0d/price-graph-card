export function roundTo(n, dec = 1) {
  const p = Math.pow(10, dec);
  return Math.round(n * p) / p;
}



export function formatDisplayValue(value, decimals) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" && !value.trim()) return "—";
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number" && Number.isFinite(value)) return roundTo(value, decimals).toString();
  const n = Number(value);
  if (Number.isFinite(n)) return roundTo(n, decimals).toString();
  return String(value);
}

export function formatTickLabel(v) {
  const rounded = roundTo(v, 3);
  return Number(rounded.toFixed(3)).toString();
}

export function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
