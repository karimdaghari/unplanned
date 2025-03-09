import { z } from "zod";

export const updateUserSchema = z.object({
	name: z.string().min(1, "Name is required"),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
