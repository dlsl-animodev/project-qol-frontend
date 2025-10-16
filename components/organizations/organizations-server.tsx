/*
    THIS COMPONENT IS FOR SERVER SIDE RENDERING OF ORGANIZATIONS

    This component fetches the organizations from the database and renders them on the server side
    This is done to improve the performance of the application and to reduce the load on the client side

    Filename is organizations-server.tsx to indicate that this is a server component
    Later on when client side functionality is needed, we can create organizations-client.tsx
    This setup separates server and client components for better organization and maintainability
*/

import { dummyClubs } from "@/dummy";
import { CardContainer } from "../reusables/containers";
import OrganizationCard from "./organization-card";

async function OrganizationsServer() {
    // Simulate an await for fetching data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return (
        <CardContainer>
            {dummyClubs.map((club, index) => (
                <OrganizationCard
                    id={index.toString()}
                    key={club.name}
                    name={club.name}
                    description={club.description}
                    pastEvents={club.pastEvents}
                    upcomingEvents={club.upcomingEvents} />
            ))}
        </CardContainer>
    );
}

export default OrganizationsServer;