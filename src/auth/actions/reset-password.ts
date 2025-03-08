"use server";

import { resetPasswordSchema } from "@/auth/schemas/reset-password";
import { createClient } from "@/db/supabase/server";
import { encodedRedirect } from "@/db/supabase/utils";
import { serverAction } from "@/trpc/lib/procedures";

export const resetPasswordAction = serverAction
	.meta({ span: "resetPasswordAction" })
	.input(resetPasswordSchema)
	.mutation(async ({ input: { password, confirmPassword } }) => {
		const supabase = await createClient();

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
	});
