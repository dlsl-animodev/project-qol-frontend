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

const NewEventCodeButton: React.FC<React.ComponentProps<typeof Button>> = (
  props
) => {
  const newEventCodeHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const eventTitle = formData.get("eventTitle");
    const eventStartDate = formData.get("eventStartDate");
    const eventEndDate = formData.get("eventEndDate");

    const start =
      typeof eventStartDate === "string" && eventStartDate
        ? new Date(eventStartDate)
        : null;
    const end =
      typeof eventEndDate === "string" && eventEndDate
        ? new Date(eventEndDate)
        : null;

    if (start && end && end < start) {
      alert("End time must be after start time.");
      return;
    }

    console.log({ eventTitle, start, end });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>
          <Plus /> Submit a new event{" "}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-pixel text-accent">
            Submit a new event
          </DialogTitle>
          <DialogDescription>
            blah blah blah to submit to
            <span className="font-semibold underline">
              {" "}
              DLSL Developers Society
            </span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={newEventCodeHandler} className="space-y-4">
          <Label className="mt-4" htmlFor="eventTitle">
            Event Title{" "}
          </Label>
          <Input
            id="eventTitle"
            name="eventTitle"
            placeholder="Enter your event title here"
            className="bg-secondary"
          />
          <Label className="mt-4" htmlFor="eventStartDate">
            Start Date & Time
          </Label>
          <Input
            id="eventStartDate"
            name="eventStartDate"
            type="datetime-local"
            className="bg-secondary"
          />
          <Label className="mt-4" htmlFor="eventEndDate">
            End Date & Time
          </Label>
          <Input
            id="eventEndDate"
            name="eventEndDate"
            type="datetime-local"
            className="bg-secondary"
          />
          <Button type="submit">Confirm</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEventCodeButton;
