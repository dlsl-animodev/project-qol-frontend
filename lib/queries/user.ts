import { UserRole } from "@/types/database";
import { createSupabaseServerClient, Supabase } from "../supabase/server";
import { requireUser } from "../supabase/auth";


export async function getUserRole(): Promise<UserRole> {
    const supabase = await createSupabaseServerClient();
    const user = await requireUser();

    const { data, error } = await supabase.from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

    if (error || !data) {
        return 'user'; // default role
    }

    return data.role as UserRole;
}