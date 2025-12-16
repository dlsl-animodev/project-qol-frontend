import { EventScreen } from "@/components/event/event-screen";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCodeByEventId } from "@/lib/queries/events";
import { notFound } from "next/navigation";

type ScanPageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function ScanPage({ params }: ScanPageProps) {
  const { eventId } = await params;

  if (!eventId) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const codeEntry = await getCodeByEventId(eventId, supabase);

  // Pass the code (if found) to EventScreen; user can still enter manually if not found
  const initialCode = codeEntry?.code ?? null;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />
      <EventScreen initialCode={initialCode} />
    </>
  );
}
