import { createCallerFactory } from "../lib/init";
import { createTRPCRouter } from "../lib/procedures";
import { chatsRouter } from "./chats";
import { usersRouter } from "./users";

export const appRouter = createTRPCRouter({
	users: usersRouter,
	chats: chatsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 */
export const createCaller = createCallerFactory(appRouter);
