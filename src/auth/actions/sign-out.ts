"use server";
import { serverAction } from "@/trpc/lib/procedures";
import { revalidatePath } from "next/cache";

export const signOutAction = serverAction
	.meta({ span: "signOutAction" })
	.mutation(async ({ ctx: { supabase } }) => {
		await supabase.auth.signOut();

		return revalidatePath("/");
	});
