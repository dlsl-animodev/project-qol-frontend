import { twMerge } from "tailwind-merge";

interface TextProps {
    children: React.ReactNode;
    className?: string;
}
const Title: React.FC<TextProps> = ({ children, className }) => {
    return (
        <h1 className={twMerge(`text-3xl font-bold`, className)}>
            {" "}
            {children}{" "}
        </h1>
    );
};

const Subtitle: React.FC<TextProps> = ({ children, className }) => {
    return <h2 className={twMerge(`text-lg font-semibold`, className)}> {children} </h2>;
};

const Description: React.FC<TextProps> = ({ children, className }) => {
    return (
        <p className={twMerge(`text-sm text-muted-foreground font-medium`, className)}>
            {" "}
            {children}{" "}
        </p>
    );
};

export { Title, Subtitle, Description };
