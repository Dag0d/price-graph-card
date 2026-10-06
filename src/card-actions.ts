// Time a tap waits for a second click, used only when a double tap action is configured.
export const DOUBLE_TAP_WINDOW_MS = 200;

export function isActivationKey(ev: { key?: string } | null | undefined) {
  return ev?.key === "Enter" || ev?.key === " ";
}
