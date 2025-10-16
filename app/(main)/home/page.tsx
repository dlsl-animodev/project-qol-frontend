import TypingAnimation from "@/components/interactive/typing-animation";
import {
    PageContainer,
    PageContentHeader,
    PageContentMain,
    TypingAnimationBackgroundContainer,
} from "@/components/reusables/containers";
import EventsServer from "@/components/events/events-server";
import { Suspense } from "react";
import NewEventCodeButton from "@/components/events/new-event-code-button";

const HomePage = () => {
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
                <div className="bg-accent px-4 py-1 text-xs rounded-md text-accent-foreground font-bold">
                    THIS IS THE VIEW OF THE ORGANIZATIONS. GO ADMIN FOR ADMIN VIEW.
                </div>

                <PageContentHeader
                    title="Events in Dashboard"
                    description="See, manage, and add new events here"
                />

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
