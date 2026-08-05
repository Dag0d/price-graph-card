import { LitElement, html } from "lit";
import {
  EDITOR_LABELS,
  EDITOR_TAG,
  KNOWN_CURRENCIES,
  MAX_INFO_SLOTS,
} from "./const";
import {
  mergeConfig,
  createEmptyContentItem,
  normalizeContentItems,
  normalizeHeaderItem,
} from "./config";
import { ensureLanguage, getLang, localize } from "./i18n";
import { EDITOR_STYLES } from "./editor-styles";
import {
  contentSourceOptions,
  headerDefaultSource,
  headerSourceOptions,
  itemUnitDisplayOptions,
  nextPriceLevelOptions,
  priceRangeDayOptions,
} from "./editor-options";
import { sanitizeEditorConfig } from "./editor-sanitize";
import { renderHeaderItemEditor, renderItemEditor, renderItemSourceFields, renderOtherEntityAction, renderSlotEditor } from "./editor-item-renderers";
import { renderEditorContent } from "./editor-render";
import { fixedThresholdValueKey, getP70SensorValue, getSensorThresholdValue, getThresholdDefaultValue, renderFixedThresholdRow, setFixedThresholdValue } from "./editor-thresholds";
import {
  getCurrencyCode,
  getMinorLabel,
  isKnownCurrency,
} from "./units";
import { normalizeHexColor } from "./graph";

class PriceGraphCardEditor extends LitElement {
  [key: string]: any;

  static get properties() {
    return {
      hass: {},
      _config: { state: true },
      _contentOpen: { state: true },
      _headerOpen: { state: true },
      _unitsOpen: { state: true },
      _extraSlotsOpen: { state: true },
      _graphOpen: { state: true },
      _actionsOpen: { state: true },
      _colorsOpen: { state: true },
    };
  }

  set hass(hass) {
    this._hass = hass;
    const lang = getLang(hass);
    if (lang !== this._loadedLang) {
      this._loadedLang = lang;
      ensureLanguage(lang).then(() => this.requestUpdate());
    }
    this.requestUpdate();
  }

  get hass() {
    return this._hass;
  }

  static get styles() {
    return EDITOR_STYLES;
  }


  setConfig(config) {
    this._config = mergeConfig(config);
    for (const key of ["_contentOpen", "_headerOpen", "_unitsOpen", "_extraSlotsOpen", "_graphOpen", "_actionsOpen", "_colorsOpen"]) {
      if (this[key] === undefined) this[key] = false;
    }
    this._ensureActionEditor();
  }

  _valueChanged(e) {
    this._commit({ ...this._config, ...e.detail.value });
  }

  async _ensureActionEditor() {
    if (this._actionEditorReady) return;
    this._actionEditorReady = true;
    try {
      if (customElements.get("hui-action-editor")) return;
      const helpers = await window.loadCardHelpers?.();
      if (!helpers?.createCardElement) return;
      const el = await helpers.createCardElement({ type: "button" });
      el?.constructor?.getConfigElement?.();
    } catch (_err) {
    }
  }

  _onFactorChanged(e) {
    const n = Number(e.target.value);
    this._commit({ ...this._config, unit_factor: Number.isFinite(n) ? n : this._config.unit_factor });
  }

  _getCurrency() {
    const hass = this._hass || this.hass;
    const st = hass?.states?.[this._config?.entity];
    return st ? getCurrencyCode(st.attributes) : "";
  }

  _sanitizeConfig(cfg) {
    return sanitizeEditorConfig(cfg, () => this._getCurrency());
  }

  _commit(cfg) {
    const next = this._sanitizeConfig(cfg);
    this._config = mergeConfig(next);
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: next },
      bubbles: true,
      composed: true,
    }));
  }

  _label(key) {
    const hass = this._hass || this.hass;
    const lang = getLang(hass);
    return localize(key, lang);
  }

  _computeLabel(entry) {
    return this._label(EDITOR_LABELS[entry.name] || entry.name);
  }

  _setColor(key, value) {
    const hex = normalizeHexColor(value, this._config[key] || "#ffffff");
    this._commit({ ...this._config, [key]: hex });
  }

  _setToggle(key, checked) {
    let next = { ...this._config, [key]: !!checked };
    if (key === "detailed_colors" && !checked) {
      next.use_fixed_p20 = false;
      next.fixed_p20_value = null;
      next.use_fixed_avg = false;
      next.fixed_avg_value = null;
      next.use_fixed_expensive = false;
      next.fixed_expensive_value = null;
    }
    const defaultValue = this._getThresholdDefaultValue(key);
    const valueKey = this._fixedThresholdValueKey(key);
    if (checked && valueKey && next[valueKey] == null && defaultValue !== null) next[valueKey] = defaultValue;
    this._commit(next);
  }

  _contentSourceOptions(lang) {
    return contentSourceOptions(lang);
  }

  _priceRangeDayOptions(lang) {
    return priceRangeDayOptions(lang);
  }

  _itemUnitDisplayOptions(lang) {
    const override = this._config.currency_override || "auto";
    const sensorCurrency = this._getCurrency();
    const effectiveCurrency = override === "auto"
      ? sensorCurrency
      : (override === "custom" ? String(this._config.currency_custom || "").trim().toUpperCase() : override);
    return itemUnitDisplayOptions(this._config, effectiveCurrency, lang);
  }

  _nextPriceLevelOptions(lang) {
    return nextPriceLevelOptions(!!this._config?.detailed_colors, lang);
  }

  _headerSourceOptions(lang) {
    return headerSourceOptions(lang);
  }

  _headerDefaultSource(key) {
    return headerDefaultSource(key);
  }

  _updateHeaderItem(key, patch, defaultSource = "title") {
    const current = normalizeHeaderItem(this._config[key], defaultSource, "");
    this._commit({ ...this._config, [key]: { ...current, ...patch } });
  }

  _renderItemSourceFields(args) {
    return renderItemSourceFields.call(this, args);
  }

  _renderItemEditor(args) {
    return renderItemEditor.call(this, args);
  }

  _renderHeaderItemEditor(args) {
    return renderHeaderItemEditor.call(this, args);
  }

  _renderSlotEditor(args) {
    return renderSlotEditor.call(this, args);
  }

  _renderOtherEntityAction(args) {
    return renderOtherEntityAction.call(this, args);
  }

  _updateContentItem(index, patch) {
    const items = normalizeContentItems(this._config.content_items);
    const maxItems = MAX_INFO_SLOTS;
    while (items.length <= index && items.length < maxItems) {
      items.push(createEmptyContentItem());
    }
    if (index >= maxItems) return;
    items[index] = { ...(items[index] || createEmptyContentItem()), ...patch };
    this._commit({ ...this._config, content_items: items });
  }

  _enableContentItemTargetEntity(index) {
    this._updateContentItem(index, {
      actions: {
        ...(normalizeContentItems(this._config.content_items)[index]?.actions || {}),
        use_target_entity: true,
      },
    });
  }

  _enableActionTargetEntity(targetKey) {
    this._commit({ ...this._config, [targetKey]: "other" });
  }

  _addContentSlot() {
    const items = normalizeContentItems(this._config.content_items);
    if (items.length >= MAX_INFO_SLOTS) return;
    items.push(createEmptyContentItem());
    this._commit({ ...this._config, content_items: items });
  }

  _removeContentSlot(index) {
    const items = normalizeContentItems(this._config.content_items);
    if (index < 0 || index >= items.length) return;
    items.splice(index, 1);
    this._commit({ ...this._config, content_items: items });
  }


  _renderPanel(icon, label, isOpen, onToggle, bodyFn) {
    return html`
      <div class="panel">
        <div class="panel-header" @click=${onToggle}>
          <div class="panel-header-left">
            <ha-icon icon=${icon}></ha-icon>
            <div>${label}</div>
          </div>
          <ha-icon icon=${isOpen ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </div>
        ${isOpen ? html`<div class="panel-body">${bodyFn()}</div>` : html``}
      </div>
    `;
  }

  _getP70SensorValue() {
    return getP70SensorValue.call(this);
  }

  _getSensorThresholdValue(key) {
    return getSensorThresholdValue.call(this, key);
  }

  _fixedThresholdValueKey(enabledKey) {
    return fixedThresholdValueKey(enabledKey);
  }

  _getThresholdDefaultValue(enabledKey) {
    return getThresholdDefaultValue.call(this, enabledKey);
  }

  _setFixedThresholdValue(valueKey, rawValue) {
    return setFixedThresholdValue.call(this, valueKey, rawValue);
  }

  _renderFixedThresholdRow(args) {
    return renderFixedThresholdRow.call(this, args);
  }

  render() {
    const hass = this._hass || this.hass;
    if (!hass || !this._config) return html``;

    const lang = getLang(hass);
    const sensorCurrency = this._getCurrency();
    const override = this._config.currency_override || "auto";
    const effectiveCurrency = override === "auto"
      ? sensorCurrency
      : (override === "custom" ? String(this._config.currency_custom || "").trim().toUpperCase() : override);

    const isKnown = effectiveCurrency ? isKnownCurrency(effectiveCurrency) : false;
    const isMinor = this._config.unit_format !== "currency";
    const showFactor = isMinor && !isKnown;
    const showCustomCurrency = this._config.show_currency_override && override === "custom";
    const showMinorLabel = isMinor && !isKnown;

    const currencyLabel = effectiveCurrency || localize("unit_currency", lang);
    const minorLabel = getMinorLabel(this._config, effectiveCurrency, lang) || "";
    const thresholdHints = this._config.detailed_colors ? {
      p20: this._getSensorThresholdValue("p20"),
      avg: this._getSensorThresholdValue("avg"),
      p70: this._getSensorThresholdValue("p70"),
    } : { p20: null, avg: null, p70: null };
    const computeLabel = this._boundComputeLabel || (this._boundComputeLabel = this._computeLabel.bind(this));
    const titleItemLeft = normalizeHeaderItem(this._config.title_item_left, "title", "");
    const titleItemRight = normalizeHeaderItem(this._config.title_item_right, "attribute", "");
    const infoItems = normalizeContentItems(this._config.content_items).slice(0, MAX_INFO_SLOTS);
    const sourceOptions = this._contentSourceOptions(lang);
    const currencyOverrideOptions = [
      { value: "auto", label: localize("currency_auto", lang) },
      ...KNOWN_CURRENCIES.map((code) => ({ value: code, label: `${code} — ${localize(`currency_${code}`, lang)}` })),
      { value: "custom", label: localize("currency_custom", lang) },
    ];

    return renderEditorContent.call(this, {
      hass,
      lang,
      computeLabel,
      titleItemLeft,
      titleItemRight,
      infoItems,
      sourceOptions,
      currencyOverrideOptions,
      currencyLabel,
      minorLabel,
      showCustomCurrency,
      showMinorLabel,
      showFactor,
      effectiveCurrency,
      thresholdHints,
    });
  }
}


if (!customElements.get(EDITOR_TAG)) customElements.define(EDITOR_TAG, PriceGraphCardEditor);
