import { authProcedure, createTRPCRouter } from "../lib/procedures";

export const usersRouter = createTRPCRouter({
	getUser: authProcedure.query(async ({ ctx }) => {
		return ctx.user;
	}),
});
