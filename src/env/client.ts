import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";

export const env = createEnv({
	extends: [vercel()],
	client: {},
	runtimeEnv: {},
});
