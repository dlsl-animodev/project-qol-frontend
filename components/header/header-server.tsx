import { getCurrentUser } from "@/lib/supabase/auth";
import Header from "./header";

const HeaderServer =  async () => {
    const user = await getCurrentUser();

    return (
        <Header user={user} />
    );
};

export default HeaderServer;
