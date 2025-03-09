import { ArrowUpRight } from "lucide-react";
import { Typography } from "../typography";

interface SuggestionCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	onClick: () => void;
	comingSoon?: boolean;
}

export function SuggestionCard({
	icon,
	title,
	description,
	onClick,
	comingSoon = false,
}: SuggestionCardProps) {
	return (
		<button
			type="button"
			className="py-3 px-4 rounded-xl border bg-card relative group [&_svg]:text-muted-foreground [&_svg]:size-4 not-disabled:hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
			onClick={onClick}
			disabled={comingSoon}
		>
			<div className="flex flex-col gap-2 items-start">
				<span>{icon}</span>
				<div className="flex flex-col items-start">
					<Typography variant="small">{title}</Typography>
					<Typography variant="muted">{description}</Typography>
				</div>
			</div>
			{comingSoon ? (
				<div className="absolute right-4 top-1/4 -translate-y-1/2">
					<Typography variant="muted" className="uppercase text-[9px]">
						Coming soon
					</Typography>
				</div>
			) : (
				<ArrowUpRight className="absolute right-4 top-1/4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
			)}
		</button>
	);
}
