import { ArrowUp, SquareIcon } from "lucide-react";
import type { KeyboardEvent } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface ChatBoxProps {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	value: string;
	isLoading: boolean;
	stop: () => void;
}

export function ChatBox({
	onSubmit,
	onChange,
	value,
	isLoading,
	stop,
}: ChatBoxProps) {
	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		// Check for Cmd/Ctrl + Enter
		if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
			e.preventDefault();
			if (value.trim()) {
				const form = e.currentTarget.form;
				if (form) form.requestSubmit();
			}
		}
	};

	return (
		<div className="max-w-3xl w-full mx-auto">
			<form className="border rounded-3xl p-4 bg-card" onSubmit={onSubmit}>
				<Textarea
					className="h-10 overflow-hidden rounded-3xl border-0 focus-visible:ring-0 resize-none shadow-none"
					placeholder="Start planning your next event/travel..."
					value={value}
					onChange={onChange}
					onKeyDown={handleKeyDown}
				/>
				<div className="w-full flex items-center justify-end">
					<div>
						<Button
							type="submit"
							variant="secondary"
							size="icon"
							className="rounded-full group flex items-center justify-center relative"
							onClick={() => {
								if (isLoading) {
									stop();
								}
							}}
							disabled={!value.trim()}
						>
							{isLoading ? <SquareIcon /> : <ArrowUp />}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
