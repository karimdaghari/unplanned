"use server";

import { signUpSchema } from "@/shared/schemas";
import { serverAction } from "@/trpc/lib/procedures";
import { headers } from "next/headers";

export const signUpAction = serverAction
	.meta({ span: "signUpAction" })
	.input(signUpSchema)
	.mutation(async ({ ctx: { supabase }, input: { email, password, name } }) => {
		const origin = (await headers()).get("origin");

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
