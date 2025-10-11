import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
            Landing page under development. Proceed to{" "}
            <Link href="/home" className="flex items-center gap-2">
                <Button>
                    <Home /> Home
                </Button>
            </Link>
        </div>
    );
};

export default LandingPage;
