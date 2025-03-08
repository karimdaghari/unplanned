import { Chat } from "@/components/chat";
import { Typography } from "@/components/typography";
import Link from "next/link";

export default function App() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center flex-col">
				<Typography variant="h3" className="font-medium!">
					Welcome to Unplanned.
				</Typography>
				<Typography variant="h4" className="font-extralight!">
					Your planning copilot.
				</Typography>
			</div>

			<Chat />

			<Typography variant="muted" className="text-center text-xs">
				Unplanned helps you plan your corporate travels and events. It is
				integrated with{" "}
				<Link href="https://planned.com" className="underline" target="_blank">
					planned
				</Link>{" "}
				to give you the best experience.
			</Typography>
		</div>
	);
}
