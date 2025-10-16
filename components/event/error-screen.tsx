"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ErrorScreenProps {
    isActive: boolean;
    message?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ isActive, message }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isActive && containerRef.current) {
            const elements = containerRef.current.children;
            gsap.fromTo(
                elements,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
            );
        }
    }, [isActive]);

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center justify-center h-full text-center"
        >
            <div className="w-24 h-24 rounded-full border-4 border-red-500 mb-6 flex items-center justify-center shadow-[0_0_15px_theme(colors.red.500)]">
                <span className="text-5xl text-red-400">!</span>
            </div>
            <h2 className="text-3xl text-red-400 mb-2">ACCESS ERROR</h2>
            <h1 className="text-4xl md:text-6xl text-shadow-[0_0_10px_theme(colors.orange.500)]">
                PLEASE TRY AGAIN
            </h1>
            <p className="text-lg md:text-2xl text-orange-300 mt-4 max-w-xl">
                {message || "Unable to fetch student data at this time."}
            </p>
        </div>
    );
};

export default ErrorScreen;
