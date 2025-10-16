"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
    CardContainer,
    PageContainer,
    PageContentMain,
} from "@/components/reusables/containers";
import {
    CardItem,
    CardItemFooter,
    CardItemHeader,
    CardItemMain,
    CardStats,
    CardStatsItem,
} from "@/components/reusables/card-item";

export default function Loading() {
    return (
        <PageContainer>
            {/* Header skeleton (org name + description) */}
            <div className="flex flex-col items-center text-accent gap-2">
                <Skeleton className="h-10 w-[24rem] max-w-[80vw]" />
                <Skeleton className="h-5 w-[28rem] max-w-[80vw]" />
            </div>

            <PageContentMain>
                {/* Generate code button skeleton */}
                <Skeleton className="h-10 w-56 mb-4 self-start" />

                {/* Event cards skeleton grid */}
                <CardContainer>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CardItem key={i}>
                            {/* Header: title + description + status badge */}
                            <CardItemHeader className="flex items-start justify-between">
                                <span className="flex flex-col gap-2">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-4 w-52 opacity-60" />
                                </span>
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </CardItemHeader>

                            {/* Main: stats grid */}
                            <CardItemMain>
                                <CardStats className="grid grid-cols-2 gap-2">
                                    {Array.from({ length: 4 }).map((_, j) => (
                                        <CardStatsItem key={j}>
                                            <Skeleton className="h-4 w-4 rounded-full" />
                                            <Skeleton className="h-4 w-28" />
                                        </CardStatsItem>
                                    ))}
                                </CardStats>
                            </CardItemMain>

                            {/* Footer: action button */}
                            <CardItemFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardItemFooter>
                        </CardItem>
                    ))}
                </CardContainer>
            </PageContentMain>
        </PageContainer>
    );
}