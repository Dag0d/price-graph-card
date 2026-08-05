import { html } from "lit";
import { roundTo } from "./format";
import { extractTimelineFromAttributes, filterToDay, safeNumber } from "./data";
import { getThresholdsForDay } from "./pricing";
import { getHaTimeZone } from "./time";

export function getP70SensorValue() {
    return this._getSensorThresholdValue("p70");
  }



export function getSensorThresholdValue(key) {
    const hass = this._hass || this.hass;
    const st = hass?.states?.[this._config?.entity];
    if (!st) return null;
    const attrs = st.attributes;
    const timelineAll = extractTimelineFromAttributes(attrs);
    const today = filterToDay(timelineAll, new Date(), 0, getHaTimeZone(hass));
    const cfgNoFixed = {
      ...this._config,
      use_fixed_p20: false,
      use_fixed_avg: false,
      use_fixed_expensive: false,
    };
    const thr = getThresholdsForDay(cfgNoFixed, attrs, today, 1, "today");
    return safeNumber(thr?.[key]);
  }



export function fixedThresholdValueKey(enabledKey) {
    return {
      use_fixed_p20: "fixed_p20_value",
      use_fixed_avg: "fixed_avg_value",
      use_fixed_expensive: "fixed_expensive_value",
    }[enabledKey] || "";
  }



export function getThresholdDefaultValue(enabledKey) {
    const thresholdKey = {
      use_fixed_p20: "p20",
      use_fixed_avg: "avg",
      use_fixed_expensive: "p70",
    }[enabledKey];
    return thresholdKey ? this._getSensorThresholdValue(thresholdKey) : null;
  }



export function setFixedThresholdValue(valueKey, rawValue) {
    const n = Number(rawValue);
    this._commit({
      ...this._config,
      [valueKey]: Number.isFinite(n) ? n : null,
    });
  }



export function renderFixedThresholdRow({ enabledKey, valueKey, labelKey, placeholderValue }) {
    const enabled = !!this._config[enabledKey];
    const placeholder = placeholderValue !== null && placeholderValue !== undefined ? String(roundTo(placeholderValue, 3)) : "";
    return html`
      <div class="two-col threshold-row">
        <div class="toggle-item threshold-toggle">
          <ha-switch
            .checked=${enabled}
            @change=${(e) => this._setToggle(enabledKey, e.target.checked)}
          ></ha-switch>
          <div class="toggle-label">${this._label(labelKey)}</div>
        </div>
        <ha-textfield
          label="${this._label(labelKey)}"
          type="number"
          step="0.001"
          ?disabled=${!enabled}
          .value=${String(this._config[valueKey] ?? "")}
          .placeholder=${placeholder}
          @input=${(e) => this._setFixedThresholdValue(valueKey, e.target.value)}
        ></ha-textfield>
      </div>
    `;
  }

