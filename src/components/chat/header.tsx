"use client";

import { useTRPC } from "@/trpc/client/react";
import { skipToken, useQuery } from "@tanstack/react-query";
import { Typography } from "../typography";

export function ChatHeader() {
	const trpc = useTRPC();
	const { data: isLoggedIn } = useQuery(trpc.users.isLoggedIn.queryOptions());

	const { data: name } = useQuery(
		trpc.users.getUser.queryOptions(isLoggedIn ? undefined : skipToken, {
			select: (data) => data.name,
		}),
	);

	return (
		<div className="flex items-center flex-col">
			<Typography variant="h3" className="font-medium!">
				{name && isLoggedIn ? `Welcome back, ${name}` : "Welcome to Unplanned"}
			</Typography>
			<Typography variant="h4" className="font-extralight! h-6">
				{name && isLoggedIn
					? "How can I help you today?"
					: "Your planning copilot."}
			</Typography>
		</div>
	);
}
