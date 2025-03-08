import { pgTable } from "drizzle-orm/pg-core";
import { BaseColumns } from "./_base";

export const Users = pgTable("users", {
	...BaseColumns,
});
