"use client";

import { useTRPC } from "@/trpc/client/react";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "../typography";

export function ChatHeader() {
	const trpc = useTRPC();
	const { data: name } = useQuery(
		trpc.users.getUserName.queryOptions(undefined, {
			select: (data) => data.name,
		}),
	);

	return (
		<div className="flex items-center flex-col">
			<Typography variant="h3" className="font-medium!">
				{name ? `Welcome back, ${name}` : "Welcome to Unplanned"}
			</Typography>
			<Typography variant="h4" className="font-extralight! h-6">
				{name ? "How can I help you today?" : "Your planning copilot."}
			</Typography>
		</div>
	);
}
