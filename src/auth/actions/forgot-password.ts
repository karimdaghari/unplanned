"use server";

import { createClient } from "@/db/supabase/server";
import { encodedRedirect } from "@/db/supabase/utils";
import { serverAction } from "@/trpc/lib/procedures";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const forgotPasswordSchema = z.object({
	email: z.string().email(),
	callbackUrl: z.string().optional(),
});

export const forgotPasswordAction = serverAction
	.meta({ span: "forgotPasswordAction" })
	.input(forgotPasswordSchema)
	.mutation(async ({ input: { email, callbackUrl } }) => {
		const supabase = await createClient();
		const origin = (await headers()).get("origin");

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
		});

		if (error) {
			console.error(error.message);
			return encodedRedirect(
				"error",
				"/forgot-password",
				"Could not reset password",
			);
		}

		if (callbackUrl) {
			return redirect(callbackUrl);
		}

		return encodedRedirect(
			"success",
			"/forgot-password",
			"Check your email for a link to reset your password.",
		);
	});
