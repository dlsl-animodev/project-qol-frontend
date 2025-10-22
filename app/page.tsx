"use client";

import { Button } from "@/components/ui/button";
import {
    AppWindowMac,
    Check,
    Ellipsis,
    RectangleEllipsis,
    Scan,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SplitTextLocal from "@/components/interactive/split-text-local";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    // detect window scroll y position
    // the front-card-view will rotate as scrolling until the back-card-view will switch and fully visible
    // check if they are in view first and when the top element of the screen goes 80% of their height, start animating
    // the animation should be done when the top element of the back card view + 40% to top hits the top of the screen
    const frontCardRef = useRef(null);
    const backCardRef = useRef(null);
    const processTextRef = useRef<HTMLDivElement | null>(null);
    const [processInView, setProcessInView] = useState(false);
    const flipContainerRef = useRef<HTMLDivElement | null>(null);
    const footerRef = useRef<HTMLElement | null>(null);
    const [footerInView, setFooterInView] = useState(false);
    const howItWorksRef = useRef<HTMLDivElement | null>(null);
    const [howItWorksInView, setHowItWorksInView] = useState(false);

    useEffect(() => {
        // Use ScrollTrigger to control the flip animation tied to scroll.
        // Adjust `flipScrollRange` (pixels) to speed up or slow down the flip.
        // Smaller values -> flip completes over less scroll -> appears faster.
        const flipScrollRange = 200; // px — reduce to speed up the flip

        const front = frontCardRef.current as HTMLElement | null;
        const back = backCardRef.current as HTMLElement | null;
        const container = flipContainerRef.current as HTMLElement | null;

        if (!front || !back || !container) return;

        // ensure starting rotations (front facing 0, back rotated -180)
        gsap.set(front, { rotationY: 0, transformStyle: "preserve-3d" });
        gsap.set(back, { rotationY: -180, transformStyle: "preserve-3d" });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top 50%",
                end: `+=${flipScrollRange}`,
                scrub: 0.25,
                // markers: true,
            },
        });

        // animate rotationY for both cards; using rotationY gives a smoother 3D flip
        tl.to(front, { rotationY: 180, ease: "none" }, 0).to(
            back,
            { rotationY: 0, ease: "none" },
            0
        );

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

    useEffect(() => {
        const el = footerRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setFooterInView(true);
                    obs.unobserve(el);
                }
            },
            { threshold: 0.15 }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!footerInView) return;
        const el = footerRef.current as HTMLElement;
        if (!el) return;

        const para = el.querySelector("p");

        const tl = gsap.timeline();
        if (para) tl.to(para, { y: 0, autoAlpha: 1, duration: 0.5 });

        return () => {
            tl.kill();
        };
    }, [footerInView]);

    useEffect(() => {
        const el = processTextRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setProcessInView(true);
                    obs.unobserve(el);
                }
            },
            { threshold: 0.15 }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // create an observer and set howItWorksInView to true when in view
    useEffect(() => {
        const el = howItWorksRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHowItWorksInView(true);
                    obs.unobserve(el);
                }
            },
            { threshold: 0.15 }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="h-full pb-[10rem]">
            {/* HERO SECTION  */}
            <section className="h-[calc(100vh-3rem)] flex items-center justify-center flex-col ">
                <div className="bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 text-white px-4 py-1 rounded-lg font-bold mb-4">
                    {" "}
                    Developed and maintained by
                    <Link href={"#"} className="underline">
                        {" "}
                        ANIMO.DEV
                    </Link>{" "}
                </div>

                <SplitTextLocal
                    className="text-8xl font-bold font-pixel text-center"
                    type="chars"
                >
                    EFFORTLESS EVENT ATTENDANCE
                </SplitTextLocal>
                <SplitTextLocal
                    className="text-center text-lg w-[50%]"
                    stagger={0.005}
                    type="lines"
                    delay={1}
                >
                    Tired of manual attendance? Say goodbye to long queues and
                    tedious paperwork. Project QOL provides a seamless,
                    IOT-powered solution for managing event check-ins with a
                    simple ID scan
                </SplitTextLocal>
                <SplitTextLocal delay={1.5}>
                    <Button
                        className="mt-4 
                    "
                    >
                        <RectangleEllipsis /> Get started
                    </Button>
                </SplitTextLocal>
            </section>

            {/* PROCESS  */}
            <section className="grid grid-cols-2 items-center bg-accent">
                <div ref={processTextRef}>
                    <SplitTextLocal
                        play={processInView}
                        type="chars"
                        stagger={0.04}
                        className="w-full"
                    >
                        <h2 className="font-bold font-pixel text-left text-6xl text-background  ml-[4rem]">
                            Managing event attendance should not be a hassle
                        </h2>
                    </SplitTextLocal>
                </div>
                <div
                    ref={flipContainerRef}
                    className="relative flex flex-col items-center justify-center h-96 perspective"
                >
                    <section
                        className="bg-red-500 flex flex-col items-center m-10 rounded-xl p-4 absolute backface-hidden w-[90%]"
                        id="front-card-view"
                        ref={frontCardRef}
                    >
                        <h3 className="font-pixel text-8xl">Old Way</h3>
                        <ul className="flex flex-col gap-2">
                            <li className="  px-4 py-2 text-xl font-bold rounded-xl flex items-center gap-2">
                                <X />
                                Manual signing sheets cause long lines and
                                errors.
                            </li>
                            <li className="  px-4 py-2 text-xl font-bold rounded-xl flex items-center gap-2">
                                <X />
                                Organizers spend long checking and encoding
                                attendance.
                            </li>
                            <li className="  px-4 py-2 text-xl font-bold rounded-xl flex items-center gap-2">
                                <X />
                                Students can not easily verify if they were
                                marked present.
                            </li>
                        </ul>
                    </section>
                    <section
                        className="bg-yellow-400 flex flex-col items-center m-10 rounded-xl p-4 absolute backface-hidden rotate-y-180 w-[90%]"
                        id="back-card-view"
                        ref={backCardRef}
                    >
                        <h3 className="font-pixel text-8xl">New Way</h3>
                        <ul>
                            <li className="px-4 py-2 text-xl font-bold rounded-xl flex items-center gap-2">
                                <Check />
                                Students just tap their ID on the device, quick
                                and contactless.
                            </li>
                            <li className="px-4 py-2 text-xl font-bold rounded-xl flex items-center gap-2">
                                <Check />
                                Attendance logs are automatically saved and
                                updated online.
                            </li>
                            <li className="px-4 py-2 text-xl font-bold rounded-xl flex items-center gap-2">
                                <Check />
                                Students and clubs can view records anytime
                                through the website.
                            </li>
                        </ul>
                    </section>
                </div>
            </section>

            {/* HOW IT WORKS  */}
            <div className="pt-[10rem]" ref={howItWorksRef}>
                <SplitTextLocal
                    className="font-bold font-pixel text-center text-6xl mb-8"
                    play={howItWorksInView}
                    type="chars"
                >
                    HOW IT WORKS
                </SplitTextLocal>
                <div className="grid grid-cols-3 px-[5rem] gap-[5rem]">
                    <SplitTextLocal
                        play={howItWorksInView}
                        delay={0.5}
                        type="lines"
                    >
                        <div className="bg-primary flex items-center justify-center rounded-lg  flex-col  p-4 py-8 space-y-4">
                            <Ellipsis
                                size={70}
                                className="bg-secondary p-2 rounded-lg"
                            />
                            <div>
                                <p className="text-lg font-bold">
                                    1. Get a code for your event
                                </p>
                                <p className="text-center">
                                    You can get your code once you log in
                                </p>
                            </div>
                        </div>
                    </SplitTextLocal>
                    <SplitTextLocal play={howItWorksInView} delay={0.5}>
                        <div className="bg-primary flex items-center justify-center rounded-lg  flex-col   p-4 py-8 space-y-4">
                            <Scan
                                size={70}
                                className="bg-secondary p-2 rounded-lg"
                            />
                            <div>
                                <p className="text-lg font-bold">
                                    2. Use the Iot device to scan IDs
                                </p>
                                <p className="text-center">
                                    You can get your code once you log in
                                </p>
                            </div>
                        </div>
                    </SplitTextLocal>
                    <SplitTextLocal play={howItWorksInView} delay={0.5}>
                        <div className="bg-primary flex items-center justify-center rounded-lg  flex-col  p-4 py-8 space-y-4">
                            <AppWindowMac
                                size={70}
                                className="bg-secondary p-2 rounded-lg"
                            />
                            <div>
                                <p className="text-lg font-bold">
                                    3. View records online
                                </p>
                                <p className="text-center">
                                    You can get your code once you log in
                                </p>
                            </div>
                        </div>
                    </SplitTextLocal>
                </div>
            </div>

            {/* FOOTER CTA  */}
            <section
                ref={footerRef}
                className="flex flex-col items-center  h-[calc(100vh-10rem)] pt-[10rem] justify-center"
            >
                <SplitTextLocal
                    play={footerInView}
                    type="chars"
                    className="w-full text-center"
                >
                    <h2 className="font-bold font-pixel text-6xl">
                        Ready to streamline your events?
                    </h2>
                </SplitTextLocal>
                <SplitTextLocal
                    play={footerInView}
                    stagger={0.06}
                    delay={1}
                    type="lines"
                    className="text-lg"
                >
                    Join other organizations in making event check-ins and outs
                    effortless. Requests your event code today and experience
                    the difference.
                </SplitTextLocal>
                <SplitTextLocal play={footerInView} delay={1.5}>
                    <Button className="mt-2">
                        <RectangleEllipsis /> Get your event code now
                    </Button>
                </SplitTextLocal>
            </section>
        </div>
    );
};

export default LandingPage;
