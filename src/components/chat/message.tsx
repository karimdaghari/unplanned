interface ChatMessageProps {
	message: string;
}

export function ChatMessage({ message }: ChatMessageProps) {
	return (
		<div className="flex items-end gap-2 border rounded-2xl max-w-md p-4 bg-card">
			<div>{message}</div>
		</div>
	);
}
