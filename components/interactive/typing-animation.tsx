"use client";

import React, { useEffect, useState } from "react";

interface TypingAnimationProps {
    text: string;
    speed?: number; // typing speed (ms per char)
    className? : string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
    text,
    speed = 60,
    className
}) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let index = 0;
        let timeout: NodeJS.Timeout;

        const type = () => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
                timeout = setTimeout(type, speed);
            }
        };

        type();

        return () => clearTimeout(timeout);
    }, [text, speed]);

    return (
        <div className={className}>
            {displayedText}
            <span className="animate-blink text-accent ml-4">|</span>
        </div>
    );
};

export default TypingAnimation;
