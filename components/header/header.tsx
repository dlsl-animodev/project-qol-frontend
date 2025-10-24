"use client";

import ANIMODEVLOGO from "@/public/images/animo-dev-logo.jpg";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";

import { useIsTablet } from "@/hooks/use-tablet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { User } from "@supabase/supabase-js";
import { Home, Lock, Menu } from "lucide-react";

export interface HeaderProps {
    user: User | null;
    className?: string;
}

const BASE_HEADER_CLASSNAME =
    "h-12 px-6 text-primary-foreground fixed shadow-xl border-b w-full z-50 backdrop-blur-md bg-primary/50";

const Header = ({ user }: HeaderProps) => {
    const isTablet = useIsTablet();

    if (isTablet) return <TabletHeader user={user} className="flex items-center justify-between" />;
    return <DesktopHeader user={user} className="grid grid-cols-3 items-center text-center" />;
};

export default Header;

const TabletHeader = ({ user, className }: HeaderProps) => {
    return (
        <header className={`${BASE_HEADER_CLASSNAME} ${className}`}>
            {/* Left Section */}
            <section className="flex items-center justify-start gap-14">
                <div className="flex items-center gap-3">
                    <Image
                        src={ANIMODEVLOGO}
                        alt="Animo.dev Logo"
                        width={30}
                        height={30}
                        className="w-auto h-auto"
                    />
                    <Link href="/">
                        <p className="text-xl font-extrabold font-pixel">
                            Project QOL
                        </p>
                    </Link>
                </div>
            </section>

            {/* Right Section */}
            <section className="flex justify-end items-center gap-4">
                {user ? (
                    <>
                        <span className="text-xs uppercase tracking-wide">
                            Signed in as {user.email ?? "Account"}
                        </span>
                        <form action={signOut}>
                            <Button type="submit" variant="secondary">
                                Sign Out
                            </Button>
                        </form>
                    </>
                ) : (
                    <Button asChild>
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Menu />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link
                                href="/home"
                                className="flex items-center gap-2 font-semibold"
                            >
                                <Home color="black" />
                                Home
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link
                                href={"/admin"}
                                className="flex items-center gap-2 font-semibold"
                            >
                                <Lock color="black" />
                                Admin
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </section>
        </header>
    );
};

const DesktopHeader = ({ user, className }: HeaderProps) => {
    return (
        <header className={`${BASE_HEADER_CLASSNAME} ${className}`}>
            {/* Left Section */}
            <section className="flex items-center justify-start gap-14">
                <div className="flex items-center gap-2">
                    <Image
                        src={ANIMODEVLOGO}
                        alt="Animo.dev Logo"
                        width={30}
                        height={30}
                        className="w-auto h-auto"
                    />
                    <Link href="/">
                        <p className="font-bold">ANIMO.DEV</p>
                    </Link>
                </div>
                <nav>
                    <ul className="flex gap-6">
                        <li>
                            <Link href="/home"> Home </Link>
                        </li>
                        <li>
                            <Link href={"/admin"}> Admin </Link>
                        </li>
                    </ul>
                </nav>
            </section>

            {/* Middle Section */}
            <section>
                <p className="text-xl font-extrabold font-pixel">Project QOL</p>
            </section>

            {/* Right Section */}
            <section className="flex justify-end items-center gap-4">
                {user ? (
                    <>
                        <span className="text-xs uppercase tracking-wide">
                            Signed in as {user.email ?? "Account"}
                        </span>
                        <form action={signOut}>
                            <Button type="submit" variant="secondary">
                                Sign Out
                            </Button>
                        </form>
                    </>
                ) : (
                    <Button asChild>
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                )}
            </section>
        </header>
    );
};
