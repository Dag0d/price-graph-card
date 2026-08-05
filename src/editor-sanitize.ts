import { compactContentItem, compactHeaderItem } from "./config";
import { isKnownCurrency } from "./units";

export function sanitizeEditorConfig(cfg: any, getCurrency: () => string) {
  const out = { ...cfg };
  delete out.title;
  const override = out.currency_override || "auto";
  const effectiveCurrency = override === "auto"
    ? getCurrency()
    : (override === "custom" ? String(out.currency_custom || "").trim().toUpperCase() : override);
  const isKnown = effectiveCurrency ? isKnownCurrency(effectiveCurrency) : false;
  const isMinor = out.unit_format !== "currency";

  if (override === "auto") delete out.currency_override;
  if (override !== "custom") delete out.currency_custom;

  if (!(isMinor && !isKnown)) {
    delete out.unit_factor;
    delete out.minor_label;
  }

  if (!out.detailed_colors) {
    delete out.use_fixed_p20;
    delete out.fixed_p20_value;
    delete out.use_fixed_avg;
    delete out.fixed_avg_value;
    delete out.use_fixed_expensive;
    delete out.fixed_expensive_value;
  } else {
    for (const [enabledKey, valueKey] of [
      ["use_fixed_p20", "fixed_p20_value"],
      ["use_fixed_avg", "fixed_avg_value"],
      ["use_fixed_expensive", "fixed_expensive_value"],
    ]) {
      if (!out[enabledKey]) {
        delete out[enabledKey];
        delete out[valueKey];
      }
    }
  }

  if (!out.show_day_buttons) {
    delete out.day_view_default;
    delete out.two_day_mode;
  }

  for (const key of ["tap", "hold", "double_tap"]) {
    if (out[`${key}_action_target`] !== "other") {
      delete out[`${key}_action_target`];
      delete out[`${key}_action_entity`];
    }
  }

  for (const [key, defaultSource] of [["title_item_left", "title"], ["title_item_right", "attribute"]]) {
    const compacted = compactHeaderItem(out[key], defaultSource);
    if (compacted) out[key] = compacted;
    else delete out[key];
  }

  if (Array.isArray(out.content_items)) {
    const compacted = out.content_items.map(compactContentItem).filter(Boolean);
    if (compacted.length) out.content_items = compacted;
    else delete out.content_items;
  }

  if (out.content_items_position !== "bottom") {
    delete out.content_items_position;
  }
  if (Number(out.content_items_max_cols) !== 3) {
    delete out.content_items_max_cols;
  } else {
    out.content_items_max_cols = 3;
  }

  return out;
}
