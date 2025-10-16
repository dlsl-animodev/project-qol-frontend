import { UserData, UserRole } from "@/types/database";
import { createSupabaseServerClient, Supabase } from "../supabase/server";
import { requireUser } from "../supabase/auth";


export async function getUserRole(): Promise<UserRole> {
    console.log("Fetching user role...");

    const supabase = await createSupabaseServerClient();
    const user = await requireUser();

    const { data, error } = await supabase.from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

    if (error || !data) {
        console.error("Error fetching user role:", error);
        return 'user'; // default role
    }

    return data.role as UserRole;
}

export async function getUsers(page: number = 1, pageSize: number = 10): Promise<{ users: UserData[]; total: number }> {
    const supabase = await createSupabaseServerClient();
    
    const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }

    return { users: data || [], total: count || 0 };
}