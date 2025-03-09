import { relations } from "drizzle-orm";
import { Chats } from "./models/chat";
import { Messages } from "./models/messages";

export const ChatsRelations = relations(Chats, ({ many }) => ({
	messages: many(Messages),
}));

export const MessagesRelations = relations(Messages, ({ one }) => ({
	chat: one(Chats, {
		fields: [Messages.chatId],
		references: [Chats.id],
	}),
}));
