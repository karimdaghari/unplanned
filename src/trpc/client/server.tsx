import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import {
	type TRPCQueryOptions,
	createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";

import { createTRPCContext } from "../lib/init";
import { type AppRouter, appRouter } from "../routers";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
	const heads = new Headers(await headers());
	heads.set("x-trpc-source", "rsc");

	return createTRPCContext({
		headers: heads,
	});
});

export const getQueryClient = cache(createQueryClient);

/**
 * This is a primitive that allows to create a caller than can make the data available both on the server and the client.
 *
 * @note Avoid using this unless you have a good reason to do so and you most probably don't. In a nutshell, this is not recommended because it can/will cause out of sync data between the server and the client.
 * @see To better understand the tradeoffs: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#data-ownership-and-revalidation
 *
 * @example
 * import { getQueryClient, HydrateClient, trpc, prefetch } from '@/trpc/client/server';
 *
 * export default async function Home() {
 *   const queryClient = getQueryClient();
 * 	 // We can fetch the data on the server
 *   const greeting = await queryClient.fetchQuery(trpc.hello.queryOptions());
 *
 * 	// We can also prefetch the data on the server
 *   prefetch(trpc.hello.queryOptions());
 *
 *   // Do something with greeting on the server
 *   return (
 *     <HydrateClient> <-- This is required to hydrate the data on the client (make it available for the client)
 *       <div>...</div>
 *       <ClientGreeting />
 *     </HydrateClient>
 *   );
 * }
 */
export const trpcServer = createTRPCOptionsProxy<AppRouter>({
	router: appRouter,
	ctx: createContext,
	queryClient: getQueryClient,
	overrides: {
		mutations: {
			async onSuccess(opts) {
				await opts.originalFn();
				/**
				 * While this might not be the best way to do this, it's the most convient way to ensure that the query client is updated with the new data.
				 */
				await opts.queryClient.invalidateQueries();
			},
		},
	},
});

/**
 * This is the caller for the tRPC API when handling a tRPC call from a React Server Component.
 *
 * @note This method is detached from the query client and does not store the data in the cache. This means that the data is not available for the client.
 *
 * @example
 *
 * const data = api.users.getUser();
 */
export const api = appRouter.createCaller(createContext);

export function HydrateClient(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{props.children}
		</HydrationBoundary>
	);
}

// biome-ignore lint/suspicious/noExplicitAny: This is a workaround to avoid type errors
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
	queryOptions: T,
) {
	const queryClient = getQueryClient();
	if (queryOptions.queryKey[1]?.type === "infinite") {
		void queryClient.prefetchInfiniteQuery(queryOptions as never);
	} else {
		void queryClient.prefetchQuery(queryOptions);
	}
}
