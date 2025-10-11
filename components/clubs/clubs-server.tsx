/*
    THIS COMPONENT IS FOR SERVER SIDE RENDERING OF CLUBS

    This component fetches the clubs from the database and renders them on the server side
    This is done to improve the performance of the application and to reduce the load on the client side

    Filename is clubs-server.tsx to indicate that this is a server component
    Later on when client side functionality is needed, we can create clubs-client.tsx
    This setup separates server and client components for better organization and maintainability
*/

import { dummyClubs } from "@/dummy";
import { CardContainer } from "../reusables/containers";
import ClubCard from "./club-card";

const ClubsServer = async () => {
    // Simulate an await for fetching data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return (
        <CardContainer>
            {dummyClubs.map((club, index) => (
                <ClubCard
                    id={index.toString()}
                    key={club.name}
                    name={club.name}
                    description={club.description}
                    pastEvents={club.pastEvents}
                    upcomingEvents={club.upcomingEvents}
                />
            ))}
        </CardContainer>
    )
};

export default ClubsServer;