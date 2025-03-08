import { createClient } from "@/db/supabase/server";

export async function auth() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user;
}
