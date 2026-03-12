import React from "react";
import {
  Mail,
  ClipboardCheck,
  CalendarCheck,
  LucideIcon,
} from "lucide-react";
import SplitTextLocal from "../interactive/split-text-local";
import { useInView } from "@/hooks/use-inView";

type HowItWorksStep = {
  step: number;
  title: string;
  description: React.ReactNode;
  Icon: LucideIcon;
};

const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    title: "Email your event details",
    description: (
      <span>
        Send event details to{" "}
        <a
          href="mailto:developers.society@dlsl.edu.ph"
           className="text-black hover:underline hover:text-blue-500 decoration-black transition-colors"
          aria-label="Email Developers Society at developers.society@dlsl.edu.ph"
        >
          developers.society@dlsl.edu.ph
        </a>
        .
      </span>
    ), // 5 words
    Icon: Mail,
  },
  {
    step: 2,
    title: "Admin verification",
    description: <span>Admins review and verify your event submission.</span>, // 7 words
    Icon: ClipboardCheck,
  },
  {
    step: 3,
    title: "Event listing",
    description: <span>Admins will list your event after approval.</span>, // 7 words
    Icon: CalendarCheck,
  },
  {
    step: 4,
    title: "View your event",
    description: <span>View the event on your organizer dashboard.</span>, // 7 words
    Icon: CalendarCheck,
  },
];

type StepCardProps = {
  step: HowItWorksStep;
  index: number;
  play: boolean;
};

const StepCard = ({ step, index, play }: StepCardProps) => {
  const Icon = step.Icon;
  return (
    <div className="flex flex-col items-center w-[220px] shrink-0">
      <div
        aria-hidden="true"
        className="w-9 h-9 bg-secondary text-primary rounded-full flex items-center justify-center text-sm font-bold mb-2"
      >
        {step.step}
      </div>
      <SplitTextLocal
        play={play}
        delay={index * 0.15}
        className={[
          "bg-primary flex flex-col items-center justify-center w-full", 
          "p-8 gap-2 text-center rounded-3xl min-h-[350px] border-2 border-secondary/30",
          "shadow-[4px_4px_0px_rgba(0,0,0,0.15)]", // custom depth shadow
          "transition-opacity duration-300 transform",
          "hover:scale-105 hover:rotate-2",
          play ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {/* Icon */}
        <Icon
          size={80}
          strokeWidth={1.5}
          aria-hidden="true"
          className="bg-secondary p-3.5 rounded-2xl shrink-0"
        />

        {/* Text content */}
        <div className="flex flex-col gap-2">
     <h3 className="text-lg font-semibold leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
            {step.title}
          </h3>
           <p className="text-sm leading-relaxed opacity-80">
            {step.description}
          </p>
        </div>
      </SplitTextLocal>
    </div>
  );
};

const HowItWorksSection = () => {
  const { ref: howItWorksRef, inView: howItWorksInView } = useInView();

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="pt-40 pb-20"
      ref={howItWorksRef}
    >
      <SplitTextLocal type="chars" play={howItWorksInView}>
        <h2
          id="how-it-works-heading"
          className="font-bold font-pixel text-center text-5xl md:text-7xl mb-12"
        >
          HOW IT WORKS
        </h2>
      </SplitTextLocal>

      <div className="flex flex-wrap justify-center gap-6 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <StepCard
            key={step.step}
            step={step}
            index={index}
            play={howItWorksInView}
          />
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
