import { ArrowUpRight } from "lucide-react";
import { Typography } from "../typography";

interface SuggestionCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	onClick: () => void;
}

export function SuggestionCard({
	icon,
	title,
	description,
	onClick,
}: SuggestionCardProps) {
	return (
		<button
			type="button"
			className="py-3 px-4 rounded-xl border bg-card relative group [&_svg]:text-muted-foreground [&_svg]:size-4 hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
			onClick={onClick}
		>
			<div className="flex flex-col gap-2 items-start">
				<span>{icon}</span>
				<div className="flex flex-col items-start">
					<Typography variant="small">{title}</Typography>
					<Typography variant="muted">{description}</Typography>
				</div>
			</div>
			<ArrowUpRight className="absolute right-4 top-1/4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
		</button>
	);
}
