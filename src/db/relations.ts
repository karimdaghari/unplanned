import { relations } from "drizzle-orm";
import { Conversations } from "./models/conversations";
import { Messages } from "./models/messages";

export const ConversationsRelations = relations(Conversations, ({ many }) => ({
	messages: many(Messages),
}));

export const MessagesRelations = relations(Messages, ({ one }) => ({
	conversation: one(Conversations, {
		fields: [Messages.conversationUuid],
		references: [Conversations.uuid],
	}),
}));
