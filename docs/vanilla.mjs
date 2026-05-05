import {
  bestPlacement,
  isHot,
  markHot,
  positionTooltip,
  startCooldown
} from "./chunk-7QXPNRL3.mjs";

// src/vanilla.ts
var activeTooltip = null;
var showTimer = null;
function showTooltip(trigger) {
  const text = trigger.dataset.tooltip;
  if (!text) return;
  const shortcut = trigger.dataset.shortcut;
  const delay = parseInt(trigger.dataset.delay ?? "900", 10);
  const forcedPlacement = trigger.dataset.placement;
  const effectiveDelay = isHot() ? 0 : delay;
  showTimer = setTimeout(() => {
    const rect = trigger.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "tooltip";
    el.style.cssText = "visibility:hidden;position:fixed;top:0;left:0";
    const textSpan = document.createElement("span");
    textSpan.className = "tooltip__text";
    textSpan.textContent = text;
    el.appendChild(textSpan);
    if (shortcut) {
      const kbd = document.createElement("kbd");
      kbd.className = "tooltip__shortcut";
      kbd.textContent = shortcut;
      el.appendChild(kbd);
    }
    document.body.appendChild(el);
    activeTooltip = el;
    const place = forcedPlacement ?? bestPlacement(rect, el.offsetWidth, el.offsetHeight);
    positionTooltip(el, place, rect);
    markHot();
  }, effectiveDelay);
}
function hideTooltip() {
  if (showTimer) clearTimeout(showTimer);
  showTimer = null;
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }
  startCooldown();
}
function wire(el) {
  if (el.dataset.tooltipWired) return;
  el.dataset.tooltipWired = "1";
  el.addEventListener("mouseenter", () => showTooltip(el));
  el.addEventListener("mouseleave", hideTooltip);
}
function scan(root = document) {
  root.querySelectorAll("[data-tooltip]").forEach(wire);
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => scan());
} else {
  scan();
}
new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node instanceof HTMLElement) {
        if (node.dataset.tooltip) wire(node);
        scan(node);
      }
    }
  }
}).observe(document.body, { childList: true, subtree: true });
