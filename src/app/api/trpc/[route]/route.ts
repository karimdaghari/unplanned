import { appRouter, createTRPCContext } from "@/trpc/lib/utils";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

export const maxDuration = 60;

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
	return createTRPCContext({
		headers: req.headers,
	});
};

const handler = (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createContext(req),
		onError: ({ path, error }) => {
			console.error(
				`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
				{
					error,
				},
			);
		},
	});

export { handler as GET, handler as POST };
