import { formatDisplayValue } from "./format";
import { getLang } from "./i18n";
import { safeNumber } from "./data";
import {
  buildEntityUnitTokens,
  formatUnitByMode,
  getDisplayUnit,
  getEffectiveCurrency,
  getUnitFactor,
  splitEntityValueAndUnit,
  stripEntityUnitTokens,
} from "./units";

export function getContentItemValue(item: any, hass: any, mainState: any, decimals: number, cfg: any) {
  if (!item) return null;
  if (item.source === "entity") {
    const st = hass?.states?.[item.entity];
    if (!st) return null;
    const formatted = hass?.formatEntityState ? hass.formatEntityState(st) : String(st.state ?? "");
    const rendered = String(formatted ?? "").replace(/\u00A0/g, " ").trim();
    const unit = formatUnitByMode(st.attributes?.unit_of_measurement || "", item.unit_display_mode);
    const tokens = buildEntityUnitTokens(st, unit);
    if (item.show_unit) return splitEntityValueAndUnit(rendered, tokens);
    const value = stripEntityUnitTokens(rendered, tokens);
    return { value, unit: "" };
  }
  if (item.source === "attribute") {
    if (!mainState) return null;
    let valueRaw = mainState.attributes?.[item.attribute];
    const n = safeNumber(valueRaw);
    if (n !== null) {
      const currency = getEffectiveCurrency(cfg, mainState.attributes);
      const factor = getUnitFactor(cfg, currency);
      valueRaw = n * factor;
    } else if (valueRaw === null || valueRaw === undefined || (typeof valueRaw === "string" && !valueRaw.trim())) {
      valueRaw = null;
    }
    const value = formatDisplayValue(valueRaw, decimals);
    const unit = formatUnitByMode(getDisplayUnit(cfg, mainState.attributes, getLang(hass)), item.unit_display_mode);
    return { value, unit };
  }
  return null;
}
