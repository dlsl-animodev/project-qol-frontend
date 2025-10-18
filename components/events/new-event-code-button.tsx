"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Plus } from "lucide-react";
import React from "react";

const NewEventCodeButton: React.FC<
    React.ComponentProps<typeof Button>
> = (props) => {
    const newEventCodeHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const eventCode = formData.get("eventCode");

        console.log(eventCode);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button {...props}>
                    <Plus /> New event code{" "}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-pixel text-accent">
                        New Event Code
                    </DialogTitle>
                    <DialogDescription>
                        Get your event code from{" "}
                        <span className="font-semibold underline">
                            {" "}
                            DLSL Developers Society
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={newEventCodeHandler} className="space-y-4">
                    <Label className="mt-4" htmlFor="eventCode">
                        Event Code{" "}
                    </Label>
                    <Input
                        id="eventCode"
                        name="eventCode"
                        placeholder="Enter your event code here"
                        className="bg-secondary"
                    />
                    <Button type="submit">Confirm</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewEventCodeButton;