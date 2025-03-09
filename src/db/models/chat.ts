import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { BaseColumnsWithAuth } from "./_base";

export const Chats = pgTable("chats", {
	...BaseColumnsWithAuth,
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	deletedAt: timestamp(),
	title: text("title").notNull(),
});

export type ChatsSelect = typeof Chats.$inferSelect;

export const ChatsInsert = createInsertSchema(Chats);
