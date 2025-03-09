"use server";
import { serverAction } from "@/trpc/lib/procedures";
import { revalidatePath } from "next/cache";

export const signOutAction = serverAction
	.meta({ span: "signOutAction" })
	.mutation(async ({ ctx: { supabase } }) => {
		try {
			const { error } = await supabase.auth.signOut();

			if (error) {
				console.error("Error signing out:", error);
				return {
					success: false,
					message: error.message || "Failed to sign out",
				};
			}

			revalidatePath("/");
			return {
				success: true,
				message: "Signed out successfully",
			};
		} catch (error) {
			console.error("Unexpected error during sign out:", error);
			return {
				success: false,
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred during sign out",
			};
		}
	});
