import { Messages, MessagesInsert } from "@/db/models/messages";
import { Chats, ChatsInsert } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../lib/procedures";

export const chatsRouter = createTRPCRouter({
	getAll: authProcedure.query(async ({ ctx: { db, user } }) => {
		try {
			return await db.query.Chats.findMany({
				where: (t, op) =>
					op.and(op.isNull(t.deletedAt), op.eq(t.userId, user.id)),
				orderBy: (t, op) => [op.desc(t.createdAt)],
			});
		} catch (error) {
			console.error("Error fetching all chats:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to retrieve chats",
				cause: error,
			});
		}
	}),
	getById: authProcedure
		.input(z.object({ id: z.string().nanoid() }))
		.query(async ({ ctx: { db, user }, input }) => {
			try {
				const chat = await db.query.Chats.findFirst({
					where: (t, op) =>
						op.and(
							op.isNull(t.deletedAt),
							op.eq(t.id, input.id),
							// Although this might seem redundant, it's a sanity check to ensure that the user is not accessing a conversation that they do not own
							op.eq(t.userId, user.id),
						),
				});

				return chat;
			} catch (error) {
				console.error(`Error fetching chat with ID ${input.id}:`, error);
				if (error instanceof TRPCError) {
					throw error;
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to retrieve chat",
					cause: error,
				});
			}
		}),
	getMessagesById: authProcedure
		.input(z.object({ id: z.string().nanoid() }))
		.query(async ({ ctx: { db }, input }) => {
			try {
				const messages = await db.query.Messages.findMany({
					where: eq(Messages.chatId, input.id),
					orderBy: (t, op) => [op.asc(t.createdAt)],
				});

				return messages.map((message) => ({
					...message,
					createdAt: new Date(message.createdAt),
				}));
			} catch (error) {
				console.error(`Error fetching messages for chat ${input.id}:`, error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to retrieve chat messages",
					cause: error,
				});
			}
		}),
	delete: authProcedure
		.input(z.object({ id: z.string().nanoid() }))
		.mutation(async ({ ctx: { db }, input }) => {
			try {
				await db
					.update(Chats)
					.set({
						deletedAt: new Date(),
					})
					.where(eq(Chats.id, input.id));

				return { success: true, message: "Chat deleted successfully" };
			} catch (error) {
				console.error(`Error deleting chat ${input.id}:`, error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete chat",
					cause: error,
				});
			}
		}),

	create: authProcedure.input(ChatsInsert.omit({ userId: true })).mutation(
		async ({
			ctx: {
				db,
				user: { id: userId },
			},
			input,
		}) => {
			try {
				const [inserted] = await db
					.insert(Chats)
					.values({
						...input,
						userId,
					})
					.returning();

				return inserted;
			} catch (error) {
				console.error("Error creating chat:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create chat",
					cause: error,
				});
			}
		},
	),
	saveMessage: authProcedure
		.input(
			z.object({
				chatId: z.string().nanoid(),
				messages: z.array(MessagesInsert.omit({ chatId: true })),
			}),
		)
		.mutation(async ({ ctx: { db }, input }) => {
			try {
				await db
					.insert(Messages)
					.values(
						input.messages.map((message) => ({
							...message,
							chatId: input.chatId,
							createdAt: message.createdAt ?? new Date().toISOString(),
						})),
					)
					// On conflict, update the message with the new content and keep the same id
					// This allows us to ensure the message is always up to date (and for the future, allow for partial updates, i.e., edit the content of a message)
					.onConflictDoUpdate({
						target: [Messages.id],
						set: { ...input, id: sql`${Messages.id}` },
					});

				return { success: true, message: "Messages saved successfully" };
			} catch (error) {
				console.error(`Error saving messages for chat ${input.chatId}:`, error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to save chat messages",
					cause: error,
				});
			}
		}),
});
