export const CARD_CSS = `
        ha-card { overflow: hidden; }
        .header { padding: 16px 16px 0 16px; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .header-item { min-width: 0; font-size: 16px; font-weight: 600; color: var(--primary-text-color); }
        .header-item-right { margin-left: auto; text-align: right; }
        .header-metric { display: flex; flex-direction: column; line-height: 1.05; }
        .header-metric-top { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); min-height: 13px; }
        .header-metric-main { font-size: 18px; font-weight: 700; color: var(--primary-text-color); white-space: nowrap; }
        .header-price-main { font-size: 30px; font-weight: 800; color: var(--primary-text-color); white-space: nowrap; }
        .header-metric-unit { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(var(--info-cols, var(--info-max-cols, 4)), minmax(100px, 1fr));
          gap: var(--info-gap, 10px);
          margin: 6px 0 0 0;
        }
        .info-grid.top { margin-bottom: -6px; }
        .info-grid.bottom { margin-top: 14px; margin-bottom: 0; }
        .info-item {
          font-size: 12px;
          color: var(--secondary-text-color);
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
          align-items: end;
          background: color-mix(in srgb, var(--card-background-color) 92%, var(--primary-text-color) 8%);
          border: 1px solid rgba(120,120,120,0.26);
          border-radius: 14px;
          padding: 10px 10px;
          aspect-ratio: 1 / 1;
          min-height: 0;
          box-sizing: border-box;
        }
        .info-item.has-action { cursor: pointer; }
        .info-item.has-action:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }
        .info-label {
          font-size: 11px;
          opacity: .82;
          min-height: 12px;
          width: 100%;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          line-height: 1.1;
        }
        .info-label-text { display: inline-block; transform: translateX(0); will-change: transform; }
        .info-label.marquee .info-label-text { animation: info-label-marquee var(--marquee-duration, 5s) ease-in-out infinite alternate; }
        @keyframes info-label-marquee { from { transform: translateX(0); } to { transform: translateX(calc(-1 * var(--marquee-shift, 0px))); } }
        .info-value {
          color: var(--primary-text-color);
          font-weight: 700;
          line-height: 1.08;
          text-align: center;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: center;
          justify-self: center;
          gap: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .info-value-inline { display: inline-flex; align-items: baseline; justify-content: center; max-width: 100%; overflow: hidden; }
        .info-value-main { font-size: var(--info-main-size, 24px); font-weight: 800; line-height: 1; }
        .info-value-unit { font-size: 11px; font-weight: 600; color: var(--secondary-text-color); line-height: 1; }
        .content { padding: 8px 16px 12px 16px; }
        .pg-wrap { position: relative; padding-top: 0; margin-top: 0; touch-action: pan-y; cursor: pointer; }
        .pg-wrap:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
          border-radius: 10px;
        }
        .content.no-info .pg-wrap { margin-top: -10px; }
        .content.has-info .pg-wrap { margin-top: -6px; }
        .pg-empty {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .pg-empty-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: var(--secondary-text-color);
          background: color-mix(in srgb, var(--card-background-color) 82%, var(--primary-color) 18%);
          border: 1px solid rgba(120,120,120,0.28);
          border-radius: 12px;
          padding: 12px 14px;
          max-width: min(88%, 420px);
          max-height: calc(100% - 8px);
          text-align: center;
          overflow: hidden;
        }
        .pg-empty-text { font-size: 13px; line-height: 1.35; }
        .pg-empty-gears {
          width: 62px;
          height: 44px;
          overflow: visible;
          color: var(--secondary-text-color);
          opacity: 0.95;
        }
        .pg-empty-gear-lg { transform-origin: 20px 24px; animation: pg-spin-cw 9s linear infinite; }
        .pg-empty-gear-sm-a { transform-origin: 39px 17px; animation: pg-spin-ccw 7s linear infinite; }
        .pg-empty-gear-sm-b { transform-origin: 47px 31px; animation: pg-spin-ccw 11s linear infinite; }
        .pg-empty-gear-lg, .pg-empty-gear-sm-a, .pg-empty-gear-sm-b { transform-box: fill-box; transform-origin: center; }
        .pg-empty.is-timeline .pg-empty-card { padding: 0px 10px; border-radius: 10px; gap: 0px; max-width: min(86%, 360px); }
        .pg-empty.is-timeline .pg-empty-text { font-size: 12px; line-height: 1.2; }
        .pg-empty.is-timeline .pg-empty-gears { width: 40px; height: 24px; }
        @keyframes pg-spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pg-spin-ccw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .pg-legend { display: flex; gap: 12px; align-items: center; justify-content: center; flex-wrap: wrap; margin: 8px 0 6px 0; font-size: 13px; opacity: .9; }
        .pg-legend.is-timeline { margin-top: -17px; }
        .pg-legend-item { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
        .pg-legend-dot { width: 8px; height: 8px; border-radius: 999px; background: #999; }
        .pg-buttons {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 6px;
          background: color-mix(in srgb, var(--card-background-color) 92%, var(--primary-text-color) 8%);
          border: 1px solid rgba(120,120,120,0.26);
          border-radius: 14px;
          overflow: hidden;
        }
        .pg-buttons-indicator {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 33.3333%;
          height: 3px;
          background: var(--primary-color);
          transition: transform .22s cubic-bezier(.2,.7,.2,1);
          pointer-events: none;
        }
        .pg-buttons.day-today .pg-buttons-indicator { transform: translateX(0%); }
        .pg-buttons.day-tomorrow .pg-buttons-indicator { transform: translateX(100%); }
        .pg-buttons.day-two_days .pg-buttons-indicator { transform: translateX(200%); }
        .pg-btn {
          position: relative;
          padding: 11px 8px;
          border-radius: 0;
          border: 0;
          background: transparent;
          color: var(--primary-text-color);
          font-size: 13px;
          font-weight: 600;
          opacity: .8;
          cursor: pointer;
          overflow: visible;
          -webkit-tap-highlight-color: transparent;
          transition: color .18s ease, opacity .18s ease;
        }
        .pg-btn.active {
          color: var(--primary-color);
          opacity: 1;
        }
        .pg-btn-state {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--primary-color) 22%, transparent);
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
          pointer-events: none;
        }
        .pg-btn-state.run { animation: pg-btn-state .36s cubic-bezier(.2,.7,.2,1); }
        @keyframes pg-btn-state {
          0% { opacity: .95; transform: translate(-50%, -50%) scale(0); }
          70% { opacity: .38; transform: translate(-50%, -50%) scale(14); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(18); }
        }
        .pg-tooltip {
          position:absolute; pointer-events:none;
          background: var(--card-background-color);
          border: 1px solid rgba(120,120,120,.35);
          box-shadow: 0 2px 10px rgba(0,0,0,.18);
          border-radius: 10px;
          padding: 6px 8px;
          font-size: 12px;
          color: var(--primary-text-color);
          transform: translate(-50%, -100%);
          display:none;
          white-space: nowrap;
          z-index: 2;
        }
        .pg-sub { opacity:.75; font-size:11px; }
        svg.svg { width: 100%; height: 100%; display:block; }
        .tl-root { position: relative; display: flex; flex-direction: column; gap: 9px; height: 100%; justify-content: center; }
        .tl-track { position: relative; display: flex; height: 6px; align-items: stretch; }
        .tl-slot { flex: 1 1 0; min-width: 0; }
        .tl-past {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.22);
          pointer-events: none;
        }
        .tl-now {
          position: absolute;
          top: 50%;
          width: 3px;
          height: 14px;
          border-radius: 10px;
          transform: translateY(-50%);
          pointer-events: none;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
          box-sizing: border-box;
        }
        .tl-scale { display: grid; gap: 0; }
        .tl-tick { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }
        .tl-dot { width: 3px; height: 3px; border-radius: 999px; background: rgba(120,120,120,0.55); margin-bottom: 3px; }
        .tl-dot.major { width: 4px; height: 4px; background: rgba(20,20,20,0.9); }
        .tl-hour { font-size: 11px; line-height: 1; color: var(--secondary-text-color); }
        .tl-days { position: absolute; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 1fr 1fr; align-items: center; pointer-events: none; }
        .tl-day { text-align: center; font-size: 11px; line-height: 1; color: var(--secondary-text-color); }
      `;
