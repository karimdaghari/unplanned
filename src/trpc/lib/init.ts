import { db } from "@/db/client";
import { createClient } from "@/db/supabase/server";
import { initTRPC } from "@trpc/server";
import { experimental_nextAppDirCaller } from "@trpc/server/adapters/next-app-dir";
import superjson from "superjson";
import { ZodError } from "zod";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return {
		db,
		user,
		supabase,
		...opts,
	};
};

interface Meta {
	span: string;
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
export const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

const tServerAction = initTRPC.meta<Meta>().create();

export const serverActionProcedureBase = tServerAction.procedure
	.experimental_caller(
		experimental_nextAppDirCaller({
			pathExtractor: ({ meta }) => (meta as Meta).span,
		}),
	)
	.use(async (opts) => {
		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		const ctx = {
			user,
			db,
			supabase,
		};

		return opts.next({ ctx });
	});
