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

type AdminPageProps = {
    searchParams?: { [key: string]: string | string[] | undefined };
};

async function AdminPage({ searchParams }: AdminPageProps) {
    const pageParam =
        typeof searchParams?.page === "string"
            ? parseInt(searchParams!.page)
            : 1;
    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

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
                <div className="flex flex-col items-center gap-4">
                    <p className="w-fit bg-accent px-4 py-1 text-xs rounded-md text-accent-foreground font-bold">
                        THIS IS THE VIEW OF THE ADMINS
                    </p>

                    <PageContentHeader
                        title="Organizations in Dashboard"
                        description="See and manage organizations and their events here"
                    />
                </div>

                <PageContentMain>
                    {/* ORGANIZATIONS  */}
                    <Suspense fallback={<div>Loading organizations...</div>}>
                        <OrganizationsServer page={page} pageSize={9} />
                    </Suspense>
                </PageContentMain>
            </PageContainer>
        </>
    );
}

export default AdminPage;
