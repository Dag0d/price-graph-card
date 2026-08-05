import { LitElement } from "lit";
import {
  CARD_TAG,
  DETAILED_COLOR_CONFIG,
  EDITOR_TAG,
  TIMELINE_CANVAS_HEIGHT,
} from "./const";
import { mergeConfig, normalizeContentItems, normalizeHeaderItem } from "./config";
import { ensureLanguage, getLang } from "./i18n";
import { roundTo } from "./format";
import {
  buildDayContext,
  getThresholdsForDay,
  normalizeDayView,
} from "./pricing";
import { renderCard } from "./card-render";
import { updateCard } from "./card-update";
import { millisecondsUntilNextMinute, startOfDayInTimeZone } from "./time";
const getHelpers = () => window.customCardHelpers || null;
const VERSION = __PRICE_GRAPH_CARD_VERSION__;

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export {
  EDITOR_TAG,
  DETAILED_COLOR_CONFIG,
  getThresholdsForDay,
  roundTo,
};

class PriceGraphCard extends LitElement {
  [key: string]: any;

  static get properties() {
    return {
      hass: {},
      _config: { state: true },
      _dayView: { state: true },
    };
  }

  set hass(hass) {
    this._hass = hass;
    this._effectiveHassCache = null;
    if (this.isConnected) this._scheduleClockUpdate();
    const lang = getLang(hass);
    if (lang !== this._loadedLang) {
      this._loadedLang = lang;
      ensureLanguage(lang).then(() => this.requestUpdate());
    }
    this.requestUpdate();
  }

  get hass() {
    if (!this._hass || !this._contextStates || this._hass.states === this._contextStates) return this._hass;
    const cached = this._effectiveHassCache;
    if (cached?.base === this._hass && cached?.states === this._contextStates) return cached.value;
    const value = { ...this._hass, states: this._contextStates };
    this._effectiveHassCache = { base: this._hass, states: this._contextStates, value };
    return value;
  }

  connectedCallback() {
    super.connectedCallback();
    this._scheduleClockUpdate();
    if (this._statesUnsubscribe) return;
    const event: any = new CustomEvent("context-request", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    event.context = "states";
    event.subscribe = true;
    event.callback = (states, unsubscribe) => {
      if (typeof unsubscribe === "function") this._statesUnsubscribe = unsubscribe;
      if (!states || states === this._contextStates) return;
      const previousStates = this._contextStates;
      this._contextStates = states;
      this._effectiveHassCache = null;
      if (!previousStates || this._observedStatesChanged(previousStates, states)) {
        this._scheduleClockUpdate();
        this.requestUpdate();
      }
    };
    this.dispatchEvent(event);
  }

  _observedStatesChanged(previousStates, nextStates) {
    const ids = new Set<string>();
    if (this._config?.entity) ids.add(this._config.entity);
    for (const item of normalizeContentItems(this._config?.content_items)) {
      if (item.source === "entity" && item.entity) ids.add(item.entity);
    }
    for (const [item, defaultSource] of [
      [this._config?.title_item_left, "title"],
      [this._config?.title_item_right, "attribute"],
    ]) {
      const normalized = normalizeHeaderItem(item, defaultSource, "");
      if (normalized.source === "entity" && normalized.entity) ids.add(normalized.entity);
    }
    for (const id of ids) {
      if (previousStates?.[id] !== nextStates?.[id]) return true;
    }
    return false;
  }

  static async getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }
  static getStubConfig() {
    return {};
  }

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration");
    }
    this._config = mergeConfig(config);
    const configuredView = this._config.day_view_default;
    this._dayView = configuredView === "tomorrow" || configuredView === "two_days" ? configuredView : "today";
    this._lastDayCtx = null;
    this._lastGraphSignature = null;
    if (this.isConnected) this._scheduleClockUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._statesUnsubscribe?.();
    this._statesUnsubscribe = null;
    this._contextStates = null;
    this._effectiveHassCache = null;
    this._unbindGraphPointer();
    this._disconnectResizeObserver();
    clearTimeout(this._holdTimer);
    clearTimeout(this._tapTimer);
    clearTimeout(this._slotHoldTimer);
    clearTimeout(this._slotTapTimer);
    clearTimeout(this._clockTimer);
    this._clockTimer = null;
    this._lastDayCtx = null;
    this._lastGraphSignature = null;
  }

  getCardSize() {
    const measuredHeight = Math.round(this.getBoundingClientRect?.().height || 0);
    if (measuredHeight > 0) return Math.max(1, Math.ceil(measuredHeight / 50));

    const cfg = this._config || {};
    const plotHeight = cfg.view_mode === "timeline" ? TIMELINE_CANVAS_HEIGHT : (Number(cfg.height) || 280);
    const itemCount = normalizeContentItems(cfg.content_items).length;
    const columns = Number(cfg.content_items_max_cols) === 3 ? 3 : 4;
    const itemRows = Math.ceil(itemCount / columns);
    const estimatedHeight = 70 + plotHeight + 38 + (cfg.show_day_buttons ? 52 : 0) + itemRows * 120;
    return Math.max(1, Math.ceil(estimatedHeight / 50));
  }

  getGridOptions() {
    return {
      columns: 12,
      rows: "auto",
      min_columns: 6,
      min_rows: 3,
    };
  }

  render() {
    return renderCard.call(this);
  }

  updated() {
    return updateCard.call(this);
  }

  _getDayCtx(runtimeCfg, st, timeZone) {
    const cached = this._lastDayCtx;
    const dayKey = startOfDayInTimeZone(new Date(), timeZone).getTime();
    const dayCtx = cached && cached.st === st && cached.cfg === runtimeCfg && cached.dayView === this._dayView && cached.timeZone === timeZone && cached.dayKey === dayKey
      ? cached.value
      : buildDayContext(runtimeCfg, st, this._dayView, timeZone);
    this._lastDayCtx = { st, cfg: runtimeCfg, dayView: this._dayView, timeZone, dayKey, value: dayCtx };
    return dayCtx;
  }

  _scheduleClockUpdate() {
    clearTimeout(this._clockTimer);
    this._clockTimer = setTimeout(() => {
      this._lastGraphSignature = null;
      this.requestUpdate();
      this._scheduleClockUpdate();
    }, millisecondsUntilNextMinute());
  }

  _buildGraphSignature(runtimeCfg, st, dayCtx, host, wrap, lang, timeZone) {
    const attrs = st?.attributes || {};
    const timeline = Array.isArray(attrs.data) ? attrs.data : [];
    const metricKeys = [
      "currency", "unit_of_measurement", "tomorrow_status", "timeline_status",
      "avg_today", "min_today", "max_today", "p20_today", "p70_today",
      "avg_tomorrow", "min_tomorrow", "max_tomorrow", "p20_tomorrow", "p70_tomorrow",
      "avg_today_tomorrow", "min_today_tomorrow", "max_today_tomorrow", "p20_today_tomorrow", "p70_today_tomorrow",
      "today_rows", "tomorrow_rows",
    ];
    const metrics = {};
    for (const key of metricKeys) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) metrics[key] = attrs[key];
    }
    const nowMinute = Math.floor(Date.now() / 60000);
    return JSON.stringify({
      cfg: runtimeCfg,
      dayView: dayCtx.dayView,
      twoDayMode: dayCtx.twoDayMode,
      dayStart: dayCtx.dayStart?.getTime?.() || null,
      dayHours: dayCtx.dayHours,
      firstDayHours: dayCtx.firstDayHours,
      showPending: dayCtx.showPending,
      thresholds: dayCtx.thresholds,
      timeline,
      metrics,
      width: Math.round(host?.clientWidth || wrap?.clientWidth || this.clientWidth || 0),
      measuredHeight: Math.round(host?.clientHeight || wrap?.clientHeight || 0),
      height: runtimeCfg.view_mode === "timeline" ? TIMELINE_CANVAS_HEIGHT : (Number(runtimeCfg.height) || 280),
      lang,
      timeZone,
      nowMinute,
    });
  }

  _setDayView(dayView) {
    const next = normalizeDayView(dayView);
    if (this._dayView === next) return;
    this._dayView = next;
    this._lastDayCtx = null;
    this._lastGraphSignature = null;
    this.requestUpdate();
  }

  _syncResizeObserver(...elements) {
    if (!window.ResizeObserver) return;
    const observed = elements.filter((el) => !!el);
    if (!observed.length) return;
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver((entries) => {
        let changed = false;
        for (const entry of entries) {
          const width = Math.round(entry.contentRect?.width || 0);
          const height = Math.round(entry.contentRect?.height || 0);
          const prev = this._observedSizes?.get(entry.target);
          if (!prev || prev.width !== width || prev.height !== height) {
            this._observedSizes.set(entry.target, { width, height });
            changed = true;
          }
        }
        if (changed) {
          this._lastGraphSignature = null;
          this.requestUpdate();
        }
      });
      this._observedElements = new Set();
      this._observedSizes = new WeakMap();
    }
    for (const el of observed) {
      if (this._observedElements.has(el)) continue;
      this._observedElements.add(el);
      this._resizeObserver.observe(el);
    }
    for (const el of [...this._observedElements]) {
      if (observed.includes(el)) continue;
      this._resizeObserver.unobserve(el);
      this._observedElements.delete(el);
    }
  }

  _disconnectResizeObserver() {
    if (!this._resizeObserver) return;
    this._resizeObserver.disconnect();
    this._resizeObserver = null;
    this._observedElements = null;
    this._observedSizes = null;
  }

  _unbindGraphPointer() {
    if (!this._boundWrap) return;
    this._boundWrap.removeEventListener("pointermove", this._onMove);
    this._boundWrap.removeEventListener("pointerleave", this._onLeave);
    this._boundWrap.removeEventListener("pointerdown", this._onDown);
    this._boundWrap.removeEventListener("pointerup", this._onUp);
    this._boundWrap.removeEventListener("pointercancel", this._onUp);
    this._boundWrap = null;
    this._boundSvg = null;
    this._onMove = null;
    this._onLeave = null;
    this._onDown = null;
    this._onUp = null;
  }

  _syncInfoLabelMarquee() {
    const labels = this.renderRoot?.querySelectorAll(".info-label") || [];
    labels.forEach((label) => {
      const text = label.querySelector(".info-label-text");
      if (!text) return;
      const overflow = Math.ceil((text.scrollWidth || 0) - (label.clientWidth || 0));
      if (overflow > 2) {
        label.classList.add("marquee");
        label.style.setProperty("--marquee-shift", `${overflow}px`);
        const duration = clamp(4 + overflow / 22, 4, 12);
        label.style.setProperty("--marquee-duration", `${duration}s`);
      } else {
        label.classList.remove("marquee");
        label.style.removeProperty("--marquee-shift");
        label.style.removeProperty("--marquee-duration");
      }
    });
  }

  _syncInfoValueFit() {
    const rows = this.renderRoot?.querySelectorAll(".info-value") || [];
    rows.forEach((row) => {
      const main = row.querySelector(".info-value-main");
      if (!main) return;
      const unit = row.querySelector(".info-value-unit");
      const rowWidth = Math.max(0, row.clientWidth - 2);
      if (!rowWidth) return;
      const fits = (sz) => {
        row.style.setProperty("--info-main-size", `${sz}px`);
        return (main.scrollWidth || 0) + (unit ? (unit.scrollWidth || 0) : 0) <= rowWidth;
      };
      if (fits(24)) return;
      let lo = 12, hi = 23;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        fits(mid) ? lo = mid : hi = mid - 1;
      }
      row.style.setProperty("--info-main-size", `${lo}px`);
    });
  }

  _hasActionConfig(action) {
    return !!(action && action.action && action.action !== "none");
  }

  _defaultAction(type) {
    return { action: type === "tap" ? "more-info" : "none" };
  }

  _getActionConfig(type) {
    const key = `${type}_action`;
    const targetKey = `${type}_action_target`;
    const entityKey = `${type}_action_entity`;
    const baseAction = this._config?.[key] || this._defaultAction(type);
    const target = this._config?.[targetKey];
    if (target === "other") {
      const entity = this._config?.[entityKey] || this._config?.entity;
      const cfg = { ...this._config, entity };
      return { action: baseAction, config: cfg };
    }
    return { action: baseAction, config: this._config };
  }

  _runAction(type) {
    if (!this.hass || !this._config) return;
    const { action, config } = this._getActionConfig(type);
    if (!this._hasActionConfig(action)) return;
    this._dispatchAction(config, type);
  }

  _dispatchAction(config, type) {
    const h = getHelpers();
    if (h?.handleAction) {
      h.handleAction(this, this.hass, config, type);
      return;
    }
    this.dispatchEvent(new CustomEvent("hass-action", {
      bubbles: true,
      composed: true,
      detail: { action: type, config },
    }));
  }

  _getSlotActionConfig(item, type) {
    const actions = item?.actions;
    if (!actions?.enabled) return { action: { action: "none" }, config: null };
    const action = actions[`${type}_action`] || this._defaultAction(type);
    const entity = (actions.use_target_entity ? actions.target_entity : "") || (item?.source === "entity" ? item.entity : "") || this._config?.entity;
    const actionKey = `${type}_action`;
    return {
      action,
      config: {
        ...this._config,
        entity,
        [actionKey]: action,
      },
    };
  }

  _runSlotAction(item, type) {
    if (!this.hass || !this._config) return;
    const { action, config } = this._getSlotActionConfig(item, type);
    if (!config || !this._hasActionConfig(action)) return;
    this._dispatchAction(config, type);
  }

  _onHeaderPointerDown() {
    clearTimeout(this._holdTimer);
    this._holdFired = false;
    const { action } = this._getActionConfig("hold");
    if (this._hasActionConfig(action)) {
      this._holdTimer = setTimeout(() => {
        this._holdFired = true;
        this._runAction("hold");
      }, 500);
    }
  }

  _onHeaderPointerUp() {
    clearTimeout(this._holdTimer);
  }

  _onHeaderPointerLeave() {
    clearTimeout(this._holdTimer);
  }

  _onHeaderClick() {
    if (this._holdFired) return;
    clearTimeout(this._tapTimer);
    this._tapTimer = setTimeout(() => {
      this._runAction("tap");
    }, 200);
  }

  _onHeaderDblClick() {
    clearTimeout(this._tapTimer);
    this._runAction("double_tap");
  }

  _onSlotPointerDown(item, ev) {
    if (!item?.actions?.enabled) return;
    ev?.stopPropagation?.();
    clearTimeout(this._slotHoldTimer);
    this._slotHoldFired = false;
    const { action } = this._getSlotActionConfig(item, "hold");
    if (this._hasActionConfig(action)) {
      this._slotHoldTimer = setTimeout(() => {
        this._slotHoldFired = true;
        this._runSlotAction(item, "hold");
      }, 500);
    }
  }

  _onSlotPointerUp(_item, ev) {
    ev?.stopPropagation?.();
    clearTimeout(this._slotHoldTimer);
  }

  _onSlotPointerLeave(_item, ev) {
    ev?.stopPropagation?.();
    clearTimeout(this._slotHoldTimer);
  }

  _onSlotClick(item, ev) {
    if (!item?.actions?.enabled) return;
    ev?.stopPropagation?.();
    if (this._slotHoldFired) return;
    clearTimeout(this._slotTapTimer);
    this._slotTapTimer = setTimeout(() => {
      this._runSlotAction(item, "tap");
    }, 200);
  }

  _onSlotDblClick(item, ev) {
    if (!item?.actions?.enabled) return;
    ev?.stopPropagation?.();
    clearTimeout(this._slotTapTimer);
    this._runSlotAction(item, "double_tap");
  }

  _onDayButtonPointerDown(ev) {
    const btn = ev.currentTarget;
    if (!btn) return;
    this._runDayButtonRipple(btn, ev);
  }

  _runDayButtonRipple(btn, ev) {
    const layer = btn.querySelector(".pg-btn-state");
    if (!layer) return;
    const rect = btn.getBoundingClientRect();
    const x = (ev.clientX ?? (rect.left + rect.width / 2)) - rect.left;
    const y = (ev.clientY ?? (rect.top + rect.height / 2)) - rect.top;
    layer.style.left = `${x}px`;
    layer.style.top = `${y}px`;
    layer.classList.remove("run");
    void layer.offsetWidth;
    layer.classList.add("run");
  }
}

if (!customElements.get(CARD_TAG)) customElements.define(CARD_TAG, PriceGraphCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TAG,
  name: "Price Graph Card",
  description: "Spot market electricity price step graph with auto thresholds.",
  version: VERSION,
});
