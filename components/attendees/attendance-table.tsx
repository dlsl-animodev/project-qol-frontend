"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";

export interface Columns {
    id: string;
    time_in: string;
    name: string;
    email: string;
    time_out: string;
    isMember: boolean;
}

const columns: ColumnDef<Columns>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "time_in", header: "Time In" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "time_out", header: "Time Out" },
    {
        accessorKey: "isMember",
        header: "Is Member",
        cell: ({ row }) => (row.original.isMember ? "Yes" : "No"),
    },
];

interface AttendanceTableProps {
    className?: string;
    data: Columns[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
    data,
}) => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.pageYOffset > 200); // show after scrolling 200px
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="w-full">
            <DataTable data={data} columns={columns} />

            <Button
                onClick={scrollToTop}
                className={`fixed bottom-4 left-1/2 -translate-x-1/2 
                    flex items-center gap-2 px-4 py-2  
                    transition-all
                    transform duration-300
                    ${showBackToTop ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}
                `}
            >
                <ArrowUp />
                Back to Top
            </Button>
        </div>
    );
};

export default AttendanceTable;
