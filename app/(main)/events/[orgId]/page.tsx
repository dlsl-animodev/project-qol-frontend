"use server";

import GenerateCodeButton from "@/components/events/generate-code-button";
import {
    PageContainer,
    PageContentHeader,
    PageContentMain,
} from "@/components/reusables/containers";
import { Suspense } from "react";
import EventsServer from "@/components/events/events-server";
import { getUserData } from "@/lib/queries/user";

async function OrganizationEventsPage({
    params,
}: {
    params: { orgId: string };
}) {
    const { orgId } = params;

    const orgData = await getUserData(orgId);

    return (
        <PageContainer>
            <PageContentHeader
                title={orgData?.full_name || orgData?.name || "Unknown Organization"}
                description="See and manage the events of this organization"
            />

            <PageContentMain>
                <Suspense>
                    <GenerateCodeButton variant={"primary"} className="self-start mb-4" />
                    {/* EVENTS  */}
                    <EventsServer eventUserId={orgId} />
                </Suspense>
            </PageContentMain>
        </PageContainer>
    );
}

export default OrganizationEventsPage;
