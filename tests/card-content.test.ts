import { describe, expect, it } from "vitest";
import { getContentItemValue } from "../src/card-content";

const HASS = { language: "en" };
const CFG = { unit_format: "minor", currency_override: "auto" };
const ITEM = {
  source: "attribute",
  attribute: "value",
  unit_display_mode: "per_kwh",
};

function renderAttribute(value: unknown) {
  return getContentItemValue(
    ITEM,
    HASS,
    { attributes: { value, currency: "EUR" } },
    2,
    CFG,
  );
}

describe("attribute content values", () => {
  it("keeps explicit zero values", () => {
    expect(renderAttribute(0)?.value).toBe("0");
    expect(renderAttribute("0")?.value).toBe("0");
  });

  it("renders null and blank values as unavailable", () => {
    expect(renderAttribute(null)?.value).toBe("—");
    expect(renderAttribute(undefined)?.value).toBe("—");
    expect(renderAttribute("")?.value).toBe("—");
    expect(renderAttribute("   ")?.value).toBe("—");
  });
});
