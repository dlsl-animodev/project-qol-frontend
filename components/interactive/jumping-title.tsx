import React from "react";

interface JumpingTitleProps {
    text: string;
    className?: string;
}

const JumpingTitle: React.FC<JumpingTitleProps> = ({ text, className }) => {
    return (
        <h1 className={`inline-flex ${className}`}>
            {text.split("").map((char, index) => {
                const isSpace = char === " ";
                // optional random delay for playful effect
                return (
                    <span
                        key={index}
                        className="inline-block transition-transform duration-300 ease-out hover:-translate-y-4 hover:scale-110 hover:rotate-3"
                        style={{
                            display: "inline-block",
                            width: isSpace ? "0.5em" : undefined,
                            transformOrigin: "center",
                            willChange: "transform",
                        }}
                    >
                        {isSpace ? "\u00A0" : char}
                    </span>
                );
            })}
        </h1>
    );
};

export default JumpingTitle;
