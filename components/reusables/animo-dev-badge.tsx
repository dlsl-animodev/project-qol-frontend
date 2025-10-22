// this could be a reusable component that will serve as the badge for animo.dev development credit

import Link from "next/link";

const AnimoDevBadge = () => {
    return (
        <div className="bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 text-white px-4 py-1 rounded-lg font-bold mb-4 shadow-md">
            {" "}
            Developed and maintained by
            <Link href={"#"} className="underline">
                {" "}
                ANIMO.DEV
            </Link>{" "}
        </div>
    );
};

export default AnimoDevBadge;
