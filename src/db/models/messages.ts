import { foreignKey, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { BaseColumns } from "./_base";
import { Conversations } from "./conversations";

const MessagesPartsSchema = z.record(z.string(), z.unknown());

type MessagesParts = z.infer<typeof MessagesPartsSchema>;

export const Messages = pgTable(
	"messages",
	{
		...BaseColumns,
		conversationUuid: uuid()
			.notNull()
			.references(() => Conversations.uuid, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		id: text().notNull(),
		role: text().notNull(),
		content: text().notNull(),
		parts: jsonb().$type<MessagesParts[]>(),
	},
	(t) => [
		foreignKey({
			columns: [t.conversationUuid],
			foreignColumns: [Conversations.uuid],
			name: "fk_messages_conversation_uuid",
		}),
	],
);

export type MessagesSelect = typeof Messages.$inferSelect;

export const MessagesInsert = createInsertSchema(Messages, {
	parts: MessagesPartsSchema.array().nullish(),
});
