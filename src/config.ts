import {
  CARD_TAG,
  CONTENT_SOURCES,
  HEADER_SOURCES,
  UNIT_DISPLAY_MODES,
} from "./const";

const VALID_RANGE_DAYS = new Set(["tomorrow", "two_days", "selected"]);

export function createEmptyContentItem() {
  return {
    label: "",
    source: "attribute",
    entity: "",
    attribute: "",
    show_unit: false,
    unit_display_mode: "per_kwh",
    use_color: false,
    range_day: "today",
    actions: createContentItemActions(),
  };
}

export function createContentItemActions() {
  return {
    enabled: false,
    tap_action: { action: "more-info" },
    hold_action: { action: "none" },
    double_tap_action: { action: "none" },
    use_target_entity: false,
    target_entity: "",
  };
}

export function createHeaderItem(source = "title", label = "") {
  return {
    label,
    source,
    entity: "",
    attribute: "",
    show_unit: false,
    unit_display_mode: "per_kwh",
    use_color: false,
    time_overwrite: false,
    range_day: "today",
  };
}

export const DEFAULTS = {
  type: `custom:${CARD_TAG}`,
  title_item_left: createHeaderItem("title", ""),
  title_item_right: createHeaderItem("attribute", ""),
  entity: "",
  view_mode: "graph",
  decimals: 1,
  show_now_line: true,
  color_cheap: "#4CAF50",
  color_normal: "#CDDC39",
  color_expensive: "#FF9800",
  color_very_expensive: "#F44336",
  height: 280,
  debug: false,
  unit_format: "currency",
  unit_factor: 100,
  currency_override: "auto",
  currency_custom: "",
  minor_label: "",
  show_currency_override: false,
  show_hover_line: true,
  detailed_colors: false,
  use_fixed_p20: false,
  fixed_p20_value: null,
  use_fixed_avg: false,
  fixed_avg_value: null,
  use_fixed_expensive: false,
  fixed_expensive_value: null,
  show_day_buttons: false,
  day_view_default: "today",
  two_day_mode: "span",
  content_items: [],
  content_items_position: "top",
  content_items_max_cols: 4,
};

export function mergeConfig(user: any) {
  const cfg = { ...DEFAULTS, ...(user || {}) };
  if (cfg.view_mode !== "graph" && cfg.view_mode !== "timeline") cfg.view_mode = "graph";
  if (cfg.content_items_position !== "bottom") cfg.content_items_position = "top";
  cfg.content_items_max_cols = Number(cfg.content_items_max_cols) === 3 ? 3 : 4;
  return cfg;
}

export function normalizeRangeDay(day: any) {
  return VALID_RANGE_DAYS.has(day) ? day : "today";
}

function normalizeContentSource(source: any) {
  return CONTENT_SOURCES.includes(source) ? source : "attribute";
}

function normalizeHeaderSource(source: any, defaultSource = "title") {
  const fallback = HEADER_SOURCES.includes(defaultSource) ? defaultSource : "attribute";
  return HEADER_SOURCES.includes(source) ? source : fallback;
}

function normalizeUnitDisplayMode(mode: any) {
  return UNIT_DISPLAY_MODES.includes(mode) ? mode : "per_kwh";
}

function normalizeAction(action: any, fallback = "none") {
  const source = action && typeof action === "object" ? action : {};
  const actionType = typeof source.action === "string" && source.action ? source.action : fallback;
  return { ...source, action: actionType };
}

export function normalizeContentItemActions(actions: any) {
  const enabled = !!(actions && typeof actions === "object" && actions.enabled);
  if (!enabled) return createContentItemActions();
  return {
    enabled: true,
    tap_action: normalizeAction(actions.tap_action, "more-info"),
    hold_action: normalizeAction(actions.hold_action, "none"),
    double_tap_action: normalizeAction(actions.double_tap_action, "none"),
    use_target_entity: !!actions.use_target_entity || !!String(actions.target_entity || "").trim(),
    target_entity: String(actions.target_entity || "").trim(),
  };
}

export function normalizeContentItems(items: any) {
  const out = [];
  if (!Array.isArray(items)) return out;
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    const source = normalizeContentSource(it.source);
    const defaultShowUnit = source === "price_range" || source === "avg_price";
    out.push({
      label: String(it.label || "").trim(),
      source,
      entity: String(it.entity || "").trim(),
      attribute: String(it.attribute || "").trim(),
      show_unit: it.show_unit === undefined ? defaultShowUnit : !!it.show_unit,
      unit_display_mode: normalizeUnitDisplayMode(it.unit_display_mode),
      use_color: !!it.use_color,
      range_day: normalizeRangeDay(it.range_day),
      actions: normalizeContentItemActions(it.actions),
    });
  }
  return out;
}

export function normalizeHeaderItem(item: any, defaultSource = "title", defaultLabel = "") {
  if (!item || typeof item !== "object") return createHeaderItem(defaultSource, defaultLabel);
  const source = normalizeHeaderSource(item.source, defaultSource);
  const defaultShowUnit = source === "price_range" || source === "avg_price";
  return {
    label: String(item.label || defaultLabel || "").trim(),
    source,
    entity: String(item.entity || "").trim(),
    attribute: String(item.attribute || "").trim(),
    show_unit: item.show_unit === undefined ? defaultShowUnit : !!item.show_unit,
    unit_display_mode: normalizeUnitDisplayMode(item.unit_display_mode),
    use_color: !!item.use_color,
    time_overwrite: !!item.time_overwrite,
    range_day: normalizeRangeDay(item.range_day),
  };
}

function emitSourceFields(normalized: any, out: any, includeTimeOverwrite = false) {
  const { source } = normalized;
  if (source === "entity") {
    if (normalized.entity) out.entity = normalized.entity;
    if (normalized.show_unit) out.show_unit = true;
    if (normalized.show_unit && normalized.unit_display_mode !== "per_kwh") out.unit_display_mode = normalized.unit_display_mode;
  } else if (source === "attribute") {
    if (normalized.attribute) out.attribute = normalized.attribute;
    if (normalized.show_unit) out.show_unit = true;
    if (normalized.show_unit && normalized.unit_display_mode !== "per_kwh") out.unit_display_mode = normalized.unit_display_mode;
  } else if (source === "current_price") {
    if (includeTimeOverwrite && normalized.time_overwrite) out.time_overwrite = true;
    if (normalized.show_unit) out.show_unit = true;
    if (normalized.show_unit && normalized.unit_display_mode !== "per_kwh") out.unit_display_mode = normalized.unit_display_mode;
  } else if (source === "price_range" || source === "avg_price") {
    if (normalized.range_day !== "today") out.range_day = normalized.range_day;
    if (!normalized.show_unit) out.show_unit = false;
    if (normalized.show_unit && normalized.unit_display_mode !== "per_kwh") out.unit_display_mode = normalized.unit_display_mode;
  } else if (source === "price_level") {
    if (normalized.use_color) out.use_color = true;
  }
}

export function compactHeaderItem(item: any, defaultSource = "title") {
  const normalized = normalizeHeaderItem(item, defaultSource, "");
  const out: Record<string, any> = {};
  if (normalized.label && (normalized.source !== "current_price" || normalized.time_overwrite)) out.label = normalized.label;
  if (normalized.source !== defaultSource) out.source = normalized.source;
  emitSourceFields(normalized, out, true);
  const hasMeaningfulData = Object.keys(out).some((k) => k !== "source");
  if (!hasMeaningfulData && normalized.source === defaultSource) return null;
  return out;
}

export function compactContentItem(item: any) {
  if (!item || typeof item !== "object") return null;
  const normalized = normalizeContentItems([item])[0];
  if (!normalized) return null;
  const out: Record<string, any> = {};
  if (normalized.label) out.label = normalized.label;
  if (normalized.source !== "attribute") out.source = normalized.source;
  emitSourceFields(normalized, out);
  if (normalized.actions?.enabled) {
    const actions: Record<string, any> = { enabled: true };
    actions.tap_action = normalized.actions.tap_action || { action: "more-info" };
    if (normalized.actions.hold_action?.action && normalized.actions.hold_action.action !== "none") {
      actions.hold_action = normalized.actions.hold_action;
    }
    if (normalized.actions.double_tap_action?.action && normalized.actions.double_tap_action.action !== "none") {
      actions.double_tap_action = normalized.actions.double_tap_action;
    }
    if (normalized.actions.use_target_entity) {
      actions.use_target_entity = true;
      if (normalized.actions.target_entity) actions.target_entity = normalized.actions.target_entity;
    }
    out.actions = actions;
  }
  const hasMeaningfulData = Object.keys(out).some((k) => k !== "source");
  if (!hasMeaningfulData && normalized.source === "attribute") return { source: "attribute" };
  return out;
}
