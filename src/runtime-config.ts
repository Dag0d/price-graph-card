export function resolveRuntimeConfig(cfg: any, dayView: string) {
  if (cfg?.view_mode === "timeline" && dayView === "two_days" && cfg.two_day_mode !== "span") {
    return { ...cfg, two_day_mode: "span" };
  }
  return cfg;
}
