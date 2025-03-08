"use server";

import { createClient } from "@/db/supabase/server";
import { encodedRedirect } from "@/db/supabase/utils";
import { serverAction } from "@/trpc/lib/procedures";
import { redirect } from "next/navigation";
import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const signInAction = serverAction
	.meta({ span: "signInAction" })
	.input(signInSchema)
	.mutation(async ({ input: { email, password } }) => {
		const supabase = await createClient();

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return encodedRedirect("error", "/sign-in", error.message);
		}

		return redirect("/protected");
	});
