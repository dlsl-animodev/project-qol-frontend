import { Button } from "@/components/ui/button";
import SplitTextLocal from "../interactive/split-text-local";

import { useInView } from "@/hooks/use-inView";
import Link from "next/link";

const FooterCTASection = () => {
    const { ref: footerRef, inView: footerInView } = useInView();

    return (
        <section
            ref={footerRef}
            className="flex flex-col items-center h-[calc(100vh-8rem)] md:h-[calc(100vh-18rem)] pt-[10rem] md:pt-[12rem] justify-center px-[2rem] gap-4"
        >
            {footerInView && (
                <>
                    <SplitTextLocal type="chars" className="w-full text-center">
                        <h2 className="font-bold font-pixel text-4xl sm:text-5xl md:text-6xl">
                            Ready to streamline your events?
                        </h2>
                    </SplitTextLocal>
                    <SplitTextLocal
                        play={footerInView}
                        stagger={0.06}
                        delay={1}
                        type="lines"
                        className="text-center text-xs sm:text-sm md:text-lg max-w-5xl "
                    >
                        Join other organizations in making event check-ins and
                        outs effortless. Requests your event code today and
                        experience the difference.
                    </SplitTextLocal>
                    <SplitTextLocal play={footerInView} delay={1.5}>
                        <Button className="mt-2" asChild size={"lg"}>
                            <Link href={"/home"}>Get Event Code</Link>
                        </Button>
                    </SplitTextLocal>
                </>
            )}
        </section>
    );
};

export default FooterCTASection;
