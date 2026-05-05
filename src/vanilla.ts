import { markHot, startCooldown, isHot } from "./hot-state"

let activeTooltip: HTMLElement | null = null
let showTimer: ReturnType<typeof setTimeout> | null = null

function showTooltip(trigger: HTMLElement) {
    const text = trigger.dataset.tooltip
    if (!text) return

    const shortcut = trigger.dataset.shortcut
    const delay = parseInt(trigger.dataset.delay ?? '900', 10)
    const effectiveDelay = isHot() ? 0 : delay

    showTimer = setTimeout(() => {
        const rect = trigger.getBoundingClientRect()
        const gap = 8
        const above = rect.top >= 42 + gap

        const el = document.createElement('div')
        el.className = `tooltip tooltip--${above ? 'above' : 'below'}`
        el.style.cssText = 'visibility:hidden;position:fixed;top:0;left:0'

        const textSpan = document.createElement('span')
        textSpan.className = 'tooltip__text'
        textSpan.textContent = text
        el.appendChild(textSpan)

        if (shortcut) {
            const kbd = document.createElement('kbd')
            kbd.className = 'tooltip__shortcut'
            kbd.textContent = shortcut
            el.appendChild(kbd)
        }

        document.body.appendChild(el)
        activeTooltip = el

        const tw = el.offsetWidth
        const vw = window.innerWidth
        const x = rect.left + rect.width / 2
        const y = above ? rect.top - gap : rect.bottom + gap
        const left = Math.max(8, Math.min(x - tw / 2, vw - tw - 8))
        const arrowX = Math.max(10, Math.min(x - left, tw - 10))

        el.style.left = `${left}px`
        el.style.top = `${y}px`
        el.style.setProperty('--arrow-x', `${arrowX}px`)
        el.style.visibility = 'visible'

        markHot()
    }, effectiveDelay)
}

function hideTooltip() {
    if (showTimer) clearTimeout(showTimer)
    showTimer = null
    if (activeTooltip) {
        activeTooltip.remove()
        activeTooltip = null
    }
    startCooldown()
}

function wire(el: HTMLElement) {
    if (el.dataset.tooltipWired) return
    el.dataset.tooltipWired = '1'
    el.addEventListener('mouseenter', () => showTooltip(el))
    el.addEventListener('mouseleave', hideTooltip)
}

function scan(root: Element | Document = document) {
    root.querySelectorAll<HTMLElement>('[data-tooltip]').forEach(wire)
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => scan())
} else {
    scan()
}

new MutationObserver(mutations => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
                if (node.dataset.tooltip) wire(node)
                scan(node)
            }
        }
    }
}).observe(document.body, { childList: true, subtree: true })
