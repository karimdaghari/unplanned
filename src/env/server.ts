import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
	extends: [vercel()],
	server: {
		DATABASE_URL: z.string().min(1).startsWith("postgresql://"),
		SUPABASE_URL: z.string().min(1),
		SUPABASE_ANON_KEY: z.string().min(1),
		OPENAI_API_KEY: z.string().min(1),
		SITE_URL: z.string().startsWith("http").endsWith("/"),
	},
	experimental__runtimeEnv: process.env,
});
