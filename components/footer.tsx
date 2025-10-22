import { Facebook, Instagram } from "lucide-react";
import { Subtitle } from "./reusables/texts";
import ANIMODEVLOGO from "@/public/images/animo-dev-logo.jpg";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-secondary text-secondary-foreground flex justify-between p-6 px-10 md:px-20">
            <section className="space-y-4 max-w-sm">
                <div className="flex items-center gap-2">
                    <Image
                        src={ANIMODEVLOGO}
                        alt="Animo.dev Logo"
                        width={30}
                        height={30}
                        className="w-auto h-auto"
                    />
                    <Subtitle> ANIMO.DEV </Subtitle>
                </div>
                <p>© 2025 Animo Dev Society. All rights reserved.</p>
                <ul>
                    <li className="flex gap-4">
                        <Link
                            href={
                                "https://www.facebook.com/profile.php?id=61577729247232"
                            }
                        >
                            <Facebook />
                        </Link>
                        <Link href={"https://www.instagram.com/dlsl.devsoc/"}>
                            <Instagram />
                        </Link>
                    </li>
                </ul>
            </section>

            <section className="flex gap-20">
                <div>
                    <p className="font-semibold"> Site Map </p>
                    <nav>
                        <ul>
                            <li>
                                <Link href="/home"> Home </Link>
                            </li>
                            <li>
                                <Link href="/admin"> Admin </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div>
                    <p className="font-semibold"> Legal </p>
                    <nav>
                        <ul>
                            <li> Privacy </li>
                            <li> Terms </li>
                        </ul>
                    </nav>
                </div>
            </section>
        </footer>
    );
};

export default Footer;
