"use client";

import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
	createTRPCClient,
	loggerLink,
	unstable_httpBatchStreamLink,
} from "@trpc/client";
import { useState } from "react";

import { createTRPCContext } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";

import { env } from "@/env/client";
import type { AppRouter } from "../routers";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return createQueryClient();
	}
	// biome-ignore lint/suspicious/noAssignInExpressions: use singleton pattern to keep the same query client
	return (clientQueryClientSingleton ??= createQueryClient());
};

const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();

export {
	/**
	 * Use this hook to access the tRPC client.
	 *
	 * @example Data query
	 *
	 * import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
	 * import { useTRPC } from '@/trpc/client/react';
	 * ...
	 * const trpc = useTRPC();
	 * // For normal data query
	 * const { data } = useQuery(trpc.getUser.queryOptions());
	 * // For data query with suspense
	 * const { data } = useSuspenseQuery(trpc.getUser.queryOptions());
	 *
	 * @example Data mutation
	 *
	 * import { useMutation } from '@tanstack/react-query';
	 * import { useTRPC } from '@/trpc/client/react';
	 * ...
	 * const trpc = useTRPC();
	 * const createUserMutation = useMutation(trpc.createUser.mutationOptions());
	 * createUserMutation.mutate({ name: 'Jerry' });
	 *
	 * @example Utils/Interacting with the query client
	 *
	 * import { useQuery, useQueryClient } from '@tanstack/react-query';
	 * import { useTRPC } from '@/trpc/client/react';
	 * ...
	 * const trpc = useTRPC();
	 * const queryClient = useQueryClient();
	 * async function invalidateGreeting() {
	 *   await queryClient.invalidateQueries(
	 *     trpc.greeting.queryFilter({ name: 'Jerry' }),
	 *   );
	 * }
	 */
	useTRPC,
};

export function TRPCReactProvider(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	queryClient.setDefaultOptions({
		mutations: {
			async onSuccess() {
				/**
				 * While this might not be the best way to do this, it's the most convient way to ensure that the query client is updated with the new data.
				 */
				await queryClient.invalidateQueries();
			},
		},
	});

	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
			links: [
				loggerLink({
					enabled: (op) =>
						process.env.NODE_ENV === "development" ||
						(op.direction === "down" && op.result instanceof Error),
				}),
				unstable_httpBatchStreamLink({
					transformer: SuperJSON,
					url: `${getBaseUrl()}/api/trpc`,
					headers() {
						const headers = new Headers();
						headers.set("x-trpc-source", "nextjs-react");
						return headers;
					},
				}),
			],
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools buttonPosition="bottom-right" client={queryClient} />
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{props.children}
			</TRPCProvider>
		</QueryClientProvider>
	);
}

const getBaseUrl = () => {
	if (typeof window !== "undefined") return window.location.origin;
	if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
	return "http://localhost:3000";
};
