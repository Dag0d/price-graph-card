import { normalizeContentItems, normalizeHeaderItem } from "./config";

export function getWatchedEntityIds(config: any): string[] {
  const ids = new Set<string>();
  if (config?.entity) ids.add(config.entity);
  for (const item of normalizeContentItems(config?.content_items)) {
    if (item.source === "entity" && item.entity) ids.add(item.entity);
  }
  for (const [item, defaultSource] of [
    [config?.title_item_left, "title"],
    [config?.title_item_right, "attribute"],
  ]) {
    const normalized = normalizeHeaderItem(item, defaultSource, "");
    if (normalized.source === "entity" && normalized.entity) ids.add(normalized.entity);
  }
  return [...ids];
}

export function haveWatchedStatesChanged(previousStates: any, nextStates: any, entityIds: string[]) {
  for (const id of entityIds) {
    if (previousStates?.[id] !== nextStates?.[id]) return true;
  }
  return false;
}

// Home Assistant hands every card a new `hass` object on any state change in the whole instance.
// Only the watched entities and the formatting context (language, locale, time zone, theme) affect this card.
export function isHassChangeRelevant(previous: any, next: any, entityIds: string[]) {
  if (!previous || !next) return previous !== next;
  if (previous.language !== next.language || previous.locale !== next.locale) return true;
  if (previous.config?.time_zone !== next.config?.time_zone) return true;
  if (previous.themes !== next.themes) return true;
  if (previous.formatEntityState !== next.formatEntityState) return true;
  return haveWatchedStatesChanged(previous.states, next.states, entityIds);
}
