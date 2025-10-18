/*
    Server component that lists organizations (users) with pagination.
    Data source: lib/queries/user.getUsers(page, pageSize)
*/

import { CardContainer } from "../reusables/containers";
import OrganizationCard from "./organization-card";
import { getUsers } from "@/lib/queries/user";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type OrganizationsServerProps = {
    page?: number;
    pageSize?: number;
};

async function OrganizationsServer({ page = 1, pageSize = 9 }: OrganizationsServerProps) {
    const { users, total } = await getUsers(page, pageSize);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const prevPage = page > 1 ? page - 1 : 1;
    const nextPage = page < totalPages ? page + 1 : totalPages;

    return (
        <div className="flex flex-col gap-6">
            <CardContainer>
                {(users).map((user) => {
                    const id = user.id != null ? String(user.id) : "";
                    const name = user.full_name || user.name || user.email || "Organization";
                    const description = user.bio || user.description || user.email || "No description available.";
                    return (
                        <OrganizationCard
                            id={id}
                            userId={id}
                            key={id || name}
                            name={name}
                            description={description}
                            pastEvents={0}
                            upcomingEvents={0}
                        />
                    );
                })}
            </CardContainer>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href={`?page=${prevPage}`} />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <PaginationItem key={p}>
                                <PaginationLink href={`?page=${p}`} isActive={p === page}>
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext href={`?page=${nextPage}`} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

export default OrganizationsServer;