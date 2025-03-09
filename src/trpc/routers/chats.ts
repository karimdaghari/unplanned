import { Messages, MessagesInsert } from "@/db/models/messages";
import { Chats, ChatsInsert } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../lib/procedures";

export const chatsRouter = createTRPCRouter({
	getAll: authProcedure.query(async ({ ctx: { db, user } }) => {
		return await db.query.Chats.findMany({
			where: (t, op) =>
				op.and(op.isNotNull(t.deletedAt), op.eq(t.userId, user.id)),
		});
	}),
	getById: authProcedure
		.input(z.object({ id: z.string().nanoid() }))
		.query(async ({ ctx: { db, user }, input }) => {
			return await db.query.Chats.findFirst({
				where: (t, op) =>
					op.and(
						op.isNull(t.deletedAt),
						op.eq(t.id, input.id),
						// Although this might seem redundant, it's a sanity check to ensure that the user is not accessing a conversation that they do not own
						op.eq(t.userId, user.id),
					),
			});
		}),
	delete: authProcedure
		.input(z.object({ uuid: z.string().nanoid() }))
		.mutation(async ({ ctx: { db }, input }) => {
			await db
				.update(Chats)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(Chats.id, input.uuid));
		}),

	create: authProcedure.input(ChatsInsert.omit({ userId: true })).mutation(
		async ({
			ctx: {
				db,
				user: { id: userId },
			},
			input,
		}) => {
			const [inserted] = await db
				.insert(Chats)
				.values({
					...input,
					userId,
				})
				.returning();

			return inserted;
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
		}),
});
