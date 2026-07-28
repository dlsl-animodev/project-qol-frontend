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
            <h1 className="text-4xl md:text-6xl mb-4 text-[#f9d447] drop-shadow-[0_0_10px_rgba(249,212,71,0.65)]">
                AWAITING INPUT
            </h1>
            <p className="text-lg md:text-2xl text-[#acdd9c]">
                PLEASE TAP STUDENT ID CARD
                <span ref={cursorRef} className="ml-2 w-4 h-8 bg-[#f9d447] inline-block align-middle"></span>
            </p>
        </div>
    );
};

export default IdleScreen;
