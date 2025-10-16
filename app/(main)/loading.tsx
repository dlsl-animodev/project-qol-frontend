"use client"

import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { CardContent } from "@/components/ui/card"
import { CardContainer, PageContainer } from "@/components/reusables/containers"

export default function Loading() {
    return (
        <PageContainer>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Spinner className="size-5" />
                <span>Loading content…</span>
            </div>

            {/* Page heading skeleton */}
            <div className="space-y-2 mb-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
            </div>

            {/* Cards/Table placeholder grid */}
            <CardContent>
                {Array.from({ length: 6 }).map((_, i) => (
                    <CardContainer key={i}>
                        <Skeleton className="h-40 w-full" />
                        <div className="flex gap-3">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                    </CardContainer>
                ))}
            </CardContent>
        </PageContainer>
    )
}
