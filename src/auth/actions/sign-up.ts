"use server";

import { createClient } from "@/db/supabase/server";
import { encodedRedirect } from "@/db/supabase/utils";
import { serverAction } from "@/trpc/lib/procedures";
import { headers } from "next/headers";
import { z } from "zod";

export const signUpSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const signUpAction = serverAction
	.meta({ span: "signUpAction" })
	.input(signUpSchema)
	.mutation(async ({ input: { email, password } }) => {
		const supabase = await createClient();
		const origin = (await headers()).get("origin");

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${origin}/auth/callback`,
			},
		});

		if (error) {
			console.error(`${error.code} ${error.message}`);
			return encodedRedirect("error", "/sign-up", error.message);
		}

		return encodedRedirect(
			"success",
			"/sign-up",
			"Thanks for signing up! Please check your email for a verification link.",
		);
	});
