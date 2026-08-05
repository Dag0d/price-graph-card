import { html } from "lit";
import { DETAILED_COLOR_CONFIG, MAX_INFO_SLOTS } from "./const";
import { localize } from "./i18n";
import { normalizeHexColor } from "./graph";

export function renderEditorContent({
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
}) {
    const schema = [{ name: "entity", selector: { entity: {} } }];

    return html`
      <div class="wrap">
        <ha-form
          .hass=${hass}
          .data=${this._config}
          .schema=${schema}
          .computeLabel=${computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>

        ${this._renderPanel("mdi:eye-outline", localize("panel_content", lang), this._contentOpen, () => { this._contentOpen = !this._contentOpen; }, () => html`
              <div class="row">
                <ha-form
                  .hass=${hass}
                  .data=${this._config}
                  .schema=${[{
                    name: "view_mode",
                    selector: { select: { mode: "dropdown", options: [
                      { value: "graph", label: localize("view_mode_graph", lang) },
                      { value: "timeline", label: localize("view_mode_timeline", lang) },
                    ] } }
                  }]}
                  .computeLabel=${computeLabel}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>
              <div class="two-col">
                <div class="toggle-item">
                  <ha-switch
                    .checked=${!!this._config.show_day_buttons}
                    @change=${(e) => this._setToggle("show_day_buttons", e.target.checked)}
                  ></ha-switch>
                  <div class="toggle-label">${this._label("editor_show_day_buttons")}</div>
                </div>
                <ha-form
                  .hass=${hass}
                  .data=${this._config}
                  .schema=${[{
                    name: "day_view_default",
                    selector: { select: { mode: "dropdown", options: [
                      { value: "today", label: localize("label_today", lang) },
                      { value: "tomorrow", label: localize("label_tomorrow", lang) },
                      { value: "two_days", label: localize("label_two_days", lang) },
                    ] } }
                  }]}
                  .computeLabel=${computeLabel}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>
              <div class="row">
                <ha-form
                  .hass=${hass}
                  .data=${this._config}
                  .schema=${[{
                    name: "two_day_mode",
                    selector: { select: { mode: "dropdown", options: [
                      { value: "span", label: localize("two_day_mode_span", lang) },
                      { value: "overlay", label: localize("two_day_mode_overlay", lang) },
                    ] } }
                  }]}
                  .computeLabel=${computeLabel}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>
        `)}

        ${this._renderPanel("mdi:card-text-outline", localize("panel_header", lang), this._headerOpen, () => { this._headerOpen = !this._headerOpen; }, () => html`
              ${this._renderHeaderItemEditor({
                item: titleItemLeft,
                key: "title_item_left",
                title: localize("editor_header_title_left", lang),
                hass,
                lang,
              })}
              ${this._renderHeaderItemEditor({
                item: titleItemRight,
                key: "title_item_right",
                title: localize("editor_header_title_right", lang),
                hass,
                lang,
              })}
        `)}

        ${this._renderPanel("mdi:cash-multiple", localize("panel_units", lang), this._unitsOpen, () => { this._unitsOpen = !this._unitsOpen; }, () => html`
              <div class="panel-subsection is-first">
                <div class="panel-subtitle">${localize("content_section_display", lang)}</div>
                <div class="full-row">
                  <ha-form
                    .hass=${hass}
                    .data=${this._config}
                    .schema=${[
                      { name: "decimals", selector: { number: { min: 0, max: 4, step: 1, mode: "box" } } },
                    ]}
                    .computeLabel=${computeLabel}
                    @value-changed=${this._valueChanged}
                  ></ha-form>
                </div>
              </div>

              <div class="panel-subsection">
                <div class="panel-subtitle">${localize("content_section_units", lang)}</div>
                <div class="full-row">
                  <ha-form
                    .hass=${hass}
                    .data=${this._config}
                    .schema=${[{
                      name: "unit_format",
                      selector: { select: { mode: "dropdown", options: [
                        { value: "currency", label: `${currencyLabel}/kWh` },
                        ...(minorLabel ? [{ value: "minor", label: `${minorLabel}/kWh` }] : []),
                      ] } }
                    }]}
                    .computeLabel=${computeLabel}
                    @value-changed=${this._valueChanged}
                  ></ha-form>
                </div>

                <div class="two-col threshold-row">
                  <div class="toggle-item threshold-toggle">
                    <ha-switch
                      .checked=${!!this._config.show_currency_override}
                      @change=${(e) => this._setToggle("show_currency_override", e.target.checked)}
                    ></ha-switch>
                    <div class="toggle-label">${this._label("editor_show_currency_override")}</div>
                  </div>
                  <div class=${this._config.show_currency_override ? "" : "form-disabled"}>
                    <ha-form
                      .hass=${hass}
                      .data=${{ ...this._config, currency_override: this._config.currency_override || "auto" }}
                      .schema=${[{
                        name: "currency_override",
                        selector: { select: { mode: "dropdown", options: currencyOverrideOptions } }
                      }]}
                      .computeLabel=${computeLabel}
                      @value-changed=${this._valueChanged}
                    ></ha-form>
                  </div>
                </div>

                ${(showCustomCurrency || showMinorLabel || showFactor) ? html`
                  <div class="two-col">
                    ${showCustomCurrency ? html`
                      <ha-textfield
                        label="${localize("editor_currency_custom", lang)}"
                        .value=${String(this._config.currency_custom ?? "")}
                        @input=${(e) => {
                          this._commit({ ...this._config, currency_custom: e.target.value });
                        }}
                      ></ha-textfield>
                    ` : html``}
                    ${showMinorLabel ? html`
                      <ha-textfield
                        label="${localize("editor_minor_label", lang)}"
                        .value=${String(this._config.minor_label ?? "")}
                        @input=${(e) => {
                          this._commit({ ...this._config, minor_label: e.target.value });
                        }}
                      ></ha-textfield>
                    ` : html``}
                    ${showFactor ? html`
                      <ha-textfield
                        label="${localize("editor_unit_factor", lang)}"
                        type="number"
                        step="1"
                        .value=${String(this._config.unit_factor ?? "")}
                        @input=${this._onFactorChanged}
                      ></ha-textfield>
                    ` : html``}
                  </div>
                  ${showFactor ? html`<div class="hint">${localize("unit_factor_hint", lang, { currency: effectiveCurrency || "?" })}</div>` : html``}
                ` : ""}
              </div>

              <div class="panel-subsection">
                <div class="panel-subtitle">${localize("content_section_detailed_colors", lang)}</div>
                <div class="toggle-item">
                  <ha-switch
                    .checked=${!!this._config.detailed_colors}
                    @change=${(e) => this._setToggle("detailed_colors", e.target.checked)}
                  ></ha-switch>
                  <div class="toggle-label">${this._label("editor_detailed_colors")}</div>
                </div>
              </div>

              ${this._config.detailed_colors ? html`
                <div class="panel-subsection">
                  <div class="panel-subtitle">${localize("content_section_thresholds", lang)}</div>
                  ${this._renderFixedThresholdRow({
                    enabledKey: "use_fixed_p20",
                    valueKey: "fixed_p20_value",
                    labelKey: "editor_fixed_p20_value",
                    placeholderValue: thresholdHints.p20,
                  })}
                  ${this._renderFixedThresholdRow({
                    enabledKey: "use_fixed_avg",
                    valueKey: "fixed_avg_value",
                    labelKey: "editor_fixed_avg_value",
                    placeholderValue: thresholdHints.avg,
                  })}
                  ${this._renderFixedThresholdRow({
                    enabledKey: "use_fixed_expensive",
                    valueKey: "fixed_expensive_value",
                    labelKey: "editor_fixed_expensive_value",
                    placeholderValue: thresholdHints.p70,
                  })}
                </div>
              ` : html``}
        `)}

        ${this._renderPanel("mdi:view-grid-plus", `${localize("panel_extra_slots", lang)} (${infoItems.length}/${MAX_INFO_SLOTS})`, this._extraSlotsOpen, () => { this._extraSlotsOpen = !this._extraSlotsOpen; }, () => html`
              <div class="row">
                <ha-form
                  .hass=${hass}
                  .data=${this._config}
                  .schema=${[{
                    name: "content_items_position",
                    selector: { select: { mode: "dropdown", options: [
                      { value: "top", label: localize("content_items_position_top", lang) },
                      { value: "bottom", label: localize("content_items_position_bottom", lang) },
                    ] } }
                  }]}
                  .computeLabel=${computeLabel}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>
              <div class="row">
                <ha-form
                  .hass=${hass}
                  .data=${this._config}
                  .schema=${[{
                    name: "content_items_max_cols",
                    selector: { select: { mode: "dropdown", options: [
                      { value: 4, label: "4" },
                      { value: 3, label: "3" },
                    ] } }
                  }]}
                  .computeLabel=${computeLabel}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>

              ${infoItems.map((item, i) => {
                const idx = i;
                const slotTitle = `${localize("editor_content_grid_slot", lang)} ${i + 1}`;
                return this._renderSlotEditor({
                  item,
                  index: idx,
                  title: slotTitle,
                  hass,
                  lang,
                  sourceOptions,
                  wrapped: true,
                  showRemove: true,
                });
              })}

              ${infoItems.length < MAX_INFO_SLOTS ? html`
                <div class="row">
                  <ha-button appearance="filled" size="small" variant="brand" @click=${this._addContentSlot.bind(this)}>
                    <ha-icon slot="start" icon="mdi:plus"></ha-icon>
                    ${localize("editor_content_add_slot", lang)}
                  </ha-button>
                </div>
              ` : html``}
        `)}

        ${this._renderPanel("mdi:chart-line-variant", localize("panel_graph", lang), this._graphOpen, () => { this._graphOpen = !this._graphOpen; }, () => html`
              <ha-form
                .hass=${hass}
                .data=${this._config}
                .schema=${[
                  { name: "height", selector: { number: { min: 160, max: 600, step: 10, mode: "box" } } },
                ]}
                .computeLabel=${computeLabel}
                @value-changed=${this._valueChanged}
              ></ha-form>

              <div class="two-col">
                <div class="toggle-item">
                  <ha-switch
                    .checked=${!!this._config.show_now_line}
                    @change=${(e) => this._setToggle("show_now_line", e.target.checked)}
                  ></ha-switch>
                  <div class="toggle-label">${this._label("editor_show_now_line")}</div>
                </div>
                <div class="toggle-item">
                  <ha-switch
                    .checked=${!!this._config.show_hover_line}
                    @change=${(e) => this._setToggle("show_hover_line", e.target.checked)}
                  ></ha-switch>
                  <div class="toggle-label">${this._label("editor_show_hover_line")}</div>
                </div>
              </div>

        `)}

        ${this._renderPanel("mdi:gesture-tap", localize("panel_actions", lang), this._actionsOpen, () => { this._actionsOpen = !this._actionsOpen; }, () => html`
              <ha-form
                .hass=${hass}
                .data=${this._config}
                .schema=${[
                  { name: "tap_action", selector: { ui_action: { default_action: "more-info" } } },
                  {
                    name: "",
                    type: "optional_actions",
                    flatten: true,
                    schema: ["hold_action", "double_tap_action"].map((name) => ({
                      name,
                      selector: { ui_action: { default_action: "none" } },
                    })),
                  },
                ]}
                .computeLabel=${computeLabel}
                @value-changed=${this._valueChanged}
              ></ha-form>

              ${this._renderOtherEntityAction({
                actionKey: "tap_action",
                targetKey: "tap_action_target",
                entityKey: "tap_action_entity",
                labelKey: "editor_action_other_entity_tap",
                hass,
                lang,
              })}
              ${this._renderOtherEntityAction({
                actionKey: "hold_action",
                targetKey: "hold_action_target",
                entityKey: "hold_action_entity",
                labelKey: "editor_action_other_entity_hold",
                hass,
                lang,
              })}
              ${this._renderOtherEntityAction({
                actionKey: "double_tap_action",
                targetKey: "double_tap_action_target",
                entityKey: "double_tap_action_entity",
                labelKey: "editor_action_other_entity_double",
                hass,
                lang,
              })}
        `)}

        ${this._config.detailed_colors ? html`
          ${this._renderPanel("mdi:palette", this._label("editor_colors_toggle"), this._colorsOpen, () => { this._colorsOpen = !this._colorsOpen; }, () => html`
                <div class="color-grid">
                  ${DETAILED_COLOR_CONFIG.map(({ key, label, fallback }) => html`
                    <div>
                      <div class="color-label">${this._label(label)}</div>
                      <div class="color-item">
                        <div class="color-swatch">
                          <input type="color" .value=${normalizeHexColor(this._config[key], fallback)} @input=${(e) => this._setColor(key, e.target.value)} />
                        </div>
                        <ha-textfield
                          label="#"
                          .value=${normalizeHexColor(this._config[key], fallback)}
                          @input=${(e) => this._setColor(key, e.target.value)}
                        ></ha-textfield>
                      </div>
                    </div>
                  `)}
                </div>
          `)}
        ` : html``}
      </div>
    `;
  
}
