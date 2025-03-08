import { MountainSnowIcon } from "lucide-react";
import Link from "next/link";
import { Typography } from "./typography";

export function Logo() {
	return (
		<Link
			href="/"
			className="flex items-start gap-2 hover:bg-accent/50 transition-colors duration-300 ease-in-out px-2 py-1 rounded-lg"
		>
			<MountainSnowIcon className="size-6" />
			<Typography variant="h4">Unplanned</Typography>
		</Link>
	);
}
