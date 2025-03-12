"use server";

import { env } from "@/env/server";
import { signUpSchema } from "@/shared/schemas";
import { serverAction } from "@/trpc/lib/procedures";

export const signUpAction = serverAction
	.meta({ span: "signUpAction" })
	.input(signUpSchema)
	.mutation(async ({ ctx: { supabase }, input: { email, password, name } }) => {
		const origin = env.SITE_URL;

		const emailRedirectTo = `${origin}/auth/callback`;

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: emailRedirectTo,
				data: {
					name,
				},
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
