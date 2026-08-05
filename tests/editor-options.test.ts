import { describe, expect, it } from "vitest";
import { attributeOptions } from "../src/editor-options";

describe("attribute editor options", () => {
  it("lists current main-entity attributes alphabetically without data", () => {
    const hass = {
      states: {
        "sensor.market_price": {
          attributes: {
            unit_of_measurement: "EUR/kWh",
            data: [{ start_time: "2026-01-01T00:00:00Z", price: 0.2 }],
            avg_today: 0.25,
            currency: "EUR",
          },
        },
      },
    };

    expect(attributeOptions(hass, "sensor.market_price")).toEqual([
      { value: "avg_today", label: "avg_today" },
      { value: "currency", label: "currency" },
      { value: "unit_of_measurement", label: "unit_of_measurement" },
    ]);
  });

  it("returns no options until the configured entity is available", () => {
    expect(attributeOptions({ states: {} }, "sensor.missing")).toEqual([]);
  });
});
