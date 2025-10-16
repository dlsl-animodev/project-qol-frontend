"use server";

import { requireUser } from "@/lib/supabase/auth";
/*
    THIS COMPONENT IS FOR SERVER SIDE RENDERING OF EVENTS

    This component fetches the events from the database and renders them on the server side
    This is done to improve the performance of the application and to reduce the load on the client side

    Filename is events-server.tsx to indicate that this is a server component
    Later on when client side functionality is needed, we can create events-client.tsx
    This setup separates server and client components for better organization and maintainability
*/

import { CardContainer } from "../reusables/containers";
import EventCard from "./event-card";
import { getEventsForUser } from "@/lib/queries/events";
import { Event } from "@/types/database";

export interface EventsServerProps {
    eventUserId?: string;
}

async function EventsServer({ eventUserId }: EventsServerProps) {
    const user = await requireUser();
    const userId = eventUserId || user.id;

    const events: Event[] = await getEventsForUser(userId);

    if (events.length === 0) {
        return (
            <div className="text-center text-muted-foreground">
                No events found for you, request an event to be created for you.
            </div>
        );
    }

    return (
        <CardContainer>
            {events.map((event: Event, index) => (
                <EventCard
                    id={index.toString()}
                    key={index}
                    title={event.event_name}
                    description={event.description || 'No description provided'}
                    status={"Scheduled"}
                    attendees={0}
                    date={event.event_date}
                    location={"Not specified"}
                    time={"Not Specificed"} />
            ))}
        </CardContainer>
    );
}

export default EventsServer;
