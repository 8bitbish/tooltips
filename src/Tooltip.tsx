import React, { useState, useRef, useLayoutEffect, cloneElement, Children } from "react"
import { createPortal } from "react-dom"
import { markHot, startCooldown, isHot } from "./hot-state"
import { type Placement, bestPlacement, positionTooltip } from "./position"

export type { Placement }

interface TooltipProps {
    text: string
    shortcut?: string
    /** Delay in ms before tooltip appears. Default 900. */
    delay?: number
    /** Force a specific direction. Auto-detects if omitted (above → below → left → right). */
    placement?: Placement
    children: React.ReactElement
}

export function Tooltip({ text, shortcut, delay = 900, placement, children }: TooltipProps) {
    const [active, setActive] = useState(false)
    const triggerRef = useRef<HTMLElement | null>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const rectRef = useRef<DOMRect | null>(null)

    function show() {
        const effectiveDelay = isHot() ? 0 : delay
        timerRef.current = setTimeout(() => {
            const el = triggerRef.current
            if (!el) return
            rectRef.current = el.getBoundingClientRect()
            markHot()
            setActive(true)
        }, effectiveDelay)
    }

    function hide() {
        if (timerRef.current) clearTimeout(timerRef.current)
        setActive(false)
        startCooldown()
    }

    useLayoutEffect(() => {
        const el = tooltipRef.current
        const rect = rectRef.current
        if (!el || !rect) return
        const place = placement ?? bestPlacement(rect, el.offsetWidth, el.offsetHeight)
        positionTooltip(el, place, rect)
    }, [active, placement])

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
            {active && createPortal(
                <div
                    ref={tooltipRef}
                    className="tooltip"
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
