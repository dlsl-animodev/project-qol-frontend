import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
    isActive: boolean;
}

const loadingMessages = [
    'CONNECTING TO MAINFRAME...',
    'AUTHENTICATING CREDENTIALS...',
    'QUERYING DATABASE...',
    'COMPILING STUDENT RECORDS...',
    'FETCHING PROFILE DATA...',
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isActive }) => {
    const barRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        let intervalId: number | undefined;
        let messageIndex = 0;

        if (isActive) {
            // Animate progress bar
            gsap.fromTo(
                barRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: 2.5, ease: 'power1.inOut' }
            );

            const messageEl = messageRef.current;

            // Set initial message without animation
            if (messageEl) {
                messageEl.textContent = loadingMessages[0];
                gsap.set(messageEl, { opacity: 1, y: 0 });
            }

            // Function to smoothly transition to the next message
            const changeMessage = () => {
                if (!messageEl) return;

                messageIndex = (messageIndex + 1) % loadingMessages.length;
                const newMessage = loadingMessages[messageIndex];

                gsap.to(messageEl, {
                    opacity: 0,
                    y: -10,
                    duration: 0.35,
                    ease: 'power2.in',
                    onComplete: () => {
                        messageEl.textContent = newMessage;
                        gsap.fromTo(
                            messageEl,
                            { y: 10, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
                        );
                    },
                });
            };

            intervalId = window.setInterval(changeMessage, 800);

        } else {
            // Reset when not active for a clean state on next appearance
            gsap.set(barRef.current, { scaleX: 0 });
            if (messageRef.current) {
                gsap.set(messageRef.current, { opacity: 0 });
            }
        }

        // Cleanup function to stop the interval when the component is inactive or unmounts
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isActive]);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <p
                ref={messageRef}
                className="text-xl md:text-3xl text-orange-400 mb-8 h-20 flex items-center justify-center text-center"
            ></p>
            <div className="w-full max-w-lg border-2 border-orange-500 p-1">
                <div
                    ref={barRef}
                    className="h-8 bg-orange-500 origin-left"
                ></div>
            </div>
        </div>
    );
};

export default LoadingScreen;