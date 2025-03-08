"use server";

import { signUpSchema } from "@/auth/schemas/sign-up";
import { createClient } from "@/db/supabase/server";
import { serverAction } from "@/trpc/lib/procedures";
import { headers } from "next/headers";

export const signUpAction = serverAction
	.meta({ span: "signUpAction" })
	.input(signUpSchema)
	.mutation(async ({ input: { email, password } }) => {
		const supabase = await createClient();
		const origin = (await headers()).get("origin");

		const emailRedirectTo = `${origin}/auth/callback`;

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: emailRedirectTo,
			},
		});

		if (error) {
			return {
				success: false,
				message: error.message,
			};
		}

		return {
			success: true,
			message:
				"Thanks for signing up! Please check your email for a verification link.",
		};
	});
