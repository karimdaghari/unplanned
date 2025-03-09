"use server";

import { signInSchema } from "@/shared/schemas/sign-in";
import { serverAction } from "@/trpc/lib/procedures";

export const signInAction = serverAction
	.meta({ span: "signInAction" })
	.input(signInSchema)
	.mutation(async ({ ctx: { supabase }, input: { email, password } }) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return {
				success: false,
				message: error.message,
			};
		}

		return {
			success: true,
			message: "You're in!",
		};
	});
