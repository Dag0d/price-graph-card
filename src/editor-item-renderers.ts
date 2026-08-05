import { html } from "lit";
import { localize } from "./i18n";

function normalizeSlotActions(actions) {
  const enabled = !!actions?.enabled;
  return {
    enabled,
    tap_action: actions?.tap_action || { action: "more-info" },
    hold_action: actions?.hold_action || { action: "none" },
    double_tap_action: actions?.double_tap_action || { action: "none" },
    use_target_entity: !!actions?.use_target_entity || !!actions?.target_entity,
    target_entity: actions?.target_entity || "",
  };
}

function renderSlotActions({ item, index, hass, lang, onPatch, onEnableTargetEntity }) {
  const actions = normalizeSlotActions(item.actions);
  const updateActions = (patch) => onPatch({ actions: { ...actions, ...patch } });
  const enableTargetEntity = (ev) => {
    ev?.preventDefault?.();
    ev?.stopPropagation?.();
    onEnableTargetEntity();
  };
  const actionData = {
    tap_action: actions.tap_action,
    ...(actions.hold_action?.action && actions.hold_action.action !== "none" ? { hold_action: actions.hold_action } : {}),
    ...(actions.double_tap_action?.action && actions.double_tap_action.action !== "none" ? { double_tap_action: actions.double_tap_action } : {}),
  };
  const labelForAction = (entry) => {
    const labels = {
      tap_action: "editor_tap_action",
      hold_action: "editor_hold_action",
      double_tap_action: "editor_double_tap_action",
      target_entity: "editor_slot_action_target_entity",
    };
    return localize(labels[entry.name] || entry.name, lang);
  };
  const targetEntityEditor = actions.use_target_entity ? html`
    <div class="two-col slot-action-target-row">
      <div class="toggle-item">
        <ha-switch
          .checked=${actions.use_target_entity}
          @change=${(e) => updateActions({
            use_target_entity: e.target.checked,
            target_entity: e.target.checked ? actions.target_entity : "",
          })}
        ></ha-switch>
        <div class="toggle-label">${localize("editor_slot_action_other_entity", lang)}</div>
      </div>
      <ha-form
        .hass=${hass}
        .data=${{ target_entity: actions.target_entity }}
        .schema=${[{ name: "target_entity", selector: { entity: {} } }]}
        .computeLabel=${labelForAction}
        @value-changed=${(e) => updateActions(e.detail.value)}
      ></ha-form>
    </div>
  ` : html`
    <div class="row">
      <button class="editor-pill-button" type="button" .onclick=${enableTargetEntity} .onpointerup=${enableTargetEntity}>
        <ha-icon icon="mdi:plus"></ha-icon>
        ${localize("editor_slot_action_add_target_entity", lang)}
      </button>
    </div>
  `;
  return html`
    <div class="slot-actions">
      <div class="toggle-item">
        <ha-switch
          .checked=${actions.enabled}
          @change=${(e) => updateActions({ enabled: e.target.checked })}
        ></ha-switch>
        <div class="toggle-label">${localize("editor_slot_actions_enabled", lang)}</div>
      </div>
      ${actions.enabled ? html`
        <div class="slot-actions-body">
          <ha-form
            .hass=${hass}
            .data=${actionData}
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
            .computeLabel=${labelForAction}
            @value-changed=${(e) => updateActions(e.detail.value)}
          ></ha-form>
          ${targetEntityEditor}
        </div>
      ` : html``}
    </div>
  `;
}

export function renderItemSourceFields({ item, hass, lang, onPatch, mode = "content" }) {
    if (item.source === "title") return html``;
    if (item.source === "price_level") {
      return html`
        <div class="two-col">
          <div class="toggle-item">
            <ha-switch
              .checked=${!!item.use_color}
              @change=${(e) => onPatch({ use_color: e.target.checked })}
            ></ha-switch>
            <div class="toggle-label">${localize("editor_content_use_color", lang)}</div>
          </div>
          <div></div>
        </div>
      `;
    }
    if (item.source === "price_range" || item.source === "avg_price") {
      return html`
        <div class="row">
          <ha-form
            .hass=${hass}
            .data=${{ range_day: item.range_day || "today" }}
            .schema=${[{
              name: "range_day",
              selector: { select: { mode: "dropdown", options: this._priceRangeDayOptions(lang) } },
            }]}
            .computeLabel=${() => localize("editor_price_range_day", lang)}
            @value-changed=${(e) => onPatch({ range_day: e.detail.value.range_day })}
          ></ha-form>
        </div>
        <div class="two-col">
          <div class="toggle-item">
            <ha-switch
              .checked=${item.show_unit !== false}
              @change=${(e) => onPatch({ show_unit: e.target.checked })}
            ></ha-switch>
            <div class="toggle-label">${localize("editor_content_show_unit", lang)}</div>
          </div>
          ${item.show_unit !== false ? html`
            <ha-form
              .hass=${hass}
              .data=${{ unit_display_mode: item.unit_display_mode || "per_kwh" }}
              .schema=${[{
                name: "unit_display_mode",
                selector: { select: { mode: "dropdown", options: this._itemUnitDisplayOptions(lang) } },
              }]}
              .computeLabel=${() => localize("editor_unit_display_mode", lang)}
              @value-changed=${(e) => onPatch({ unit_display_mode: e.detail.value.unit_display_mode })}
            ></ha-form>
          ` : html`<div></div>`}
        </div>
      `;
    }
    if (mode === "header" && item.source === "current_price") {
      return html`
        <div class="two-col">
          <div class="toggle-item">
            <ha-switch
              .checked=${!!item.time_overwrite}
              @change=${(e) => onPatch({ time_overwrite: e.target.checked })}
            ></ha-switch>
            <div class="toggle-label">${localize("editor_current_price_time_overwrite", lang)}</div>
          </div>
          <div class="toggle-item">
            <ha-switch
              .checked=${item.show_unit !== false}
              @change=${(e) => onPatch({ show_unit: e.target.checked })}
            ></ha-switch>
            <div class="toggle-label">${localize("editor_content_show_unit", lang)}</div>
          </div>
        </div>
        <div class="two-col">
          <div></div>
          ${item.show_unit !== false ? html`
            <ha-form
              .hass=${hass}
              .data=${{ unit_display_mode: item.unit_display_mode || "per_kwh" }}
              .schema=${[{
                name: "unit_display_mode",
                selector: { select: { mode: "dropdown", options: this._itemUnitDisplayOptions(lang) } },
              }]}
              .computeLabel=${() => localize("editor_unit_display_mode", lang)}
              @value-changed=${(e) => onPatch({ unit_display_mode: e.detail.value.unit_display_mode })}
            ></ha-form>
          ` : html`<div></div>`}
        </div>
      `;
    }
    if (item.source === "current_price") {
      return html`
        <div class="two-col">
          <div></div>
          <div class="toggle-item">
            <ha-switch
              .checked=${item.show_unit !== false}
              @change=${(e) => onPatch({ show_unit: e.target.checked })}
            ></ha-switch>
            <div class="toggle-label">${localize("editor_content_show_unit", lang)}</div>
          </div>
        </div>
        <div class="two-col">
          <div></div>
          ${item.show_unit !== false ? html`
            <ha-form
              .hass=${hass}
              .data=${{ unit_display_mode: item.unit_display_mode || "per_kwh" }}
              .schema=${[{
                name: "unit_display_mode",
                selector: { select: { mode: "dropdown", options: this._itemUnitDisplayOptions(lang) } },
              }]}
              .computeLabel=${() => localize("editor_unit_display_mode", lang)}
              @value-changed=${(e) => onPatch({ unit_display_mode: e.detail.value.unit_display_mode })}
            ></ha-form>
          ` : html`<div></div>`}
        </div>
      `;
    }
    return html`
      <div class="two-col">
        ${item.source === "entity" ? html`
          <ha-form
            .hass=${hass}
            .data=${{ entity: item.entity || "" }}
            .schema=${[{ name: "entity", selector: { entity: {} } }]}
            .computeLabel=${() => localize("editor_content_entity", lang)}
            @value-changed=${(e) => onPatch({ entity: e.detail.value.entity })}
          ></ha-form>
        ` : item.source === "current_price" ? html`
          <div></div>
        ` : html`
          <ha-textfield
            label="${localize("editor_content_attribute", lang)}"
            .value=${item.attribute || ""}
            @input=${(e) => onPatch({ attribute: e.target.value })}
          ></ha-textfield>
        `}
        <div class="toggle-item">
          <ha-switch
            .checked=${item.show_unit !== false}
            @change=${(e) => onPatch({ show_unit: e.target.checked })}
          ></ha-switch>
          <div class="toggle-label">${localize("editor_content_show_unit", lang)}</div>
        </div>
      </div>
      ${item.source === "attribute" ? html`
        <div class="two-col">
          <div></div>
          ${item.show_unit !== false ? html`
            <ha-form
              .hass=${hass}
              .data=${{ unit_display_mode: item.unit_display_mode || "per_kwh" }}
              .schema=${[{
                name: "unit_display_mode",
                selector: { select: { mode: "dropdown", options: this._itemUnitDisplayOptions(lang) } },
              }]}
              .computeLabel=${() => localize("editor_unit_display_mode", lang)}
              @value-changed=${(e) => onPatch({ unit_display_mode: e.detail.value.unit_display_mode })}
            ></ha-form>
          ` : html`<div></div>`}
        </div>
      ` : html``}
    `;
  }



export function renderItemEditor({
    item,
    title,
    hass,
    lang,
    sourceOptions,
    sourceFallback = "attribute",
    onPatch,
    mode = "content",
    wrapped = true,
    showRemove = false,
    onRemove = null,
    hideLabelWhenCurrentPrice = false,
  }) {
    const body = html`
      ${title ? html`<div class="slot-card-title">${title}</div>` : html``}
      <div class="two-col">
        ${hideLabelWhenCurrentPrice && item.source === "current_price" && !item.time_overwrite ? html`<div></div>` : html`
          <ha-textfield
            label="${localize("editor_content_label", lang)}"
            .value=${item.label || ""}
            @input=${(e) => onPatch({ label: e.target.value })}
          ></ha-textfield>
        `}
        <ha-form
          .hass=${hass}
          .data=${{ source: item.source || sourceFallback }}
          .schema=${[{
            name: "source",
            selector: { select: { mode: "dropdown", options: sourceOptions } },
          }]}
          .computeLabel=${() => localize("editor_content_source", lang)}
          @value-changed=${(e) => onPatch({ source: e.detail.value.source })}
        ></ha-form>
      </div>
      ${this._renderItemSourceFields({ item, hass, lang, onPatch, mode })}
      ${showRemove && onRemove ? html`
        <div class="row">
          <ha-button appearance="plain" @click=${onRemove}>
            ${localize("editor_content_remove_slot", lang)}
          </ha-button>
        </div>
      ` : html``}
    `;
    return wrapped ? html`<div class="slot-card">${body}</div>` : body;
  }



export function renderHeaderItemEditor({ item, key, title, hass, lang }) {
    const defaultSource = this._headerDefaultSource(key);
    const onPatch = (patch) => this._updateHeaderItem(key, patch, defaultSource);
    return this._renderItemEditor({
      item,
      title,
      hass,
      lang,
      sourceOptions: this._headerSourceOptions(lang),
      sourceFallback: defaultSource,
      onPatch,
      mode: "header",
      wrapped: true,
      showRemove: false,
      hideLabelWhenCurrentPrice: true,
    });
  }



export function renderSlotEditor({ item, index, title, hass, lang, sourceOptions, wrapped = true, showRemove = true }) {
    const options = sourceOptions || this._contentSourceOptions(lang);
    const onPatch = (patch) => this._updateContentItem(index, patch);
    const body = html`
      ${this._renderItemEditor({
      item,
      title,
      hass,
      lang,
      sourceOptions: options,
      sourceFallback: "attribute",
      onPatch,
      mode: "content",
      showRemove,
      onRemove: () => this._removeContentSlot(index),
      hideLabelWhenCurrentPrice: false,
      wrapped: false,
    })}
      ${renderSlotActions({
        item,
        index,
        hass,
        lang,
        onPatch,
        onEnableTargetEntity: () => this._enableContentItemTargetEntity(index),
      })}
    `;
    return wrapped ? html`<div class="slot-card">${body}</div>` : body;
  }



export function renderOtherEntityAction({ actionKey, targetKey, entityKey, labelKey, hass, lang }) {
    const action = this._config?.[actionKey];
    const isTapAction = actionKey === "tap_action";
    if (!isTapAction && (!action?.action || action.action === "none")) return html``;
    const isOther = this._config?.[targetKey] === "other";
    const computeLabel = this._boundComputeLabel || (this._boundComputeLabel = this._computeLabel.bind(this));
    const enableTargetEntity = (ev) => {
      ev?.preventDefault?.();
      ev?.stopPropagation?.();
      this._enableActionTargetEntity(targetKey);
    };
    return isOther ? html`
      <div class="two-col action-target-row">
        <div class="toggle-item">
          <ha-switch
            .checked=${true}
            @change=${(e) => this._commit({
              ...this._config,
              [targetKey]: e.target.checked ? "other" : "default",
              [entityKey]: e.target.checked ? this._config?.[entityKey] : "",
            })}
          ></ha-switch>
          <div class="toggle-label">${localize(labelKey, lang)}</div>
        </div>
        <ha-form
          .hass=${hass}
          .data=${this._config}
          .schema=${[{ name: entityKey, selector: { entity: {} } }]}
          .computeLabel=${computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
    ` : html`
      <div class="row">
        <button class="editor-pill-button" type="button" .onclick=${enableTargetEntity} .onpointerup=${enableTargetEntity}>
          <ha-icon icon="mdi:plus"></ha-icon>
          ${localize("editor_action_add_target_entity", lang)}
        </button>
      </div>
    `;
  }
