import { text, timestamp, uuid } from "drizzle-orm/pg-core";

export const BaseColumns = {
	uuid: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
	deletedAt: timestamp(),
};

export const BaseColumnsWithAuth = {
	...BaseColumns,
	userId: text().notNull(),
};
