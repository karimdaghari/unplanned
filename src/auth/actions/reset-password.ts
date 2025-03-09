"use server";

import { resetPasswordSchema } from "@/auth/schemas/reset-password";
import { encodedRedirect } from "@/db/supabase/utils";
import { serverAction } from "@/trpc/lib/procedures";

export const resetPasswordAction = serverAction
	.meta({ span: "resetPasswordAction" })
	.input(resetPasswordSchema)
	.mutation(
		async ({ ctx: { supabase }, input: { password, confirmPassword } }) => {
			if (password !== confirmPassword) {
				return encodedRedirect(
					"error",
					"/protected/reset-password",
					"Passwords do not match",
				);
			}

			const { error } = await supabase.auth.updateUser({
				password: password,
			});

			if (error) {
				return encodedRedirect(
					"error",
					"/protected/reset-password",
					"Password update failed",
				);
			}

			return encodedRedirect(
				"success",
				"/protected/reset-password",
				"Password updated",
			);
		},
	);
