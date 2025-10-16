"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface IdleScreenProps {
    isActive: boolean;
}

const IdleScreen: React.FC<IdleScreenProps> = ({ isActive }) => {
    const cursorRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isActive) {
            gsap.to(cursorRef.current, {
                opacity: 0,
                repeat: -1,
                yoyo: true,
                duration: 0.5,
                ease: 'steps(1)',
            });
            gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
        }
    }, [isActive]);

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-4xl md:text-6xl mb-4 text-shadow-[0_0_10px_theme(colors.orange.500)]">
                AWAITING INPUT
            </h1>
            <p className="text-lg md:text-2xl text-orange-400">
                PLEASE TAP STUDENT ID CARD
                <span ref={cursorRef} className="ml-2 w-4 h-8 bg-orange-500 inline-block align-middle"></span>
            </p>
        </div>
    );
};

export default IdleScreen;
