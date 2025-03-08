import { TRPCError } from "@trpc/server";
import { serverActionProcedureBase, t } from "./init";

export const createTRPCRouter = t.router;

export const mergeRouters = t.mergeRouters;

const procedure = t.procedure;

/**
 * Base procedure without any authentication requirements.
 * Use this for endpoints that should be accessible to anyone.
 */
export const publicProcedure = procedure;

/**
 * Base procedure with authentication requirements.
 * Use this for endpoints that should be accessible to authenticated users.
 */
export const authProcedure = procedure.use(async ({ ctx, next }) => {
	if (ctx.user === null) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource",
		});
	}

	return next({
		ctx: {
			...ctx,
			user: ctx.user,
		},
	});
});

/**
 * Base procedure for server actions.
 * Use this for endpoints that should be accessible to all users (auth or not)
 */
export const serverAction = serverActionProcedureBase;

/**
 * Base procedure for server actions with authentication requirements.
 * Use this for endpoints that should be accessible to authenticated users.
 */
export const authServerAction = serverAction.use(async ({ ctx, next }) => {
	if (ctx.user === null) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You must be logged in to access this resource",
		});
	}

	return next({
		ctx: {
			...ctx,
			user: ctx.user,
		},
	});
});
