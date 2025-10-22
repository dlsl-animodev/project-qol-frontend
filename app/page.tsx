"use client";

import { Button } from "@/components/ui/button";
import { RectangleEllipsis } from "lucide-react";
import { useEffect } from "react";
import { useRef } from "react";

const LandingPage = () => {
    // detect window scroll y position
    // the front-card-view will rotate as scrolling until the back-card-view will switch and fully visible
    // check if they are in view first and when the top element of the screen goes 80% of their height, start animating
    // the animation should be done when the top element of the back card view + 40% to top hits the top of the screen
    const frontCardRef = useRef(null);
    const backCardRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const frontCard = frontCardRef.current;
            const backCard = backCardRef.current;
            if (frontCard && backCard) {
                const frontCardRect = frontCard.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                const frontCardTriggerPoint =
                    frontCardRect.top + frontCardRect.height * 2;
                if (frontCardTriggerPoint <= windowHeight) {
                    const totalScrollDistance =
                        windowHeight - frontCardTriggerPoint;
                    const rotationDegree = Math.min(
                        (totalScrollDistance / 200) * 180,
                        180
                    );
                    frontCard.style.transform = `rotateY(${rotationDegree}deg)`;
                    backCard.style.transform = `rotateY(${
                        rotationDegree - 180
                    }deg)`;
                }
            }
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="h-full pb-[10rem]">
            {/* HERO SECTION  */}
            <section className="h-[calc(100vh-3rem)] flex items-center justify-center flex-col ">
                <h1 className="text-8xl font-bold font-pixel text-center">
                    EFFORTLESS EVENT ATTENDANCE
                </h1>
                <p className="text-center text-lg w-[50%]">
                    Tired of manual attendance? Say goodbye to long queues and
                    tedious paperwork. Project QOL provides a seamless,
                    IOT-powered solution for managing event check-ins with a
                    simple ID scan
                </p>
                <Button className="mt-4">
                    <RectangleEllipsis /> Get started
                </Button>
            </section>

            {/* PROCESS  */}
            <section className="grid grid-cols-2 items-center">
                <h2 className="font-bold font-pixel text-center text-5xl">
                    Managing event attendance should not be a hassle
                </h2>
                <div className="relative flex flex-col items-center justify-center h-96 perspective">
                    <section
                        className="bg-accent flex flex-col items-center m-10 rounded-xl p-4 absolute backface-hidden w-[90%]"
                        id="front-card-view"
                        ref={frontCardRef}
                    >
                        <h3 className="font-pixel text-8xl text-background">
                            Old Way
                        </h3>
                        <ul>
                            <li>
                                Manual signing sheets cause long lines and
                                errors.
                            </li>
                            <li>
                                Organizers spend long checking and encoding
                                attendance.
                            </li>
                            <li>
                                Students can not easily verify if they were
                                marked present.
                            </li>
                        </ul>
                    </section>
                    <section
                        className="bg-accent flex flex-col items-center m-10 rounded-xl p-4 absolute backface-hidden rotate-y-180 w-[90%]"
                        id="back-card-view"
                        ref={backCardRef}
                    >
                        <h3 className="font-pixel text-8xl text-background">
                            New Way
                        </h3>
                        <ul>
                            <li>
                                Students just tap their ID on the device, quick
                                and contactless.
                            </li>
                            <li>
                                Attendance logs are automatically saved and
                                updated online.
                            </li>
                            <li>
                                Students and clubs can view records anytime
                                through the website.
                            </li>
                        </ul>
                    </section>
                </div>
            </section>

            {/* HOW IT WORKS  */}
            <section>
                <h2 className="font-bold font-pixel text-center text-4xl">
                    <div className="grid grid-cols-3">
                        <section></section>
                        <section></section>
                        <section></section>
                    </div>
                </h2>
            </section>

            {/* FOOTER CTA  */}
            <section className="flex flex-col items-center h-[calc(100vh-10rem)] justify-center">
                <h2 className="font-bold font-pixel text-center text-6xl">
                    Ready to streamline your events?
                </h2>
                <p className="text-lg">
                    Join other organizations in making event check-ins and outs
                    effortless. Requests your event code today and experience
                    the difference.
                </p>
                <Button className="mt-2">
                    <RectangleEllipsis /> Get your event code now
                </Button>
            </section>
        </div>
    );
};

export default LandingPage;
