import Link from "next/link";
import { Button } from "./ui/button";

const Header = () => {
    return (
        <header
            className="
                grid grid-cols-3 items-center text-center h-12 px-16 text-primary-foreground 
                fixed shadow-xl border-b w-full z-50
                backdrop-blur-md  bg-primary/50
            "
        >
            {/* Left Section */}
            <section className="flex justify-start gap-14">
                <Link href="/">
                    <p className="font-bold">ANIMO.DEV</p>
                </Link>
                <nav>
                    <ul className="flex gap-6">
                        <li>
                            <Link href="/home"> Home </Link>
                        </li>
                        <li>
                            <Link href={'/admin'}> Admin </Link>
                        </li>
                    </ul>
                </nav>
            </section>

            {/* Middle Section */}
            <section>
                <p className="text-xl font-extrabold font-pixel">Project QOL</p>
            </section>

            {/* Right Section */}
            <section className="flex justify-end">
                <Button>Login</Button>
            </section>
        </header>
    );
};

export default Header;
