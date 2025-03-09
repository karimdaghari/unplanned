import {
	json,
	jsonb,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { BaseColumns } from "./_base";
import { Chats } from "./chat";

const MessagesPartsSchema = z.record(z.string(), z.unknown());

type MessagesParts = z.infer<typeof MessagesPartsSchema>;

export const Messages = pgTable("messages", {
	...BaseColumns,
	chatId: text()
		.notNull()
		.references(() => Chats.id, {
			onDelete: "cascade",
		}),
	createdAt: timestamp({
		mode: "string",
	}).notNull(),
	role: varchar("role", {
		length: 20,
	}).notNull(),
	content: json().$type<string | MessagesParts[]>().notNull(),
	parts: jsonb().$type<MessagesParts[]>(),
});

export type MessagesSelect = typeof Messages.$inferSelect;

export const MessagesInsert = createInsertSchema(Messages, {
	parts: MessagesPartsSchema.array().nullish(),
	createdAt: z.string().datetime().nullish(),
	content: z.union([z.string(), z.array(MessagesPartsSchema)]),
});
