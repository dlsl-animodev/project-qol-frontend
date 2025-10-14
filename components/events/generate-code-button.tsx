"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import React from "react";

const GenerateCodeButton: React.FC<React.ComponentProps<typeof Button>> = (
    props
) => {
    const generateCodeHandler = () => {
        // Generate 6 alphanumeric code then copy to clipboard

        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        navigator.clipboard.writeText(result);
        toast.success("Event code copied to clipboard!", {
            description: `Code: ${result}`,
        });
    };

    return (
        <Button
            variant={props.variant || "secondary"}
            onClick={generateCodeHandler}
            {...props}
        >
            Generate code
        </Button>
    );
};

export default GenerateCodeButton;
