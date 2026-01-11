import React from "react";
import JumpingTitle from "../interactive/jumping-title";
import { Description } from "./texts";
import { twMerge } from "tailwind-merge";

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}
const PageContainer: React.FC<ContainerProps> = ({ children, className }) => {
    return (
        <section
            className={twMerge(
                `flex flex-col items-center py-[4rem] px-[6rem] gap-6`,
                className
            )}
        >
            {children}
        </section>
    );
};

interface PageContentHeaderProps {
    className?: string;
    title: string;
    description: string;
}

const PageContentHeader: React.FC<PageContentHeaderProps> = ({
    className,
    title,
    description,
}) => {
    return (
        <section
            className={twMerge(
                `flex flex-col items-center text-accent`,
                className
            )}
        >
            <JumpingTitle
                text={title}
                className="text-5xl font-bold font-pixel tracking-wide"
            />
            <Description className="font-medium">{description}</Description>
        </section>
    );
};

const PageContentMain: React.FC<ContainerProps> = ({ children }) => {
    return <section>{children}</section>;
};

const CardContainer: React.FC<ContainerProps> = ({ children, className }) => {
    return (
        <ul className={twMerge("grid grid-cols-3 gap-4 w-full", className)}>
            {children}
        </ul>
    );
};

const TypingAnimationBackgroundContainer: React.FC<ContainerProps> = ({
    children,
    className,
}) => {
    return (
        <section
            className={twMerge(
                `relative flex flex-col items-center justify-center py-[4rem] min-h-[30vh]`,
                className
            )}
        >
            <div className="absolute inset-0 bg-[url('/images/gradient-background-v2.png')] bg-cover bg-center bg-no-repeat shadow-lg border-b"></div>
            <div className="relative z-10 px-8 py-4 rounded-lg bg-white/20 backdrop-blur-md border border-white/30">
                {children}
            </div>
        </section>
    );
};

export {
    PageContainer,
    PageContentHeader,
    PageContentMain,
    CardContainer,
    TypingAnimationBackgroundContainer,
};
