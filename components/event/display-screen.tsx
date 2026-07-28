import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface DisplayScreenProps {
    isActive: boolean;
    data?: {
        email_address: string;
        department: string;
        partner_id: string;
    };
}

const DisplayScreen: React.FC<DisplayScreenProps> = ({ isActive, data }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isActive && containerRef.current) {
            const elements = containerRef.current.children;
            gsap.fromTo(
                elements,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                },
            );
        }
    }, [isActive]);

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center justify-center h-full text-center"
        >
            <h2 className="text-3xl text-[#acdd9c] mb-2">ACCESS GRANTED</h2>
            <h1 className="text-4xl md:text-6xl text-[#f9d447] drop-shadow-[0_0_10px_rgba(249,212,71,0.65)]">
                WELCOME,
            </h1>
            <p
                className="
                  mt-2
                  text-4xl md:text-6xl
                  text-[#76c0e3]
                  max-w-[90%]
                  break-words
                  whitespace-normal
                  text-center
                "
            >
                {data ? getNameFromEmail(data.email_address) : "Unknown User"}
            </p>
        </div>
    );
};

function getNameFromEmail(email: string): string {
    // Extract the part before the "@" symbol
    const namePart = email.split("@")[0];

    // Replace underscores and dots with spaces
    const nameWithSpaces = namePart.replace(/[_\.]/g, " ");

    // Capitalize the first letter of each word
    const capitalized = nameWithSpaces.replace(/\b\w/g, (char) =>
        char.toUpperCase(),
    );
    return capitalized;
}

export default DisplayScreen;
