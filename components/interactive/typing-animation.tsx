"use client";

import React, { useEffect, useState } from "react";

interface TypingAnimationProps {
    text: string;
    speed?: number; // typing speed (ms per char)
    pause?: number; // pause at end before deleting
    className? : string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
    text,
    speed = 60,
    pause = 3000,
    className
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [typing, setTyping] = useState(true);

    useEffect(() => {
        let index = 0;
        let timeout: NodeJS.Timeout;

        const type = () => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
                timeout = setTimeout(type, speed);
            } else {
                timeout = setTimeout(() => setTyping(false), pause);
            }
        };

        const del = () => {
            if (index > 0) {
                setDisplayedText(text.slice(0, index - 1));
                index--;
            } else {
                timeout = setTimeout(() => setTyping(true), 200);
            }
        };

        if (typing) {
            type();
        } else {
            del();
        }

        return () => clearTimeout(timeout);
    }, [typing, text, speed, pause]);

    return (
        <div className={className}>
            {displayedText}
            <span className="animate-blink text-accent ml-4">|</span>
        </div>
    );
};

export default TypingAnimation;
