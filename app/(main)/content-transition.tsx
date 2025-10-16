"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Props = {
    children: ReactNode
    className?: string
}

export default function ContentTransition({ children, className }: Props) {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        // Defer to next frame so initial styles paint before we transition
        const id = requestAnimationFrame(() => setReady(true))
        return () => cancelAnimationFrame(id)
    }, [])

    return (
        <div
            data-state={ready ? "loaded" : "loading"}
            className={cn(
                // Respect reduced motion
                "motion-reduce:transition-none motion-reduce:transform-none",
                // Animate opacity and slight translate for a subtle entrance
                "transform-gpu transition-all duration-300 ease-out",
                ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
                className,
            )}
        >
            {children}
        </div>
    )
}
