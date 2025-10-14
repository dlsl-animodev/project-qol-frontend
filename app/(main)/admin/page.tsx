import TypingAnimation from "@/components/interactive/typing-animation";
import {
    PageContainer,
    PageContentHeader,
    PageContentMain,
    TypingAnimationBackgroundContainer,
} from "@/components/reusables/containers";
import ClubsServer from "@/components/clubs/clubs-server";
import { Suspense } from "react";

const AdminPage = () => {
    return (
        <>
            <TypingAnimationBackgroundContainer>
                <TypingAnimation
                    text="Good to see you back devers!"
                    className="text-6xl font-bold tracking-wide font-pixel text-center text-primary-foreground "
                />
            </TypingAnimationBackgroundContainer>

            <PageContainer>
                {/* JUST A CUSTOM NOTE  */}

                <div className="bg-accent px-4 py-1 text-xs rounded-md text-accent-foreground font-bold">
                    THIS IS THE VIEW OF THE ADMINS
                </div>

                <PageContentHeader
                    title="Clubs in Dashboard"
                    description="See and manage clubs and their events here"
                />

                <PageContentMain>
                    {/* CLUBS  */}
                    <Suspense fallback={<div>Loading clubs...</div>}>
                        <ClubsServer />
                    </Suspense>
                </PageContentMain>
            </PageContainer>
        </>
    );
};

export default AdminPage;
