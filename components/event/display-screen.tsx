
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface DisplayScreenProps {
    isActive: boolean;
    data?: {
        email_address: string;
        department: string;
        partner_id: string;
    }
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
                    ease: 'power3.out',
                }
            );
        }
    }, [isActive]);

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center h-full text-center">
            <img
                src="https://picsum.photos/seed/student/150/150"
                alt="Student Avatar"
                className="w-36 h-36 border-4 border-[#acdd9c] rounded-full mb-6 shadow-[0_0_15px_rgba(172,221,156,0.7)]"
            />
            <h2 className="text-3xl text-[#acdd9c] mb-2">ACCESS GRANTED</h2>
            <h1 className="text-4xl md:text-6xl text-[#f9d447] drop-shadow-[0_0_10px_rgba(249,212,71,0.65)]">
                WELCOME,
            </h1>
            <p className="text-4xl md:text-6xl text-[#76c0e3] mt-2">{data ? getNameFromEmail(data.email_address) : 'Unknown User'}</p>
        </div>
    );
};

function getNameFromEmail(email: string): string {
    // Extract the part before the "@" symbol
    const namePart = email.split('@')[0];

    // Replace underscores and dots with spaces
    const nameWithSpaces = namePart.replace(/[_\.]/g, ' ');

    // Capitalize the first letter of each word
    const capitalized = nameWithSpaces.replace(/\b\w/g, char => char.toUpperCase());
    return capitalized;
}

export default DisplayScreen;
