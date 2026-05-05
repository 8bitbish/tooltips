import { useState, useRef, useLayoutEffect } from "react"
import { createPortal } from "react-dom"

// Shared hot state: once any tooltip has been shown, subsequent hovers are instant
// for a short window after the last tooltip disappears.
let tooltipHot = false
let hotTimer: ReturnType<typeof setTimeout> | null = null

function markHot() {
    if (hotTimer) clearTimeout(hotTimer)
    tooltipHot = true
}

function startCooldown() {
    if (hotTimer) clearTimeout(hotTimer)
    hotTimer = setTimeout(() => { tooltipHot = false }, 500)
}

interface TooltipProps {
    text: string
    shortcut?: string
    /** Delay in ms before tooltip appears. Default 300. */
    delay?: number
    children: React.ReactNode
}

interface TriggerPos {
    x: number   // center X of trigger
    y: number   // top anchor (above: trigger top, below: trigger bottom)
    above: boolean
}

export function Tooltip({ text, shortcut, delay = 900, children }: TooltipProps) {
    const [triggerPos, setTriggerPos] = useState<TriggerPos | null>(null)
    const wrapRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    function show() {
        const effectiveDelay = tooltipHot ? 0 : delay
        timerRef.current = setTimeout(() => {
            const trigger = wrapRef.current?.firstElementChild as HTMLElement | null
            if (!trigger) return
            const rect = trigger.getBoundingClientRect()
            const gap = 8
            const above = rect.top >= 42 + gap
            markHot()
            setTriggerPos({
                x: rect.left + rect.width / 2,
                y: above ? rect.top - gap : rect.bottom + gap,
                above,
            })
        }, effectiveDelay)
    }

    function hide() {
        if (timerRef.current) clearTimeout(timerRef.current)
        setTriggerPos(null)
        startCooldown()
    }

    // After the tooltip renders, measure its width, clamp to viewport,
    // then set final position and trigger the entrance animation — all
    // before the browser paints, so there's no flash.
    useLayoutEffect(() => {
        const el = tooltipRef.current
        if (!el || !triggerPos) return
        const tw = el.offsetWidth
        const vw = window.innerWidth
        const left = Math.max(8, Math.min(triggerPos.x - tw / 2, vw - tw - 8))
        const arrowX = Math.max(10, Math.min(triggerPos.x - left, tw - 10))
        el.style.left = `${left}px`
        el.style.top = `${triggerPos.y}px`
        el.style.setProperty("--arrow-x", `${arrowX}px`)
        el.style.visibility = "visible"
    }, [triggerPos])

    return (
        <div ref={wrapRef} onMouseEnter={show} onMouseLeave={hide} style={{ display: "contents" }}>
            {children}
            {triggerPos && createPortal(
                <div
                    ref={tooltipRef}
                    className={`tooltip tooltip--${triggerPos.above ? "above" : "below"}`}
                    style={{ visibility: "hidden", position: "fixed", top: 0, left: 0 }}
                >
                    <span className="tooltip__text">{text}</span>
                    {shortcut && <kbd className="tooltip__shortcut">{shortcut}</kbd>}
                </div>,
                document.body
            )}
        </div>
    )
}
