import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderServer from "@/components/header/header-server";
import Footer from "@/components/footer";
 import NextTopLoader from 'nextjs-toploader';

import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

export const pixelGamer = localFont({
    src: [
        {
            path: "../public/fonts/PixelGamer-Regular.otf",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-pixel-gamer",
    display: "swap", // you can choose fallback strategy (swap, block, fallback)
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Project QOL",
    description:
        "The frontend application for **Project QOL** (Quality of Life), a software development initiative aimed at enhancing the developer experience and overall quality of life for our team",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${pixelGamer.variable} antialiased text-sm`}
            >
                <NextTopLoader />

                <HeaderServer />
                <main className="min-h-screen">
                    <div className="h-12 bg-primary" />
                    <Suspense>
                      {children}
                    </Suspense>
                    <Toaster />
                </main>
                <Footer />
            </body>
        </html>
    );
}
