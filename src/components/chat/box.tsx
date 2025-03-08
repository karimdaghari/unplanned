import { useForm } from "@tanstack/react-form";
import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface ChatBoxProps {
	onSubmit: (message: string) => void;
}

export function ChatBox({ onSubmit }: ChatBoxProps) {
	const form = useForm({
		defaultValues: {
			message: "",
		},
		onSubmit: ({ value }) => {
			onSubmit(value.message);
		},
	});

	return (
		<form
			className="border rounded-3xl p-4 bg-card"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="message"
				children={(field) => (
					<Textarea
						className="h-10 overflow-hidden rounded-3xl border-0 focus-visible:ring-0 resize-none shadow-none"
						placeholder="Start planning your next event/travel..."
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
					/>
				)}
			/>
			<div className="w-full flex items-center justify-end">
				<div>
					<Button
						type="submit"
						variant="secondary"
						size="icon"
						className="rounded-full"
					>
						<ArrowUp />
					</Button>
				</div>
			</div>
		</form>
	);
}
