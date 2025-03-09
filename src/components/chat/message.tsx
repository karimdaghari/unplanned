import { cn } from "@/lib/utils";
import type { Message } from "ai";
import { Skeleton } from "../ui/skeleton";
import { Markdown } from "./markdown";
import { VenueCard } from "./venue-card";

interface ChatMessageProps extends Message {}

export function ChatMessage({ content, role, parts }: ChatMessageProps) {
	return (
		<div
			className={cn(
				"px-4 py-2",
				role === "user" &&
					"flex items-end gap-2 border rounded-2xl max-w-3xl whitespace-pre-wrap ml-auto bg-accent",
			)}
		>
			{role === "user" && (
				<div className="prose-base dark:prose-invert">
					<Markdown>{content}</Markdown>
				</div>
			)}

			<div>
				{parts
					?.filter((part) => part.type === "tool-invocation")
					.map(({ toolInvocation }) => {
						const { toolName, toolCallId, state } = toolInvocation;

						if (state === "result") {
							switch (toolName) {
								case "displayVenue": {
									const { data } = toolInvocation.result;
									return (
										<div className="grid grid-cols-2 gap-4">
											{data.map((datum: any) => (
												<VenueCard key={datum.name} {...datum} />
											))}
										</div>
									);
								}

								default:
									return null;
							}
						}

						return (
							<div key={toolCallId} className="grid grid-cols-2 gap-4">
								{Array.from({ length: 4 }).map((_, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: it's fine.
									<Skeleton key={index} className="w-full h-40" />
								))}
							</div>
						);
					})}
			</div>
		</div>
	);
}
