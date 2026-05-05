import React, { useState, useRef, useLayoutEffect, cloneElement, Children } from "react"
import { createPortal } from "react-dom"
import { markHot, startCooldown, isHot } from "./hot-state"

interface TooltipProps {
    text: string
    shortcut?: string
    /** Delay in ms before tooltip appears. Default 900. */
    delay?: number
    children: React.ReactElement
}

interface TriggerPos {
    x: number
    y: number
    above: boolean
}

export function Tooltip({ text, shortcut, delay = 900, children }: TooltipProps) {
    const [triggerPos, setTriggerPos] = useState<TriggerPos | null>(null)
    const triggerRef = useRef<HTMLElement | null>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    function show() {
        const effectiveDelay = isHot() ? 0 : delay
        timerRef.current = setTimeout(() => {
            const el = triggerRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
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

    const child = Children.only(children)
    const trigger = cloneElement(child, {
        ref: triggerRef,
        onMouseEnter: (e: MouseEvent) => {
            child.props.onMouseEnter?.(e)
            show()
        },
        onMouseLeave: (e: MouseEvent) => {
            child.props.onMouseLeave?.(e)
            hide()
        },
    })

    return (
        <>
            {trigger}
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
        </>
    )
}
