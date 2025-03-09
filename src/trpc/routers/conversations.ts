import { writeFile } from "node:fs/promises";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../lib/procedures";

export const conversationsRouter = createTRPCRouter({
	saveConversation: publicProcedure
		.input(z.any())
		.mutation(async ({ input }) => {
			await writeFile(
				"./messages.json",
				JSON.stringify(input, null, 2),
				"utf-8",
			);
		}),
});
