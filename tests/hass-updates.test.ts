import { describe, expect, it } from "vitest";
import { getWatchedEntityIds, isHassChangeRelevant } from "../src/hass-updates";

const priceState = { state: "0.25", attributes: {} };
const locale = { language: "de" };
const config = { time_zone: "Europe/Berlin" };
const themes = {};
const formatEntityState = () => "";

function makeHass(states: Record<string, any>, overrides: Record<string, any> = {}) {
  return { language: "de", locale, config, themes, formatEntityState, states, ...overrides };
}

describe("watched entities", () => {
  it("collects the main entity and entity sources from header and slots", () => {
    const ids = getWatchedEntityIds({
      entity: "sensor.price",
      title_item_right: { source: "entity", entity: "sensor.header" },
      content_items: [{ source: "entity", entity: "sensor.slot" }, { source: "attribute", attribute: "avg_today" }],
    });
    expect(ids.sort()).toEqual(["sensor.header", "sensor.price", "sensor.slot"]);
  });
});

describe("hass update filter", () => {
  const ids = ["sensor.price"];

  it("ignores state changes of unrelated entities", () => {
    const previous = makeHass({ "sensor.price": priceState, "sensor.other": { state: "1" } });
    const next = makeHass({ "sensor.price": priceState, "sensor.other": { state: "2" } });
    expect(isHassChangeRelevant(previous, next, ids)).toBe(false);
  });

  it("reacts to a changed watched entity", () => {
    const previous = makeHass({ "sensor.price": priceState });
    const next = makeHass({ "sensor.price": { ...priceState } });
    expect(isHassChangeRelevant(previous, next, ids)).toBe(true);
  });

  it("reacts to a removed watched entity", () => {
    const previous = makeHass({ "sensor.price": priceState });
    const next = makeHass({});
    expect(isHassChangeRelevant(previous, next, ids)).toBe(true);
  });

  it("reacts to formatting context changes", () => {
    const previous = makeHass({ "sensor.price": priceState });
    expect(isHassChangeRelevant(previous, makeHass(previous.states, { locale: { language: "en" } }), ids)).toBe(true);
    expect(isHassChangeRelevant(previous, makeHass(previous.states, { config: { time_zone: "UTC" } }), ids)).toBe(true);
    expect(isHassChangeRelevant(previous, makeHass(previous.states, { themes: { darkMode: true } }), ids)).toBe(true);
  });

  it("treats the first hass object as relevant", () => {
    expect(isHassChangeRelevant(undefined, makeHass({}), ids)).toBe(true);
  });
});
