"use server";

import { createClient } from "@/db/supabase/server";
import { authServerAction } from "@/trpc/lib/procedures";
import { redirect } from "next/navigation";

export const signOutAction = authServerAction
	.meta({ span: "signOutAction" })
	.mutation(async () => {
		const supabase = await createClient();
		await supabase.auth.signOut();
		return redirect("/sign-in");
	});
