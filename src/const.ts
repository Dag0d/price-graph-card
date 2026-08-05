export const CARD_TAG = "price-graph-card";
export const EDITOR_TAG = "price-graph-card-editor";
export const TIMELINE_CANVAS_HEIGHT = 74;
export const SIMPLE_LOW_COLOR = "#1AC5AA";
export const SIMPLE_HIGH_COLOR = "#FE8730";
export const MAX_INFO_SLOTS = 16;

export const DETAILED_COLOR_CONFIG = Object.freeze([
  { key: "color_cheap", label: "editor_color_cheap", fallback: "#cddc39" },
  { key: "color_normal", label: "editor_color_normal", fallback: "#ff9800" },
  { key: "color_expensive", label: "editor_color_expensive", fallback: "#f44336" },
  { key: "color_very_expensive", label: "editor_color_very_expensive", fallback: "#b71c1c" },
]);

export const KNOWN_CURRENCIES = Object.freeze([
  "EUR","CHF","GBP","NOK","SEK","DKK","ISK","PLN","CZK","HUF","RON","USD","CAD","MXN",
]);

export const KNOWN_CURRENCY_SET = new Set(KNOWN_CURRENCIES);
export const CONTENT_SOURCES = Object.freeze(["attribute", "entity", "price_level", "current_price", "price_range", "avg_price"]);
export const HEADER_SOURCES = Object.freeze(["title", ...CONTENT_SOURCES]);
export const UNIT_DISPLAY_MODES = Object.freeze(["per_kwh", "value_only"]);
export const TICK_STEPS = Object.freeze([[0.08,0.01],[0.16,0.02],[0.3,0.05],[0.8,0.1],[1.6,0.2],[3.5,0.5],[8,1],[16,2],[35,5],[80,10]]);
export const GEAR_ICON_PATH = "M19.14,12.94C19.18,12.64 19.2,12.33 19.2,12C19.2,11.68 19.18,11.36 19.13,11.06L21.19,9.45C21.37,9.31 21.42,9.05 21.3,8.84L19.3,5.38C19.18,5.16 18.92,5.08 18.69,5.16L16.26,6.14C15.76,5.76 15.23,5.45 14.62,5.22L14.25,2.64C14.21,2.4 14,2.22 13.75,2.22H10.25C10,2.22 9.79,2.4 9.76,2.64L9.38,5.22C8.77,5.45 8.24,5.76 7.74,6.14L5.31,5.16C5.08,5.08 4.82,5.16 4.7,5.38L2.7,8.84C2.57,9.05 2.63,9.31 2.81,9.45L4.86,11.06C4.82,11.36 4.8,11.69 4.8,12C4.8,12.31 4.82,12.64 4.87,12.94L2.81,14.55C2.63,14.69 2.57,14.95 2.7,15.16L4.7,18.62C4.82,18.84 5.08,18.92 5.31,18.84L7.74,17.86C8.24,18.24 8.77,18.55 9.38,18.78L9.76,21.36C9.79,21.6 10,21.78 10.25,21.78H13.75C14,21.78 14.21,21.6 14.24,21.36L14.62,18.78C15.23,18.55 15.76,18.24 16.26,17.86L18.69,18.84C18.92,18.92 19.18,18.84 19.3,18.62L21.3,15.16C21.42,14.95 21.37,14.69 21.19,14.55L19.14,12.94M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5Z";

export const EDITOR_LABELS = Object.freeze({
  entity: "editor_entity",
  view_mode: "editor_view_mode",
  decimals: "editor_decimals",
  height: "editor_height",
  show_now_line: "editor_show_now_line",
  show_hover_line: "editor_show_hover_line",
  unit_format: "editor_unit_format",
  currency_override: "editor_currency",
  currency_custom: "editor_currency_custom",
  minor_label: "editor_minor_label",
  unit_factor: "editor_unit_factor",
  use_fixed_expensive: "editor_use_fixed_expensive",
  fixed_expensive_value: "editor_fixed_expensive_value",
  show_currency_override: "editor_show_currency_override",
  show_day_buttons: "editor_show_day_buttons",
  day_view_default: "editor_day_view_default",
  two_day_mode: "editor_two_day_mode",
  content_items: "editor_content_items",
  content_items_position: "editor_content_items_position",
  content_items_max_cols: "editor_content_items_max_cols",
  unit_display_mode: "editor_unit_display_mode",
  tap_action: "editor_tap_action",
  hold_action: "editor_hold_action",
  double_tap_action: "editor_double_tap_action",
  tap_action_target: "editor_action_target",
  hold_action_target: "editor_action_target",
  double_tap_action_target: "editor_action_target",
  tap_action_entity: "editor_action_entity",
  hold_action_entity: "editor_action_entity",
  double_tap_action_entity: "editor_action_entity",
  debug: "editor_debug",
  color_cheap: "editor_color_cheap",
  color_normal: "editor_color_normal",
  color_expensive: "editor_color_expensive",
  color_very_expensive: "editor_color_very_expensive",
});
