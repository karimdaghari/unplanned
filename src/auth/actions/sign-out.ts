"use server";

import { createClient } from "@/db/supabase/server";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
	const supabase = await createClient();
	await supabase.auth.signOut();

	return redirect("/");
};
