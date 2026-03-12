import { Button } from "@/components/ui/button";
import SplitTextLocal from "@/components/interactive/split-text-local";
import AnimoDevBadge from "../reusables/animo-dev-badge";
import Link from "next/link";

const HeroSection = () => {
    return (
        <section className="h-[calc(100vh-4rem)] flex items-center justify-center flex-col gap-2">
            <AnimoDevBadge />

            <SplitTextLocal
                className="text-5xl sm:text-7xl md:text-8xl font-bold font-pixel text-center"
                type="chars"
            >
                <h1>EFFORTLESS EVENT ATTENDANCE</h1>
            </SplitTextLocal>
            <SplitTextLocal
                className="text-center text-xs sm:text-sm md:text-lg max-w-5xl "
                stagger={0.005}
                type="lines"
                delay={1}
            >
                Tired of manual event check-ins and check-outs tracking? Project
                QOL provides a seamless, IOT-powered solution for managing event
                check-ins and check outs with a simple ID scan
            </SplitTextLocal>
            <SplitTextLocal delay={1.5}>
                <Button className="mt-2" asChild size={"lg"}>
                    <Link href={"/home"}>Get started</Link>
                </Button>
            </SplitTextLocal>
        </section>
    );
};

export default HeroSection;
