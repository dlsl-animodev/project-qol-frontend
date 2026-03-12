import TypingAnimation from "@/components/interactive/typing-animation";
import {
  PageContainer,
  PageContentHeader,
  PageContentMain,
  TypingAnimationBackgroundContainer,
} from "@/components/reusables/containers";
import EventsServer from "@/components/events/events-server";
import { Suspense } from "react";
import CreateEventButton from "@/components/events/create-event-button";
import { requireUser } from "@/lib/supabase/auth";

const HomePage = async () => {
  const user = await requireUser();

  return (
    <>
      <TypingAnimationBackgroundContainer>
        <TypingAnimation
          text="What event do we have for today?"
          className="text-6xl font-bold tracking-wide font-pixel text-center text-primary-foreground "
        />
      </TypingAnimationBackgroundContainer>

      <PageContainer>
        {/* JUST A CUSTOM NOTE  */}
        <div className="flex flex-col items-center gap-4">
          <p className="bg-accent px-4 py-1 text-[16px] rounded-md text-accent-foreground font-bold">
            CREATE YOUR EVENT, SCAN IDS, AND TRACK ATTENDANCE HERE
          </p>
          <PageContentHeader
            title="Events in Dashboard"
            description="Create your own events, open them to scan IDs, and review attendance anytime."
          />
          <CreateEventButton
            userId={user.id}
            variant="primary"
            className="mb-4"
          />
        </div>

        <PageContentMain>
          {/* EVENTS  */}
          <Suspense fallback={<div>Loading events...</div>}>
            <EventsServer />
          </Suspense>
        </PageContentMain>
      </PageContainer>
    </>
  );
};

export default HomePage;
