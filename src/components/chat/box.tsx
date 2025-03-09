import { useTRPC } from "@/trpc/client/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, SquareIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
	const trpc = useTRPC();

	const router = useRouter();

	const { data: isLoggedIn } = useQuery(trpc.users.isLoggedIn.queryOptions());

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
			<form
				className="border rounded-3xl p-4 bg-card transition-colors focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50"
				onSubmit={onSubmit}
			>
				<Textarea
					className="h-10 overflow-hidden rounded-3xl border-0 focus-visible:ring-0 resize-none shadow-none"
					placeholder="Start planning your next event/travel..."
					value={value}
					onChange={onChange}
					onKeyDown={handleKeyDown}
					onFocus={() => {
						if (!isLoggedIn) {
							router.push("/?open=sign-in");
						}
					}}
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
