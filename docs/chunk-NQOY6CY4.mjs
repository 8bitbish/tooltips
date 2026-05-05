// src/hot-state.ts
var tooltipHot = false;
var hotTimer = null;
function markHot() {
  if (hotTimer) clearTimeout(hotTimer);
  tooltipHot = true;
}
function startCooldown() {
  if (hotTimer) clearTimeout(hotTimer);
  hotTimer = setTimeout(() => {
    tooltipHot = false;
  }, 500);
}
function isHot() {
  return tooltipHot;
}

export {
  markHot,
  startCooldown,
  isHot
};
