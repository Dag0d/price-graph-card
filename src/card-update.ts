import { appendSvgLineSegments, buildStepSegments, computeYScaleCt, getTimelinePastOverlayColor, makeXFor, makeYFor, zoneColor, zoneLabel } from "./graph";
import { escapeHtml, formatTickLabel, roundTo } from "./format";
import { getLang, localize } from "./i18n";
import { resolveRuntimeConfig } from "./runtime-config";
import { formatHHMMInTimeZone, getHaTimeZone } from "./time";
import { getDisplayUnit } from "./units";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function getMappedPrice(priceMap: Map<number, number> | null, key: number) {
  return priceMap?.get(key) ?? null;
}

export function updateCard() {
    if (!this.hass || !this._config) return;

    const cfg = this._config;
    const lang = getLang(this.hass);
    const timeZone = getHaTimeZone(this.hass);

    const wrap = this.renderRoot?.querySelector(".pg-wrap");
    const host = this.renderRoot?.querySelector("#pg-svg-host");
    const tip = this.renderRoot?.querySelector("#pg-tooltip");
    const content = this.renderRoot?.querySelector(".content");
    const infoGrids = this.renderRoot?.querySelectorAll(".info-grid") || [];
    if (content && infoGrids.length) {
      const width = Math.round(content.clientWidth || 0);
      if (width > 0) {
        const maxCols = Number(this._config?.content_items_max_cols) === 3 ? 3 : 4;
        const gap = clamp(Math.round(width * 0.018), 8, 12);
        const colsRaw = Math.floor((width + gap) / (100 + gap));
        const cols = clamp(colsRaw || 2, 2, maxCols);
        infoGrids.forEach((grid) => {
          grid.style.setProperty("--info-cols", String(cols));
          grid.style.setProperty("--info-max-cols", String(maxCols));
          grid.style.setProperty("--info-gap", `${gap}px`);
        });
      }
    }
    this._syncInfoLabelMarquee();
    this._syncInfoValueFit();
    if (!wrap || !host || !tip) return;
    this._syncResizeObserver(content, wrap, host);

    const st = this.hass.states?.[this._config.entity];
    if (!st) return;

    const runtimeCfg = resolveRuntimeConfig(cfg, this._dayView);
    const dayCtx = this._getDayCtx(runtimeCfg, st, timeZone);
    const { dayView, twoDayMode, dayPoints, overlayPoints, overlayShifted, thresholds, dayStart, dayHours, firstDayHours, showPending } = dayCtx;

    if (!dayPoints.length || showPending) {
      this._lastGraphSignature = null;
      this._unbindGraphPointer();
      host.innerHTML = "";
      tip.style.display = "none";
      return;
    }

    const pts = [...dayPoints].sort((a, b) => a.start - b.start);
    const unitLabel = getDisplayUnit(runtimeCfg, st.attributes, lang);
    const graphSignature = this._buildGraphSignature(runtimeCfg, st, dayCtx, host, wrap, lang, timeZone);
    if (graphSignature && graphSignature === this._lastGraphSignature) return;
    this._lastGraphSignature = graphSignature;

    if (runtimeCfg.view_mode === "timeline") {
      this._unbindGraphPointer();
      tip.style.display = "none";

      const markerHeight = 14;
      const markerWidth = 7;
      const markerBorder = 2;
      const dayEnd = new Date(dayStart.getTime() + dayHours * 3600 * 1000);
      const root = document.createElement("div");
      root.className = "tl-root";
      const track = document.createElement("div");
      track.className = "tl-track";
      const scale = document.createElement("div");
      scale.className = "tl-scale";
      scale.style.gridTemplateColumns = `repeat(${dayHours + 1}, minmax(0, 1fr))`;

      for (let i = 0; i < pts.length; i++) {
        const cur = pts[i];
        const color = zoneColor(runtimeCfg, cur.price, thresholds);
        const prev = pts[i - 1];
        const next = pts[i + 1];
        const prevColor = prev ? zoneColor(runtimeCfg, prev.price, thresholds) : null;
        const nextColor = next ? zoneColor(runtimeCfg, next.price, thresholds) : null;
        const slot = document.createElement("div");
        slot.className = "tl-slot";
        slot.style.background = color;
        if (prevColor !== color) {
          slot.style.borderTopLeftRadius = "999px";
          slot.style.borderBottomLeftRadius = "999px";
        }
        if (nextColor !== color) {
          slot.style.borderTopRightRadius = "999px";
          slot.style.borderBottomRightRadius = "999px";
        }
        track.appendChild(slot);
      }

      const now = new Date();
      if (now >= dayStart && now <= dayEnd && pts.length) {
        let current = pts[0];
        for (let i = 0; i < pts.length; i++) {
          const next = pts[i + 1];
          if (!next || now < next.start) {
            current = pts[i];
            break;
          }
        }
        const pos = clamp((now.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime()), 0, 1);
        const past = document.createElement("div");
        past.className = "tl-past";
        past.style.width = `${pos * 100}%`;
        past.style.background = getTimelinePastOverlayColor(wrap);
        track.appendChild(past);
        const color = zoneColor(runtimeCfg, current.price, thresholds);
        const marker = document.createElement("div");
        marker.className = "tl-now";
        const markerOffset = markerWidth / 2;
        marker.style.left = `calc(${pos * 100}% - ${markerOffset}px)`;
        marker.style.height = `${markerHeight}px`;
        marker.style.width = `${markerWidth}px`;
        marker.style.background = color;
        marker.style.border = `${markerBorder}px solid var(--card-background-color)`;
        track.appendChild(marker);
      }

      for (let hh = 0; hh <= dayHours; hh += 1) {
        const tick = document.createElement("div");
        tick.className = "tl-tick";
        const isMajor = hh % 6 === 0 || hh === dayHours;
        const dot = document.createElement("div");
        dot.className = `tl-dot ${isMajor ? "major" : ""}`.trim();
        tick.appendChild(dot);
        if (isMajor) {
          const label = document.createElement("div");
          label.className = "tl-hour";
          label.textContent = formatHHMMInTimeZone(new Date(dayStart.getTime() + hh * 3600 * 1000), timeZone).slice(0, 2);
          tick.appendChild(label);
        }
        scale.appendChild(tick);
      }

      root.appendChild(track);
      root.appendChild(scale);
      if (dayView === "two_days") {
        const dayLabels = document.createElement("div");
        dayLabels.className = "tl-days";
        dayLabels.style.gridTemplateColumns = `${firstDayHours || 24}fr ${Math.max(1, dayHours - (firstDayHours || 24))}fr`;
        const left = document.createElement("div");
        left.className = "tl-day";
        left.textContent = localize("label_today", lang);
        const right = document.createElement("div");
        right.className = "tl-day";
        right.textContent = localize("label_tomorrow", lang);
        dayLabels.appendChild(left);
        dayLabels.appendChild(right);
        root.appendChild(dayLabels);
      }
      host.innerHTML = "";
      host.appendChild(root);
      return;
    }

    const measuredWidth = Math.round(host.clientWidth || wrap.clientWidth || this.clientWidth || 0);
    const w = Math.max(320, measuredWidth || 600);
    const h = Number(cfg.height) || 280;

    const left = 44;
    const right = w - 14;
    const top = 18;
    const bottom = h - 26;

    const innerW = right - left;
    const innerH = bottom - top;

    const yScale = computeYScaleCt(overlayShifted ? [...dayPoints, ...overlayShifted] : (overlayPoints ? [...dayPoints, ...overlayPoints] : dayPoints), runtimeCfg.unit_format);
    const { yMin, yMax, ticks } = yScale;
    const dims = { w, h, left, right, top, bottom, innerW, innerH, yMin, yMax };

    const gridOpacity = 0.25;

    const grid = ticks.map((v) => {
      const p = (v - yMin) / (yMax - yMin || 1);
      const y = top + (1 - clamp(p, 0, 1)) * innerH;
      const label = formatTickLabel(v);
      return { y, label };
    });

    const xLabels = [];
    for (let hh = 0; hh <= dayHours; hh += 2) {
      const x = left + (hh / dayHours) * innerW;
      const tickTime = new Date(dayStart.getTime() + hh * 3600 * 1000);
      xLabels.push({ x, label: formatHHMMInTimeZone(tickTime, timeZone).slice(0, 2) });
    }
    const segments = buildStepSegments(runtimeCfg, dayPoints, dims, thresholds, dayStart, dayHours);
    const overlaySegments = overlayShifted
      ? buildStepSegments(runtimeCfg, overlayShifted, dims, thresholds, dayStart, dayHours, () => "rgb(120,120,120)")
      : [];

    const now = new Date();
    const xNow = left + clamp((now.getTime() - dayStart.getTime()) / (dayHours * 3600 * 1000), 0, 1) * innerW;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "svg");
    svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const hit = document.createElementNS(svgNS, "rect");
    hit.setAttribute("x", "0");
    hit.setAttribute("y", "0");
    hit.setAttribute("width", String(w));
    hit.setAttribute("height", String(h));
    hit.setAttribute("fill", "transparent");
    hit.setAttribute("pointer-events", "all");
    svg.appendChild(hit);

    for (const g of grid) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("x1", left);
      line.setAttribute("x2", right);
      line.setAttribute("y1", g.y);
      line.setAttribute("y2", g.y);
      line.setAttribute("stroke", `rgba(120,120,120,${gridOpacity})`);
      svg.appendChild(line);

      const txt = document.createElementNS(svgNS, "text");
      txt.setAttribute("x", "6");
      txt.setAttribute("font-size", "12");
      txt.setAttribute("y", g.y + 4);
      txt.setAttribute("fill", "var(--secondary-text-color)");
      txt.textContent = g.label;
      svg.appendChild(txt);
    }

    for (const xl of xLabels) {
      const txt = document.createElementNS(svgNS, "text");
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("font-size", "12");
      txt.setAttribute("x", xl.x);
      txt.setAttribute("y", h - 6);
      txt.setAttribute("fill", "var(--secondary-text-color)");
      txt.textContent = xl.label;
      svg.appendChild(txt);
    }

    if (runtimeCfg.show_now_line && dayView === "today") {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("stroke-width", "1.5");
      line.setAttribute("stroke-dasharray", "4 3");
      line.setAttribute("x1", xNow);
      line.setAttribute("x2", xNow);
      line.setAttribute("y1", top);
      line.setAttribute("y2", bottom);
      line.setAttribute("stroke", "rgba(120,120,120,0.6)");
      svg.appendChild(line);

      const lbl = document.createElementNS(svgNS, "text");
      lbl.setAttribute("x", xNow);
      lbl.setAttribute("y", top + 12);
      lbl.setAttribute("text-anchor", "middle");
      lbl.setAttribute("font-size", "12");
      lbl.setAttribute("fill", "rgba(120,120,120,0.8)");
      lbl.textContent = localize("label_now", lang);
      svg.appendChild(lbl);
    }

    if (dayView === "two_days" && twoDayMode === "span") {
      const xMidnight = left + ((firstDayHours || 24) / dayHours) * innerW;
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("stroke-width", "1.2");
      line.setAttribute("x1", xMidnight);
      line.setAttribute("x2", xMidnight);
      line.setAttribute("y1", top);
      line.setAttribute("y2", bottom);
      line.setAttribute("stroke", "rgba(120,120,120,0.35)");
      svg.appendChild(line);

      const labelY = top + 16;
      const t1 = document.createElementNS(svgNS, "text");
      t1.setAttribute("x", left + innerW * 0.25);
      t1.setAttribute("y", labelY);
      t1.setAttribute("text-anchor", "middle");
      t1.setAttribute("font-size", "16");
      t1.setAttribute("fill", "rgba(120,120,120,0.8)");
      t1.textContent = localize("label_today", lang);
      svg.appendChild(t1);

      const t2 = document.createElementNS(svgNS, "text");
      t2.setAttribute("x", left + innerW * 0.75);
      t2.setAttribute("y", labelY);
      t2.setAttribute("text-anchor", "middle");
      t2.setAttribute("font-size", "16");
      t2.setAttribute("fill", "rgba(120,120,120,0.8)");
      t2.textContent = localize("label_tomorrow", lang);
      svg.appendChild(t2);
    }

    appendSvgLineSegments(svg, svgNS, overlaySegments);
    appendSvgLineSegments(svg, svgNS, segments);

    host.innerHTML = "";
    host.appendChild(svg);

    const dayEnd = new Date(dayStart.getTime() + dayHours * 3600 * 1000);
    const xFor = makeXFor(dayStart, dayHours, left, innerW);
    const yFor = makeYFor(top, innerH, yMin, yMax);

    let hoverLine = null;
    if (runtimeCfg.show_hover_line) {
      hoverLine = document.createElementNS(svgNS, "line");
      hoverLine.setAttribute("stroke-width", "1.2");
      hoverLine.setAttribute("stroke-dasharray", "3 3");
      hoverLine.setAttribute("stroke", "rgba(120,120,120,0.7)");
      hoverLine.setAttribute("y1", top);
      hoverLine.setAttribute("y2", bottom);
      hoverLine.style.display = "none";
      svg.appendChild(hoverLine);
    }

    const hoverDot = document.createElementNS(svgNS, "circle");
    hoverDot.setAttribute("r", "4.5");
    hoverDot.setAttribute("fill", "#ffffff");
    hoverDot.setAttribute("stroke", "rgba(0,0,0,0.45)");
    hoverDot.setAttribute("stroke-width", "1");
    hoverDot.style.display = "none";
    svg.appendChild(hoverDot);

    const hoverDotInner = document.createElementNS(svgNS, "circle");
    hoverDotInner.setAttribute("r", "2.2");
    hoverDotInner.setAttribute("fill", "var(--primary-text-color)");
    hoverDotInner.style.display = "none";
    svg.appendChild(hoverDotInner);

    const hoverDotOverlay = document.createElementNS(svgNS, "circle");
    hoverDotOverlay.setAttribute("r", "4");
    hoverDotOverlay.setAttribute("fill", "rgba(120,120,120,0.6)");
    hoverDotOverlay.setAttribute("stroke", "rgba(255,255,255,0.8)");
    hoverDotOverlay.setAttribute("stroke-width", "1");
    hoverDotOverlay.style.display = "none";
    svg.appendChild(hoverDotOverlay);

    const showHover = (x, y, y2) => {
      if (hoverLine) {
        hoverLine.setAttribute("x1", x);
        hoverLine.setAttribute("x2", x);
      }
      hoverDot.setAttribute("cx", x);
      hoverDot.setAttribute("cy", y);
      hoverDotInner.setAttribute("cx", x);
      hoverDotInner.setAttribute("cy", y);
      if (typeof y2 === "number") {
        hoverDotOverlay.setAttribute("cx", x);
        hoverDotOverlay.setAttribute("cy", y2);
        hoverDotOverlay.style.display = "block";
      } else {
        hoverDotOverlay.style.display = "none";
      }
      if (hoverLine) hoverLine.style.display = "block";
      hoverDot.style.display = "block";
      hoverDotInner.style.display = "block";
    };

    const hideHover = () => {
      if (hoverLine) hoverLine.style.display = "none";
      hoverDot.style.display = "none";
      hoverDotInner.style.display = "none";
      hoverDotOverlay.style.display = "none";
    };

    const midpoints = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i].start.getTime();
      const b = pts[i + 1].start.getTime();
      midpoints.push((a + b) / 2);
    }

    let tomorrowMap = null;
    if (dayView === "two_days" && twoDayMode === "overlay" && overlayShifted && overlayShifted.length) {
      tomorrowMap = new Map();
      for (const p of overlayShifted) {
        const k = Math.round((p.start.getTime() - dayStart.getTime()) / 60000);
        tomorrowMap.set(k, p.price);
      }
    }

    const snapPoint = (t) => {
      if (!pts.length) return null;
      for (let i = 0; i < midpoints.length; i++) {
        if (t < midpoints[i]) return pts[i];
      }
      return pts[pts.length - 1];
    };

    const onMove = (ev) => {
      const isMouse = ev.pointerType === "mouse";
      const wrapRect = wrap.getBoundingClientRect();
      if (isMouse) {
        if (
          ev.clientX < wrapRect.left ||
          ev.clientX > wrapRect.right ||
          ev.clientY < wrapRect.top ||
          ev.clientY > wrapRect.bottom
        ) {
          tip.style.display = "none";
          hideHover();
          return;
        }
      }

      const rect = svg.getBoundingClientRect();
      const graphLeftPx = (left / w) * rect.width;
      const graphRightPx = (right / w) * rect.width;
      const clampedClientX = clamp(ev.clientX, wrapRect.left, wrapRect.right);
      const xNorm = clamp((clampedClientX - rect.left - graphLeftPx) / (graphRightPx - graphLeftPx), 0, 1);
      const t = dayStart.getTime() + xNorm * dayHours * 3600 * 1000;

      let best = snapPoint(t);
      if (!best) best = this._lastBest;
      if (!best) return;
      this._lastBest = best;

      const bestTime = formatHHMMInTimeZone(best.start, timeZone);
      const val = roundTo(best.price, runtimeCfg.decimals);

      const bestIdx = pts.indexOf(best);
      const nextStart = pts[bestIdx + 1]?.start || dayEnd;
      const xSnap = (xFor(best.start) + xFor(nextStart)) / 2;
      const ySnap = yFor(best.price);
      let yOverlay = null;
      if (dayView === "two_days" && twoDayMode === "overlay" && overlayShifted && overlayShifted.length && tomorrowMap) {
        const tKey = Math.round((best.start.getTime() - dayStart.getTime()) / 60000);
        const ov = tomorrowMap.get(tKey);
        if (ov !== undefined && ov !== null) {
          yOverlay = yFor(ov);
        }
      }
      showHover(xSnap, ySnap, yOverlay);

      if (dayView === "two_days" && twoDayMode === "overlay" && overlayShifted && overlayShifted.length) {
        const intervalMin = pts.length > 1 ? Math.round((pts[1].start.getTime() - pts[0].start.getTime()) / 60000) : 60;
        const nextStart = new Date(best.start.getTime() + intervalMin * 60000);
        const tLabel = `${formatHHMMInTimeZone(best.start, timeZone)}-${formatHHMMInTimeZone(nextStart, timeZone)}`;
        const tKey = Math.round((best.start.getTime() - dayStart.getTime()) / 60000);
        const tVal = getMappedPrice(tomorrowMap, tKey);
        const vToday = `${val} ${unitLabel}`;
        const vTomorrow = tVal !== null ? `${roundTo(tVal, runtimeCfg.decimals)} ${unitLabel}` : "--";
        tip.innerHTML = `<div><b>${escapeHtml(tLabel)}</b></div><div class="pg-sub">${localize("label_today", lang)}: ${escapeHtml(vToday)}</div><div class="pg-sub">${localize("label_tomorrow", lang)}: ${escapeHtml(vTomorrow)}</div>`;
      } else {
        const region = zoneLabel(best.price, thresholds, lang);
        tip.innerHTML = `<div><b>${escapeHtml(bestTime)}</b> — ${escapeHtml(val)} ${escapeHtml(unitLabel)}</div><div class="pg-sub">${localize("label_region", lang)}: ${escapeHtml(region)}</div>`;
      }
      const graphTopPx = (top / h) * rect.height + (rect.top - wrapRect.top);
      const xSnapPx = (xSnap / w) * rect.width;
      tip.style.display = "block";
      tip.style.left = `${xSnapPx}px`;
      tip.style.top = `${graphTopPx + 10}px`;

      const tipRect = tip.getBoundingClientRect();
      const maxX = wrapRect.width - tipRect.width / 2;
      const minX = tipRect.width / 2;
      const clampedX = clamp(xSnapPx, minX, maxX);
      tip.style.left = `${clampedX}px`;
      tip.style.display = "block";
    };

    const onLeave = (ev) => {
      if (ev && ev.pointerType && ev.pointerType !== "mouse") return;
      tip.style.display = "none";
      hideHover();
    };

    const onDown = (ev) => {
      wrap.setPointerCapture?.(ev.pointerId);
      this._pinHover = true;
      onMove(ev);
    };

    const onUp = () => {
      this._pinHover = false;
      tip.style.display = "none";
      hideHover();
    };

    if (this._boundSvg !== svg) {
      this._unbindGraphPointer();
      this._boundSvg = svg;
      this._boundWrap = wrap;
      this._onMove = (ev) => {
        if (ev.pointerType === "mouse" || this._pinHover || ev.pointerType === "touch") onMove(ev);
      };
      this._onLeave = onLeave;
      this._onDown = onDown;
      this._onUp = onUp;
      wrap.addEventListener("pointermove", this._onMove, { passive: true });
      wrap.addEventListener("pointerleave", onLeave, { passive: true });
      wrap.addEventListener("pointerdown", onDown, { passive: true });
      wrap.addEventListener("pointerup", onUp, { passive: true });
      wrap.addEventListener("pointercancel", onUp, { passive: true });
    }
  
}
