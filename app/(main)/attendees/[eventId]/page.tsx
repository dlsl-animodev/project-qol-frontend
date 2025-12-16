export const dynamic = "force-dynamic";

import AttendanceTable, {
  Columns,
} from "@/components/attendees/attendance-table";
import {
  PageContainer,
  PageContentHeader,
} from "@/components/reusables/containers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getEventAttendance } from "@/lib/queries/attendance";

type EventAttendeesPageProps = {
  params: Promise<{ eventId: string }>;
};

const formatDateTime = (iso: string | null | undefined) => {
  if (!iso) return "";
  const date = new Date(iso);
  return isNaN(date.getTime()) ? "" : date.toLocaleString();
};

const EventAttendeesPage = async ({ params }: EventAttendeesPageProps) => {
  const { eventId } = await params;

  let eventError: string | null = null;
  let attendanceError: string | null = null;
  const supabase = await createSupabaseServerClient();

  // Fetch event name (optional, fallback to generic title)
  let eventName: string | null = null;
  let attendanceRows: Columns[] = [];

  if (!eventId) {
    eventError = "Missing event id in route.";
  } else {
    const { data: event, error: eError } = await supabase
      .from("events")
      .select("event_name")
      .eq("id", eventId)
      .single();

    if (eError) {
      eventError = eError.message;
      console.error("Error fetching event:", eError);
    } else {
      eventName = event?.event_name ?? null;
    }

    const attendance = await getEventAttendance(eventId, supabase);
    attendanceRows = attendance.map((entry) => ({
      id: entry.student_id,
      time_in: formatDateTime(entry.tapped_at),
      name: entry.student_name ?? "Unknown",
      email: entry.email_address ?? "",
      time_out: "", // no time_out in schema yet
      isMember: true, // adjust when membership data is available
    }));

    if (!attendance.length) {
      // getEventAttendance already logs; add a soft message for debugging
      attendanceError = attendanceError ?? null;
    }
  }

  return (
    <PageContainer>
      <PageContentHeader
        title={eventName ?? "Attendees"}
        description={
          eventError ? `Error: ${eventError}` : "View attendees for this event"
        }
      />
      {attendanceError ? (
        <div className="text-sm text-red-500">{attendanceError}</div>
      ) : null}
      <AttendanceTable data={attendanceRows} />
    </PageContainer>
  );
};

export default EventAttendeesPage;
