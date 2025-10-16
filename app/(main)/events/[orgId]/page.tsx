"use server";

import GenerateCodeButton from "@/components/events/generate-code-button";
import {
    PageContainer,
    PageContentHeader,
    PageContentMain,
} from "@/components/reusables/containers";
import { Suspense } from "react";
import EventsServer from "@/components/events/events-server";

async function OrganizationEventsPage() {
    return (
        <PageContainer>
            <PageContentHeader
                title="Organization Name"
                description="See and manage the events of this organization" />

            <PageContentMain>
                <Suspense fallback={<div>Loading events...</div>}>
                    <GenerateCodeButton
                        variant={"primary"}
                        className="self-start mb-4" />
                    {/* EVENTS  */}
                    <EventsServer />
                </Suspense>
            </PageContentMain>
        </PageContainer>
    );
}

export default OrganizationEventsPage;
