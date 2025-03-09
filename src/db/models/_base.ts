import { text } from "drizzle-orm/pg-core";

export const BaseColumns = {
	id: text().primaryKey(),
};

export const BaseColumnsWithAuth = {
	...BaseColumns,
	userId: text().notNull(),
};
