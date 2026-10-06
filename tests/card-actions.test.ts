import { describe, expect, it } from "vitest";
import { isActivationKey } from "../src/card-actions";

describe("keyboard activation", () => {
  it("accepts Enter and Space like a native button", () => {
    expect(isActivationKey({ key: "Enter" })).toBe(true);
    expect(isActivationKey({ key: " " })).toBe(true);
  });

  it("ignores other keys", () => {
    expect(isActivationKey({ key: "Tab" })).toBe(false);
    expect(isActivationKey({ key: "a" })).toBe(false);
    expect(isActivationKey(null)).toBe(false);
  });
});
