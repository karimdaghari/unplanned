import { Typography } from "../typography";

export function ChatHeader() {
	return (
		<div className="flex items-center flex-col">
			<Typography variant="h3" className="font-medium!">
				Welcome to Unplanned.
			</Typography>
			<Typography variant="h4" className="font-extralight!">
				Your planning copilot.
			</Typography>
		</div>
	);
}
