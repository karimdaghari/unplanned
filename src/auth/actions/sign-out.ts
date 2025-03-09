"use server";

import { serverAction } from "@/trpc/lib/procedures";
import { redirect } from "next/navigation";

export const signOutAction = serverAction
	.meta({ span: "signOutAction" })
	.mutation(async ({ ctx: { supabase } }) => {
		await supabase.auth.signOut();

		return redirect("/");
	});
