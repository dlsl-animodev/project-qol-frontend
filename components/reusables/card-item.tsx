import { twMerge } from "tailwind-merge";

interface CardItemProps {
    children : React.ReactNode;
    className? : string;
}
const CardItem: React.FC<CardItemProps> = ({
    children,
}) => {
    return (
        <li
            className="
                p-4 bg-accent text-accent-foreground rounded-md flex flex-col justify-between
                border
                transition-all hover:-translate-y-5 hover:rotate-2 hover:bg-accent/95 duration-300 ease-out
                shadow-[inset_0_2px_12px_rgba(0,0,0,0.4),inset_0_-2px_4px_rgba(255,255,255,0.3)]
                will-change-transform
            "
        >
            {children}
        </li>
    );
};

const CardItemHeader : React.FC<CardItemProps> = ({
    children,
    className
}) => {
    return (
        <section className={className}>
            {children}
        </section>
    )
}

const CardItemMain : React.FC<CardItemProps> = ({
    children,
    className
}) => {
    return (
        <section className={twMerge(`my-8`, className)}>
            {children}
        </section>
    )
}

const CardItemFooter : React.FC<CardItemProps> = ({
    children,
    className
}) => {
    return (
        <section className={className}>
            {children}
        </section>
    )
}

const CardStats : React.FC<CardItemProps> = ({
    children,
    className
}) => {
    return (
        <ul className={className}>
            {children}
        </ul>
    )
}

const CardStatsItem : React.FC<CardItemProps> = ({
    children,
    className
}) => {
    return (
        <li className={twMerge(`flex items-center gap-2`, className)}>
            {children}
        </li>
    )
}

export { CardItem, CardItemHeader, CardItemMain, CardItemFooter, CardStats, CardStatsItem };