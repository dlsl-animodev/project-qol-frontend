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
                p-4 bg-accent text-accent-foreground rounded-md flex flex-col justify-between hover:opacity-95 transition-opacity
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