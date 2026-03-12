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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CalendarX } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAttendanceCount } from "@/lib/queries/attendance";

export interface EventsServerProps {
  eventUserId?: string;
}

async function EventsServer({ eventUserId }: EventsServerProps) {
  const user = await requireUser();
  const userId = eventUserId || user.id;
  const supabase = await createSupabaseServerClient();

  const events: Event[] = await getEventsForUser(userId);

  const eventsWithAttendance = await Promise.all(
    events.map(async (event) => ({
      event,
      attendees: await getAttendanceCount(event.id, supabase),
    })),
  );

  if (events.length === 0) {
    return (
      <Empty className="w-full border bg-muted/10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarX className="size-6" />
          </EmptyMedia>
          <EmptyTitle className="font-pixel text-accent">
            No events yet
          </EmptyTitle>
          <EmptyDescription>Create your first event.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <CardContainer>
      {eventsWithAttendance.map(({ event, attendees }) => (
        <EventCard
          id={event.id}
          key={event.id}
          title={event.event_name}
          description={event.description || "No description provided"}
          status={"Scheduled"}
          attendees={attendees}
          date={event.event_date}
          location={"Not specified"}
          time={"Not Specificed"}
        />
      ))}
    </CardContainer>
  );
}

export default EventsServer;
