import { localize } from "./i18n";
import { getMinorLabel } from "./units";

export function attributeOptions(hass: any, entityId: string) {
  const attributes = hass?.states?.[entityId]?.attributes;
  if (!attributes || typeof attributes !== "object") return [];
  return Object.keys(attributes)
    .filter((key) => key !== "data")
    .sort((a, b) => a.localeCompare(b))
    .map((key) => ({ value: key, label: key }));
}

export function contentSourceOptions(lang: string) {
  return [
    { value: "attribute", label: localize("editor_content_source_attr", lang) },
    { value: "entity", label: localize("editor_content_source_entity", lang) },
    { value: "price_level", label: localize("editor_content_source_price", lang) },
    { value: "next_price_level", label: localize("editor_content_source_next_price_level", lang) },
    { value: "current_price", label: localize("editor_content_source_current", lang) },
    { value: "price_range", label: localize("editor_content_source_price_range", lang) },
    { value: "avg_price", label: localize("editor_content_source_avg_price", lang) },
  ];
}

export function nextPriceLevelOptions(detailed: boolean, lang: string) {
  return detailed
    ? [
        { value: "cheap", label: localize("region_cheap", lang) },
        { value: "normal", label: localize("region_normal", lang) },
        { value: "expensive", label: localize("region_expensive", lang) },
        { value: "very_expensive", label: localize("region_very_expensive", lang) },
      ]
    : [
        { value: "below_avg", label: localize("region_below_avg", lang) },
        { value: "above_avg", label: localize("region_above_avg", lang) },
      ];
}

export function priceRangeDayOptions(lang: string) {
  return [
    { value: "selected", label: localize("editor_price_range_day_selected", lang) },
    { value: "today", label: localize("label_today", lang) },
    { value: "tomorrow", label: localize("label_tomorrow", lang) },
    { value: "two_days", label: localize("label_two_days", lang) },
  ];
}

export function itemUnitDisplayOptions(config: any, effectiveCurrency: string, lang: string) {
  const unitBase = config.unit_format === "minor"
    ? (getMinorLabel(config, effectiveCurrency, lang) || localize("unit_minor", lang))
    : (effectiveCurrency || localize("unit_currency", lang));
  return [
    { value: "value_only", label: unitBase },
    { value: "per_kwh", label: `${unitBase}/kWh` },
  ];
}

export function headerSourceOptions(lang: string) {
  return [
    { value: "title", label: localize("editor_content_source_title", lang) },
    ...contentSourceOptions(lang),
  ];
}

export function headerDefaultSource(key: string) {
  return key === "title_item_left" ? "title" : "attribute";
}
