"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import ProblemSolutionSection from "@/components/landing-page/problem-solution-section";
import HowItWorksSection from "@/components/landing-page/how-it-works-section";
import FooterCTASection from "@/components/landing-page/footer-cta-section";
import HeroSection from "@/components/landing-page/hero-section";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    return (
        <div className="h-full pb-[10rem]">
            {/* HERO SECTION  */}
            <HeroSection />
            <ProblemSolutionSection />
            <HowItWorksSection />
            <FooterCTASection />
        </div>
    );
};

export default LandingPage;
