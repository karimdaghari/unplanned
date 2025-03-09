import { Messages, MessagesInsert } from "@/db/models/messages";
import { Conversations, ConversationsInsert } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../lib/procedures";

export const conversationsRouter = createTRPCRouter({
	getAllConversations: authProcedure.query(async ({ ctx: { db, user } }) => {
		return await db.query.Conversations.findMany({
			where: (t, op) =>
				op.and(op.isNotNull(t.deletedAt), op.eq(t.userId, user.id)),
		});
	}),
	getConversation: authProcedure
		.input(z.object({ uuid: z.string().uuid() }))
		.query(async ({ ctx: { db, user }, input }) => {
			return await db.query.Conversations.findFirst({
				where: (t, op) =>
					op.and(
						op.isNull(t.deletedAt),
						op.eq(t.uuid, input.uuid),
						// Although this might seem redundant, it's a sanity check to ensure that the user is not accessing a conversation that they do not own
						op.eq(t.userId, user.id),
					),
				with: {
					messages: {
						orderBy: (t, op) => [op.desc(t.createdAt)],
					},
				},
			});
		}),
	deleteConversation: authProcedure
		.input(z.object({ uuid: z.string().uuid() }))
		.mutation(async ({ ctx: { db }, input }) => {
			await db
				.update(Conversations)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(Conversations.uuid, input.uuid));
		}),

	createConversation: authProcedure
		.input(ConversationsInsert)
		.mutation(async ({ ctx: { db }, input }) => {
			const [inserted] = await db
				.insert(Conversations)
				.values(input)
				.returning();

			return inserted;
		}),
	saveMessage: authProcedure
		.input(
			z.object({
				message: MessagesInsert,
			}),
		)
		.mutation(async ({ ctx: { db }, input }) => {
			await db.insert(Messages).values(input.message);
		}),
});
