import { Facebook, Instagram } from "lucide-react";
import { Subtitle } from "./reusables/texts";

const Footer = () => {
    return (
        <footer className="bg-secondary text-secondary-foreground flex justify-between p-6 px-20">
            <section className="space-y-4 max-w-sm">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-accent rounded-md" />
                    <Subtitle> ANIMO DEV </Subtitle>
                </div>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sunt nemo mollitia quas in sapiente dignissimos? Cum alias
                    dolorem, aspernatur incidunt corporis at.
                </p>
                <ul>
                    <li className="flex gap-4">
                        <Facebook />
                        <Instagram />
                    </li>
                </ul>
            </section>

            <section className="flex gap-20">
                <div>
                    <p className="font-semibold"> Site Map </p>
                    <nav>
                        <ul>
                            <li> Home </li>
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
