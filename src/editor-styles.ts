import { css } from "lit";

export const EDITOR_STYLES = css`
      .wrap { padding: 8px 0; }
      .row { margin-top: 12px; }
      .row ha-form { width: 100%; }
      .hint { font-size: 12px; opacity: 0.8; margin-top: 6px; }
      .two-col { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 12px; }
      .full-row { margin-top: 12px; }
      .toggle-item { display: flex; align-items: center; gap: 10px; }
      .toggle-label { font-size: 13px; }
      .editor-pill-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 36px;
        padding: 0 14px;
        border: 0;
        border-radius: 18px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font: inherit;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }
      .editor-pill-button:hover {
        background: color-mix(in srgb, var(--primary-color) 16%, transparent);
      }
      .editor-pill-button ha-icon {
        width: 18px;
        height: 18px;
      }
      .two-col ha-form { width: 100%; }
      .threshold-row { align-items: start; }
      .threshold-toggle { min-height: 56px; padding-top: 9px; box-sizing: border-box; }
      .form-disabled { opacity: 0.55; pointer-events: none; }
      .color-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
      .color-item { display: flex; align-items: center; gap: 10px; }
      .color-swatch {
        width: 40px; height: 34px; border: 1px solid rgba(120,120,120,0.35);
        border-radius: 8px; padding: 0; background: transparent; overflow: hidden;
      }
      .color-swatch input { width: 100%; height: 100%; border: 0; padding: 0; background: transparent; }
      .color-label { font-size: 12px; opacity: 0.8; margin-bottom: 4px; }
      .panel { margin-top: 12px; border: 1px solid rgba(120,120,120,0.25); border-radius: 10px; overflow: hidden; }
      .panel-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; cursor: pointer; }
      .panel-header-left { display: flex; align-items: center; gap: 8px; }
      .panel-header-left ha-svg-icon, .panel-header-left ha-icon { width: 20px; height: 20px; }
      .panel-body { padding: 0 12px 12px 12px; }
      .graph-mode-row { margin-top: 12px; }
      .panel-subtitle { margin-top: 14px; font-size: 12px; font-weight: 600; opacity: 0.75; letter-spacing: 0.02em; text-transform: uppercase; }
      .panel-subsection { border-top: 1px solid rgba(120,120,120,0.2); margin-top: 12px; padding-top: 12px; }
      .panel-subsection.is-first { border-top: 0; margin-top: 0; padding-top: 0; }
      .slot-card {
        margin-top: 10px;
        border: 1px solid rgba(120,120,120,0.22);
        border-radius: 10px;
        padding: 10px;
        background: rgba(120,120,120,0.05);
      }
      .slot-card-title { font-size: 12px; font-weight: 600; opacity: 0.85; margin-bottom: 2px; }
      .slot-actions {
        border-top: 1px solid rgba(120,120,120,0.18);
        margin-top: 12px;
        padding-top: 12px;
      }
      .slot-actions-body {
        margin-top: 10px;
      }
      .slot-action-target-row,
      .action-target-row {
        align-items: start;
      }
      @media (max-width: 520px) {
        .color-grid { grid-template-columns: 1fr; }
      }
    `;
