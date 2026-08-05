import { html, nothing } from "lit";
import { DETAILED_COLOR_CONFIG, GEAR_ICON_PATH, SIMPLE_HIGH_COLOR, SIMPLE_LOW_COLOR, TIMELINE_CANVAS_HEIGHT } from "./const";
import { normalizeContentItems, normalizeHeaderItem } from "./config";
import { getContentItemValue } from "./card-content";
import { CARD_CSS } from "./card-styles";
import { formatDisplayValue, roundTo } from "./format";
import { normalizeColor, zoneColor, zoneLabel } from "./graph";
import { getLang, localize } from "./i18n";
import { buildCurrentTodayContext, getDayPriceMetricText, getRangeDayLabel } from "./pricing";
import { resolveRuntimeConfig } from "./runtime-config";
import { getHaTimeZone } from "./time";
import { formatUnitByMode, getDisplayUnit } from "./units";

export function renderCard() {
    if (!this._config) return html``;

    const cfg = this._config;
    const hass = this.hass;
    const lang = getLang(hass);
    const timeZone = getHaTimeZone(hass);
    const titleItemLeft = normalizeHeaderItem(cfg.title_item_left, "title", "");
    const titleItemRight = normalizeHeaderItem(cfg.title_item_right, "attribute", "");
    const titleText = titleItemLeft.label || "";
    const contentItems = normalizeContentItems(cfg.content_items);
    const infoItems = contentItems;
    const plotHeight = cfg.view_mode === "timeline" ? TIMELINE_CANVAS_HEIGHT : (Number(cfg.height) || 280);

    if (!hass) {
      return html`
        <ha-card>
          <div class="header">${titleText}</div>
          <div class="content">
            <div style="padding:8px;color:var(--secondary-text-color)">${localize("waiting_ha", lang)}</div>
          </div>
        </ha-card>
      `;
    }

    const st = hass.states?.[cfg.entity];
    if (!st) {
      return html`
        <ha-card>
          <div class="header">${titleText}</div>
          <div class="content">
            <div style="padding:8px;color:var(--error-color)">${localize("entity_not_found", lang)}</div>
          </div>
        </ha-card>
      `;
    }

    const runtimeCfg = resolveRuntimeConfig(cfg, this._dayView);
    const dayCtx = this._getDayCtx(runtimeCfg, st, timeZone);
    const {
      timelineAll,
      dayView,
      currency,
      dayPoints,
      thresholds,
      scaled,
      debugPointsCount,
      showPending,
    } = dayCtx;
    if (!dayPoints.length && !showPending) {
      return html`
        <ha-card>
          <div class="header">${titleText}</div>
          <div class="content">
            <div style="padding:8px;color:var(--secondary-text-color)">
              ${localize("no_data", lang)}
            </div>
          </div>
        </ha-card>
      `;
    }

    const debugOverlay = cfg.debug ? html`
      <div style="margin-top:8px;font-size:12px;opacity:.85">
        <div><b>${localize("debug", lang)}</b> — ${localize("points", lang)}: ${debugPointsCount}, ${localize("currency", lang)}: ${currency || "?"}, ${localize("factor", lang)}: ${scaled.factor}</div>
        <div>p20: ${roundTo(thresholds.p20, 2)}, avg: ${roundTo(thresholds.avg, 2)}, p70: ${roundTo(thresholds.p70, 2)}</div>
      </div>
    ` : html``;

    const nowCtx = buildCurrentTodayContext(cfg, st.attributes, timelineAll, timeZone);
    const currentPoint = nowCtx.currentPoint;
    const currentThresholds = nowCtx.thresholds || thresholds;
    const currentWindow = nowCtx.currentWindow || "";
    const resolveItemData = (it, target = "header") => {
      if (!it) return null;
      if (it.source === "title") {
        if (target !== "header") return null;
        const value = it.label || "";
        return value ? { variant: "single", label: "", value, color: null } : null;
      }
      if (it.source === "price_level") {
        if (!currentPoint) return null;
        const value = zoneLabel(currentPoint.price, currentThresholds, lang);
        const configuredColor = it.use_color ? zoneColor(cfg, currentPoint.price, currentThresholds) : null;
        if (target === "header") {
          const label = it.label || localize("header_price_level_default", lang);
          return { variant: "metric", top: label, main: value, color: configuredColor };
        }
        return {
          variant: "info",
          label: it.label || localize("content_price_level_label", lang),
          value,
          color: configuredColor || "var(--primary-text-color)",
          item: it,
        };
      }
      if (it.source === "current_price") {
        if (!currentPoint) return null;
        const unit = formatUnitByMode(getDisplayUnit(cfg, st.attributes, lang), it.unit_display_mode);
        const value = formatDisplayValue(currentPoint.price, cfg.decimals);
        if (target === "header") {
          const top = it.time_overwrite && it.label ? it.label : currentWindow;
          return { variant: "price", top, main: value, unit: it.show_unit ? unit : "", color: null };
        }
        return {
          variant: "info",
          label: it.label || localize("content_current_price_label", lang),
          value,
          unit: it.show_unit && unit ? unit : "",
          color: null,
          item: it,
        };
      }
      if (it.source === "price_range" || it.source === "avg_price") {
        const isRange = it.source === "price_range";
        const label = it.label || `${localize(isRange ? "content_price_range_label" : "content_avg_price_label", lang)} ${getRangeDayLabel(it.range_day, lang, dayView)}`;
        const unit = it.show_unit ? formatUnitByMode(getDisplayUnit(cfg, st.attributes, lang), it.unit_display_mode) : "";
        const value = getDayPriceMetricText(cfg, st.attributes, lang, it.range_day, isRange ? "range" : "avg", dayView, false, it.unit_display_mode, timeZone);
        if (target === "header") {
          return { variant: "metric", top: label, main: `${value}${unit ? ` ${unit}` : ""}`, color: null };
        }
        return { variant: "info", label, value, unit, color: null, item: it };
      }
      const v = getContentItemValue(it, hass, st, cfg.decimals, cfg);
      if (!v) return null;
      const isMissing = v.value === "—" || v.value === "";
      if (target === "header" && !it.label && isMissing) return null;
      if (target !== "header" && !it.label && !it.attribute && !it.entity && isMissing) return null;
      const value = `${v.value}${it.show_unit && v.unit ? ` ${v.unit}` : ""}`;
      if (target === "header" && (it.source === "entity" || it.source === "attribute")) {
        return { variant: "metric", top: it.label || "", main: value, color: null };
      }
      return { variant: "info", label: it.label || "", value: v.value, unit: it.show_unit ? v.unit : "", color: null, item: it };
    };
    const renderHeaderItem = (it, className) => {
      const data = resolveItemData(it, "header");
      if (!data) return html``;
      if (data.variant === "metric") {
        return html`
          <div class="${className}">
            <div class="header-metric">
              <div class="header-metric-top">${data.top || "\u00A0"}</div>
              <div class="header-metric-main" style=${data.color ? `color:${data.color}` : ""}>${data.main}</div>
            </div>
          </div>
        `;
      }
      if (data.variant === "price") {
        return html`
          <div class="${className}">
            <div class="header-metric">
              <div class="header-metric-top">${data.top || "\u00A0"}</div>
              <div class="header-price-main">
                ${data.main}
                ${data.unit ? html`<span class="header-metric-unit"> ${data.unit}</span>` : html``}
              </div>
            </div>
          </div>
        `;
      }
      return html`
        <div class="${className}">
          ${data.label ? `${data.label}: ` : ""}${data.color ? html`<span style="color:${data.color}">${data.value}</span>` : data.value}
        </div>
      `;
    };
    const renderInfoData = (data) => {
      const hasActions = !!data.item?.actions?.enabled;
      return html`
        <div class="info-item ${hasActions ? "has-action" : ""}"
          role=${hasActions ? "button" : nothing}
          tabindex=${hasActions ? "0" : nothing}
          @pointerdown=${(ev) => this._onSlotPointerDown(data.item, ev)}
          @pointerup=${(ev) => this._onSlotPointerUp(data.item, ev)}
          @pointerleave=${(ev) => this._onSlotPointerLeave(data.item, ev)}
          @click=${(ev) => this._onSlotClick(data.item, ev)}
          @dblclick=${(ev) => this._onSlotDblClick(data.item, ev)}
        >
          <div class="info-value" style=${data.color ? `color:${data.color}` : ""}>
            <span class="info-value-inline">
              <span class="info-value-main">${data.value}</span>${data.unit ? html`<span class="info-value-unit"> ${data.unit}</span>` : html``}
            </span>
          </div>
          <div class="info-label" title=${data.label || ""}>
            <span class="info-label-text">${data.label || "\u00A0"}</span>
          </div>
        </div>
      `;
    };
    const infoDataItems = infoItems.map((it) => resolveItemData(it, "info")).filter((it) => !!it);
    const infoPosition = cfg.content_items_position === "bottom" ? "bottom" : "top";
    const topInfoItems = infoPosition === "top" ? infoDataItems : [];
    const bottomInfoItems = infoPosition === "bottom" ? infoDataItems : [];
    const hasTopInfoItems = topInfoItems.length > 0;

    const colorItems = cfg.detailed_colors
      ? DETAILED_COLOR_CONFIG.map(({ key, label, fallback }) => ({
          color: normalizeColor(cfg[key], fallback),
          label,
        }))
      : [
          { color: SIMPLE_LOW_COLOR, label: "region_below_avg" },
          { color: SIMPLE_HIGH_COLOR, label: "region_above_avg" },
        ];

    return html`
      <style>${CARD_CSS}</style>
      <ha-card>
        <div class="header"
          role="button"
          tabindex="0"
          @pointerdown=${this._onHeaderPointerDown}
          @pointerup=${this._onHeaderPointerUp}
          @pointerleave=${this._onHeaderPointerLeave}
          @click=${this._onHeaderClick}
          @dblclick=${this._onHeaderDblClick}
        >
          ${renderHeaderItem(titleItemLeft, "header-item")}
          ${renderHeaderItem(titleItemRight, "header-item header-item-right")}
        </div>
        <div class="content ${hasTopInfoItems ? "has-info" : "no-info"}">
          ${hasTopInfoItems ? html`
            <div class="info-grid top">
              ${topInfoItems.map((it) => renderInfoData(it))}
            </div>
          ` : html``}
          <div class="pg-wrap"
            role="button"
            tabindex="0"
            @pointerdown=${this._onHeaderPointerDown}
            @pointerup=${this._onHeaderPointerUp}
            @pointerleave=${this._onHeaderPointerLeave}
            @click=${this._onHeaderClick}
            @dblclick=${this._onHeaderDblClick}
          >
            <div class="pg-tooltip" id="pg-tooltip"></div>
            <div id="pg-svg-host" style="height:${plotHeight}px"></div>
            ${showPending ? html`
              <div class="pg-empty ${runtimeCfg.view_mode === "timeline" ? "is-timeline" : ""}">
                <div class="pg-empty-card">
                  <svg class="pg-empty-gears" viewBox="0 0 64 44" aria-hidden="true">
                    <g class="pg-empty-gear-lg">
                      <g transform="translate(8 12) scale(0.92)">
                        <path fill="currentColor" d="${GEAR_ICON_PATH}"></path>
                      </g>
                    </g>
                    <g class="pg-empty-gear-sm-a">
                      <g transform="translate(30 8) scale(0.56)">
                        <path fill="currentColor" d="${GEAR_ICON_PATH}"></path>
                      </g>
                    </g>
                    <g class="pg-empty-gear-sm-b">
                      <g transform="translate(38 22) scale(0.48)">
                        <path fill="currentColor" d="${GEAR_ICON_PATH}"></path>
                      </g>
                    </g>
                  </svg>
                  <div class="pg-empty-text">${localize("tomorrow_pending", lang)}</div>
                </div>
              </div>
            ` : html``}
          </div>
          <div class="pg-legend ${cfg.view_mode === "timeline" ? "is-timeline" : ""}">
            ${colorItems.map(item => html`
              <div class="pg-legend-item">
                <span class="pg-legend-dot" style="background:${item.color}"></span>
                <span>${localize(item.label, lang)}</span>
              </div>
            `)}
            ${(cfg.view_mode === "graph" && this._dayView === "two_days" && (runtimeCfg.two_day_mode || "span") === "overlay") ? html`
              <div class="pg-legend-item">
                <span class="pg-legend-dot" style="background:rgba(120,120,120,0.6)"></span>
                <span>${localize("label_tomorrow", lang)}</span>
              </div>
            ` : html``}
          </div>
          ${cfg.show_day_buttons ? html`
            <div class="pg-buttons day-${this._dayView}">
              <button class="pg-btn ${this._dayView === "today" ? "active" : ""}" data-day-view="today" @pointerdown=${(ev) => this._onDayButtonPointerDown(ev)} @click=${() => this._setDayView("today")}>
                ${localize("label_today", lang)}
                <span class="pg-btn-state"></span>
              </button>
              <button class="pg-btn ${this._dayView === "tomorrow" ? "active" : ""}" data-day-view="tomorrow" @pointerdown=${(ev) => this._onDayButtonPointerDown(ev)} @click=${() => this._setDayView("tomorrow")}>
                ${localize("label_tomorrow", lang)}
                <span class="pg-btn-state"></span>
              </button>
              <button class="pg-btn ${this._dayView === "two_days" ? "active" : ""}" data-day-view="two_days" @pointerdown=${(ev) => this._onDayButtonPointerDown(ev)} @click=${() => this._setDayView("two_days")}>
                ${localize("label_two_days", lang)}
                <span class="pg-btn-state"></span>
              </button>
              <div class="pg-buttons-indicator"></div>
            </div>
          ` : html``}
          ${bottomInfoItems.length ? html`
            <div class="info-grid bottom">
              ${bottomInfoItems.map((it) => renderInfoData(it))}
            </div>
          ` : html``}
          ${debugOverlay}
        </div>
      </ha-card>
    `;
  
}
