"use client";

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface TypingScreenProps {
    studentId: string;
    isActive: boolean;
}

const TypingScreen: React.FC<TypingScreenProps> = ({ isActive, studentId }) => {
    const [typedId, setTypedId] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTypedId(studentId);
    }, [studentId])

    useEffect(() => {
        if (isActive) {
            gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
        } else {
            setTypedId('');
        }
    }, [isActive]);

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center h-full">
            <p className="text-xl md:text-3xl text-orange-400">
                ... READING ID ...
            </p>
            <div className="mt-4 text-3xl md:text-5xl font-mono bg-black/50 border border-orange-500/50 p-4 w-full max-w-md text-center">
                {typedId}
                <span className="animate-ping">_</span>
            </div>
        </div>
    );
};

export default TypingScreen;
