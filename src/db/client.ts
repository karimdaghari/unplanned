import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
if (!process.env.DATABASE_URL) {
	// biome-ignore lint/complexity/noExtraBooleanCast: <explanation>
	if (!!process.env.SKIP_ENV_VALIDATION) {
		console.info("Missing DATABASE_URL");
	} else {
		throw new Error("Missing DATABASE_URL");
	}
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.DATABASE_URL as string, { prepare: false });

export const db = drizzle({ client, schema, casing: "snake_case" });
