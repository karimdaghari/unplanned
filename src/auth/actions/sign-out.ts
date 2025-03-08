"use server";

import { createClient } from "@/db/supabase/server";
import { serverAction } from "@/trpc/lib/procedures";
import { redirect } from "next/navigation";
import { z } from "zod";

export const signOutSchema = z.object({});

export const signOutAction = serverAction
	.meta({ span: "signOutAction" })
	.mutation(async () => {
		const supabase = await createClient();
		await supabase.auth.signOut();
		return redirect("/sign-in");
	});
