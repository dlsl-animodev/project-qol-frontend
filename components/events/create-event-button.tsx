"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "@/app/actions/events";
import { toast } from "sonner";
import { CalendarPlus, Loader2 } from "lucide-react";

interface CreateEventButtonProps {
    userId: string;
    organizationName?: string;
    variant?: "primary" | "secondary" | "outline" | "destructive" | "link" | "ghost";
    className?: string;
}

export default function CreateEventButton({
    userId,
    organizationName,
    variant = "outline",
    className = "",
}: CreateEventButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        eventName: "",
        eventDate: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createEvent({
                event_name: formData.eventName,
                event_date: formData.eventDate,
                description: formData.description || undefined,
                user_id: userId,
            });

            if (result.success) {
                
                if (result.code?.code) {
                    navigator.clipboard.writeText(result.code.code);
                    toast.success("Event Created Successfully!", {
                        description: `Code: ${result.code.code} (copied to clipboard)`,
                        duration: 5000,
                    });
                } else {
                    toast.success("Event Created", {
                        description: result.message || "Event created successfully!",
                    });
                }
                setFormData({ eventName: "", eventDate: "", description: "" });
                setOpen(false);
            } else {
                toast.error("Error", {
                    description: result.error || "Failed to create event",
                });
            }
        } catch {
            toast.error("Error", {
                description: "An unexpected error occurred",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} className={className}>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Create Event
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Event</DialogTitle>
                        <DialogDescription>
                            Create a new event for{" "}
                            <span className="font-semibold">
                                {organizationName || "this organization"}
                            </span>
                            . An event code will be automatically generated.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="eventName">Event Name *</Label>
                            <Input
                                id="eventName"
                                value={formData.eventName}
                                onChange={(e) =>
                                    setFormData({ ...formData, eventName: e.target.value })
                                }
                                placeholder="e.g., General Assembly Meeting"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="eventDate">Event Date *</Label>
                            <Input
                                id="eventDate"
                                type="datetime-local"
                                value={formData.eventDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, eventDate: e.target.value })
                                }
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Optional event description..."
                                rows={4}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Event"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
