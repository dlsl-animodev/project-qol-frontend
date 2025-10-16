"use server";

import TypingAnimation from "@/components/interactive/typing-animation";
import {
    PageContainer,
    PageContentHeader,
    PageContentMain,
    TypingAnimationBackgroundContainer,
} from "@/components/reusables/containers";
import OrganizationsServer from "@/components/organizations/organizations-server";
import { Suspense } from "react";

async function AdminPage() {
    return (
        <>
            <TypingAnimationBackgroundContainer>
                <TypingAnimation
                    text="Good to see you back devers!"
                    className="text-6xl font-bold tracking-wide font-pixel text-center text-primary-foreground " />
            </TypingAnimationBackgroundContainer>

            <PageContainer>
                {/* JUST A CUSTOM NOTE  */}

                <div className="bg-accent px-4 py-1 text-xs rounded-md text-accent-foreground font-bold">
                    THIS IS THE VIEW OF THE ADMINS
                </div>

                <PageContentHeader
                    title="Organizations in Dashboard"
                    description="See and manage organizations and their events here" />

                <PageContentMain>
                    {/* ORGANIZATIONS  */}
                    <Suspense fallback={<div>Loading organizations...</div>}>
                        <OrganizationsServer />
                    </Suspense>
                </PageContentMain>
            </PageContainer>
        </>
    );
}

export default AdminPage;
