import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";

interface ChatMessageProps {
	message: string;
	role: "user" | "assistant" | (string & {});
}

export function ChatMessage({ message, role }: ChatMessageProps) {
	return (
		<div
			className={cn(
				"px-4 py-2",
				role === "user" &&
					"flex items-end gap-2 border rounded-2xl max-w-3xl whitespace-pre-wrap ml-auto bg-accent",
			)}
		>
			<div className="prose-base dark:prose-invert">
				<Markdown>{message}</Markdown>
			</div>
		</div>
	);
}
