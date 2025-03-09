import { Typography } from "../typography";

export function ChatFooter() {
	return (
		<div className="flex items-center justify-center">
			<Typography variant="muted" className="text-xs">
				Powered by{" "}
				<a
					href="https://planned.com"
					className="underline"
					target="_blank"
					rel="noreferrer"
				>
					Planned
				</a>
			</Typography>
		</div>
	);
}
