import Link from "next/link";
import { Button } from "./ui/button";
import { getCurrentUser } from "@/lib/supabase/auth";
import { signOut } from "@/app/actions/auth";
import ANIMODEVLOGO from "@/public/images/animo-dev-logo.jpg";
import Image from "next/image";

const Header = async () => {
    const user = await getCurrentUser();

    return (
        <header
            className="
                grid grid-cols-3 items-center text-center h-12 px-16 text-primary-foreground 
                fixed shadow-xl border-b w-full z-50
                backdrop-blur-md  bg-primary/50
            "
        >
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

export default Header;
