export type Placement = 'above' | 'below' | 'left' | 'right'

const GAP = 8

export function bestPlacement(rect: DOMRect, tw: number, th: number): Placement {
    const vw = window.innerWidth
    const vh = window.innerHeight
    if (rect.top - GAP >= th)               return 'above'
    if (vh - rect.bottom - GAP >= th)       return 'below'
    if (rect.left - GAP >= tw)              return 'left'
    return 'right'
}

export function positionTooltip(el: HTMLElement, place: Placement, rect: DOMRect) {
    const tw = el.offsetWidth
    const th = el.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    let top: number, left: number

    if (place === 'above') {
        left = Math.max(8, Math.min(cx - tw / 2, vw - tw - 8))
        top  = rect.top - GAP
        el.style.setProperty('--arrow-x', `${Math.max(10, Math.min(cx - left, tw - 10))}px`)
        el.style.removeProperty('--arrow-y')
    } else if (place === 'below') {
        left = Math.max(8, Math.min(cx - tw / 2, vw - tw - 8))
        top  = rect.bottom + GAP
        el.style.setProperty('--arrow-x', `${Math.max(10, Math.min(cx - left, tw - 10))}px`)
        el.style.removeProperty('--arrow-y')
    } else if (place === 'left') {
        left = rect.left - GAP
        top  = Math.max(8, Math.min(cy - th / 2, vh - th - 8))
        el.style.setProperty('--arrow-y', `${Math.max(10, Math.min(cy - top, th - 10))}px`)
        el.style.removeProperty('--arrow-x')
    } else {
        left = rect.right + GAP
        top  = Math.max(8, Math.min(cy - th / 2, vh - th - 8))
        el.style.setProperty('--arrow-y', `${Math.max(10, Math.min(cy - top, th - 10))}px`)
        el.style.removeProperty('--arrow-x')
    }

    el.className = `tooltip tooltip--${place}`
    el.style.left = `${left}px`
    el.style.top  = `${top}px`
    el.style.visibility = 'visible'
}
