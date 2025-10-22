"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

interface SplitTextLocalProps {
    children : React.ReactNode;
    className? : string;
    stagger?: gsap.NumberValue | gsap.StaggerVars;
    delay?: gsap.TweenValue;
    duration? : gsap.TweenValue;
    type? : 'chars' | 'lines';
    play? : boolean;
}
const SplitTextLocal: React.FC<SplitTextLocalProps> = ({ children, className, stagger = 0.05, delay = 0, duration = 1, type, play = true, }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        if (!ref.current) return;

        const split = new SplitText(ref.current, {
            type: type === 'chars' ? 'words,chars' : 'words,lines',
        });

        const targets = type === 'chars' ? split.chars : split.lines;

        gsap.set(targets, { autoAlpha: 0, y: type === 'chars' ? 50 : 0 });

        let anim: gsap.core.Tween | null = null;

        const startAnimation = () => {
            if (anim) return;
            setHidden(false);
            anim = gsap.to(targets, {
                duration: duration,
                y: 0,
                autoAlpha: 1,
                stagger: stagger,
                ease: "power2.out",
                delay: delay,
            });
        };

        if (play) {
            startAnimation();
        }

        return () => {
            try {
                split.revert();
            } catch {
                /* ignore */
            }
            if (anim) anim.kill();
        };
    }, [stagger, delay, type, duration, play]);

    // watch `play` changes to start animation later if needed
    useEffect(() => {
        if (!ref.current) return;
        if (!play) return;

        // if play toggles true after mount, trigger animation by programmatically
        // creating a small staggered animation on existing spans
        const el = ref.current;
        const spans = el.querySelectorAll('span');
        if (!spans || spans.length === 0) return;

        // ensure they're hidden first
        gsap.set(spans, { autoAlpha: 0, y: type === 'chars' ? 50 : 0 });
        setHidden(false);
        gsap.to(spans, {
            duration: duration,
            y: 0,
            autoAlpha: 1,
            stagger: stagger,
            ease: "power2.out",
            delay: delay,
        });
    }, [play, delay, duration, stagger, type]);

    return <div ref={ref} className={className} style={{ opacity: hidden ? 0 : undefined }}>{children}</div>;
};

export default SplitTextLocal;
