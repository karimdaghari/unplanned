import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
	if (process.env.SKIP_ENV_VALIDATION) {
		console.info("Missing DATABASE_URL");
	} else {
		throw new Error("Missing DATABASE_URL");
	}
}

// biome-ignore lint/style/noDefaultExport: This is a drizzle config file, it's ok to have a default export
export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "",
	},
	strict: true,
	verbose: process.env.NODE_ENV === "development",
	breakpoints: true,
	casing: "snake_case",
});
