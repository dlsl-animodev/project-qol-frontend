"use client";

import SplitTextLocal from "../interactive/split-text-local";
import { Check, LucideProps, X } from "lucide-react";

import gsap from "gsap";
import {
    useEffect,
    useRef,
    ForwardRefExoticComponent,
    RefAttributes,
    Ref,
} from "react";
import { useInView } from "@/hooks/use-inView";

const PROBLEM_POINTS = {
    title: "Old Way",
    // for rendering the view
    id: "front-card-view",
    // mappable points
    points: [
        "Manual singing sheets cause long lines and errors",
        "Organizers spend long checking and encoding attendance",
        "Students can not easily verify if they were marked present",
    ],
};

const SOLUTION_POINTS = {
    title: "New Way",
    // for rendering the view
    id: "back-card-view",
    // mappable points
    points: [
        "Students just tap their ID on the device, quick and contactless.",
        "Attendance logs are automatically saved and updated online.",
        "Students and clubs can view records anytime through the website.",
    ],
};

const ProblemSolutionSection = () => {
    const { ref: processRef, inView: processInView } = useInView();
    // detect window scroll y position
    // the front-card-view will rotate as scrolling until the back-card-view will switch and fully visible
    // check if they are in view first and when the top element of the screen goes 80% of their height, start animating
    // the animation should be done when the top element of the back card view + 40% to top hits the top of the screen
    const frontCardRef = useRef(null);
    const backCardRef = useRef(null);
    const flipContainerRef = useRef<HTMLDivElement | null>(null);

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

    return (
        <section
            ref={processRef}
            className="grid grid-cols-1 md:grid-cols-2 items-center bg-accent shadow border-y"
        >
            <>
                <div>
                    {processInView && (
                        <SplitTextLocal
                            type="chars"
                            stagger={0.04}
                            className="w-full"
                        >
                            <h2 className="font-bold font-pixel text-center md:text-left text-5xl lg:text-6xl text-background md:ml-[4rem] mt-[3rem] md:mt-[0rem] mx-4">
                                Managing event attendance should not be a hassle
                            </h2>
                        </SplitTextLocal>
                    )}
                </div>
                <div
                    ref={flipContainerRef}
                    className="relative flex flex-col items-center justify-center h-96 perspective"
                >
                    <CardView
                        ref={frontCardRef}
                        {...PROBLEM_POINTS}
                        icon={X}
                        className="bg-red-500 "
                    />
                    <CardView
                        ref={backCardRef}
                        {...SOLUTION_POINTS}
                        icon={Check}
                        className="bg-yellow-400 "
                    />
                </div>
            </>
        </section>
    );
};

export default ProblemSolutionSection;

interface CardViewProps {
    ref?: Ref<HTMLElement>;
    id: string;
    title: string;
    points: string[];
    icon: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    className?: string;
}

const CardView: React.FC<CardViewProps> = ({
    ref,
    title,
    points,
    icon: Icon,
    className,
}) => {
    return (
        <section
            className={`flex flex-col items-center m-10 rounded-xl p-4 absolute backface-hidden rotate-y-180 w-[90%] ${className}`}
            id="back-card-view"
            ref={ref}
        >
            <h3 className="font-pixel text-7xl md:text-6xl lg:text-7xl xl:text-8xl">
                {title}
            </h3>
            <ul>
                {points.map((text, index) => (
                    <li
                        key={index}
                        className="px-4 py-2 text-base lg:text-xl font-bold rounded-xl flex items-center gap-2"
                    >
                        <Icon />
                        {text}
                    </li>
                ))}
            </ul>
        </section>
    );
};
