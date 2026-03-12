"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowUp, FileDown, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface Columns {
  id: string;
  time_in: string;
  name: string;
  email: string;
  time_out: string;
  isMember: boolean;
}

const formatLocalDateTime = (iso: string) => {
  if (!iso) return "";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const columns: ColumnDef<Columns>[] = [
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "time_in",
    header: "Time In",
    cell: ({ row }) => formatLocalDateTime(row.original.time_in),
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "time_out",
    header: "Time Out",
    cell: ({ row }) => formatLocalDateTime(row.original.time_out),
  },
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

const csvHeaders = ["ID", "Time In", "Name", "Email", "Time Out", "Is Member"];

const escapeCsvValue = (value: string) => {
  const normalizedValue = value.replace(/"/g, '""');
  return `"${normalizedValue}"`;
};

const buildExportRows = (data: Columns[]) => {
  return data.map((entry) => [
    entry.id,
    formatLocalDateTime(entry.time_in),
    entry.name,
    entry.email,
    formatLocalDateTime(entry.time_out),
    entry.isMember ? "Yes" : "No",
  ]);
};

const createExportFileName = (extension: "csv" | "pdf") => {
  const dateLabel = new Date().toISOString().slice(0, 10);
  return `attendance-${dateLabel}.${extension}`;
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({ data }) => {
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

  const exportRows = buildExportRows(data);

  const handleExportCsv = () => {
    const csvContent = [csvHeaders, ...exportRows]
      .map((row) => row.map((value) => escapeCsvValue(String(value))).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = createExportFileName("csv");
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    pdf.setFontSize(16);
    pdf.text("Attendance Export", 40, 40);

    autoTable(pdf, {
      head: [csvHeaders],
      body: exportRows,
      startY: 56,
      styles: {
        fontSize: 9,
        cellPadding: 6,
      },
      headStyles: {
        fillColor: [32, 32, 32],
      },
    });

    pdf.save(createExportFileName("pdf"));
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" onClick={handleExportCsv}>
          <FileText className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button type="button" variant="outline" onClick={handleExportPdf}>
          <FileDown className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

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
