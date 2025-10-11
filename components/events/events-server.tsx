/*
    THIS COMPONENT IS FOR SERVER SIDE RENDERING OF EVENTS

    This component fetches the events from the database and renders them on the server side
    This is done to improve the performance of the application and to reduce the load on the client side

    Filename is events-server.tsx to indicate that this is a server component
    Later on when client side functionality is needed, we can create events-client.tsx
    This setup separates server and client components for better organization and maintainability
*/

import { dummyEvents } from "@/dummy";
import { CardContainer } from "../reusables/containers";
import EventCard from "./event-card";

const EventsServer = async () => {
    // Simulate an await for fetching data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return (
        <CardContainer>
            {dummyEvents.map((event, index) => (
                <EventCard
                    id={index.toString()}
                    key={index}
                    title={event.title}
                    description={event.description}
                    status={event.status}
                    attendees={event.attendees}
                    date={event.date}
                    location={event.location}
                    time={event.time}
                />
            ))}
        </CardContainer>
    );
};

export default EventsServer;
