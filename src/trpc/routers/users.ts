import { createClient } from "@/db/supabase/server";
import { updateUserSchema } from "@/shared/schemas/update-user";
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
	isLoggedIn: publicProcedure.query(({ ctx }) => {
		return ctx.user !== null;
	}),
	updateUser: authProcedure
		.input(updateUserSchema)
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
