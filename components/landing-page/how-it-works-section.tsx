import { Ellipsis, Scan, AppWindowMac } from "lucide-react";
import SplitTextLocal from "../interactive/split-text-local";
import { useInView } from "@/hooks/use-inView";

const HOW_IT_WORKS_STEPS = [
    {
        title: "1. Get a code for your event",
        description: "You can get your code once you log in",
        icon: <Ellipsis size={70} className="bg-secondary p-2 rounded-lg" />,
    },
    {
        title: "2. Scan IDs for your event",
        description: "You can get your code once you log in",
        icon: <Scan size={70} className="bg-secondary p-2 rounded-lg" />,
    },
    {
        title: "3. View the records online",
        description: "You can get your code once you log in",
        icon: (
            <AppWindowMac size={70} className="bg-secondary p-2 rounded-lg" />
        ),
    },
];

const HowItWorksSection = () => {
    const { ref: howItWorksRef, inView: howItWorksInView } = useInView();

    return (
        <section className="pt-[10rem]" ref={howItWorksRef}>
            {howItWorksInView && (
                <>
                    <SplitTextLocal type="chars">
                        <h2 className="font-bold font-pixel text-center text-6xl mb-10">
                            HOW IT WORKS
                        </h2>
                    </SplitTextLocal>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-[2rem] md:px-[2rem] lg:px-[5rem] gap-[2rem] md:gap-[2rem] lg:gap-[5rem] ">
                        {HOW_IT_WORKS_STEPS.map((step, index) => (
                            <SplitTextLocal
                                key={index}
                                play={howItWorksInView}
                                delay={(index + 1) * 0.5}
                                className={` bg-primary flex items-center justify-center rounded-lg flex-col p-4 py-8 space-y-4 shadow border ${index === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}
                            >
                                {step.icon}
                                <div>
                                    <p className="text-lg font-bold">
                                        {step.title}
                                    </p>
                                    <p>{step.description}</p>
                                </div>
                            </SplitTextLocal>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default HowItWorksSection;
