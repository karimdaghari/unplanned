import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { BaseColumnsWithAuth } from "./_base";

export const Conversations = pgTable("conversations", {
	...BaseColumnsWithAuth,
	title: text("title").notNull(),
});

export type ConversationsSelect = typeof Conversations.$inferSelect;

export const ConversationsInsert = createInsertSchema(Conversations);
