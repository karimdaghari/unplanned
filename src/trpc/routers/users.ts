import { createClient } from "@/db/supabase/server";
import { z } from "zod";
import {
	authProcedure,
	createTRPCRouter,
	publicProcedure,
} from "../lib/procedures";

export const usersRouter = createTRPCRouter({
	getUser: authProcedure.query(async ({ ctx }) => {
		const user = ctx.user;

		const name = user.user_metadata.name as string;
		const avatar = user.user_metadata.avatar as string | undefined | null;

		return {
			...user,
			name,
			avatar,
		};
	}),
	getUserName: publicProcedure.query(({ ctx }) => {
		const user = ctx.user;

		const name = user?.user_metadata.name as string | undefined;

		return { name };
	}),
	updateUser: authProcedure
		.input(
			z.object({
				name: z.string().min(1),
			}),
		)
		.mutation(async ({ input }) => {
			const { name } = input;

			const supabase = await createClient();

			await supabase.auth.updateUser({
				data: {
					name,
				},
			});

			return {
				success: true,
				message: "User updated successfully",
			};
		}),
});
