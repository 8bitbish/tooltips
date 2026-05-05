let tooltipHot = false
let hotTimer: ReturnType<typeof setTimeout> | null = null

export function markHot() {
    if (hotTimer) clearTimeout(hotTimer)
    tooltipHot = true
}

export function startCooldown() {
    if (hotTimer) clearTimeout(hotTimer)
    hotTimer = setTimeout(() => { tooltipHot = false }, 500)
}

export function isHot() {
    return tooltipHot
}
