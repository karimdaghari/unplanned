import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CreditCardIcon, ForwardIcon, Globe2Icon, MapPin } from "lucide-react";
import Image from "next/image";
import { Typography } from "../typography";
import { buttonVariants } from "../ui/button";

interface Props {
	name: string;
	location: string;
	description: string;
	country: string;
	price: string;
	imageUrl: string;
}

export function VenueCard({
	name = "The Grand Hall",
	location = "Downtown",
	country = "United States",
	price = "$1,200",
	imageUrl = "/placeholder.svg?height=200&width=400",
	description = "The Grand Hall is a beautiful venue with a large hall and a beautiful view of the city.",
}: Props) {
	return (
		<Card className="overflow-hidden w-full max-w-sm transition-all hover:shadow-md">
			<div className="p-4 pb-0">
				<div className="relative h-48 w-full">
					<Image
						src={imageUrl || "/placeholder.svg"}
						alt={name}
						fill
						className="object-cover rounded-2xl"
						priority
						unoptimized
					/>
				</div>
			</div>
			<CardContent className="p-4 pt-0 space-y-2">
				<div>
					<Typography variant="h4" className="line-clamp-1">
						{name}
					</Typography>
					<div className="flex items-center text-sm text-muted-foreground gap-4">
						<div className="flex items-center gap-1">
							<MapPin className="size-4 flex-shrink-0" />
							<Typography variant="p" className="line-clamp-1">
								{location}
							</Typography>
						</div>
						<div className="flex items-center gap-1">
							<Globe2Icon className="size-4 flex-shrink-0" />
							<Typography variant="p" className="line-clamp-1">
								{country}
							</Typography>
						</div>
						<div className="flex items-center gap-1">
							<CreditCardIcon className="size-4 flex-shrink-0" />
							<Typography variant="p" className="line-clamp-1">
								{price}
							</Typography>
						</div>
					</div>
				</div>
				<Typography variant="p" className="line-clamp-2">
					{description}
				</Typography>
			</CardContent>
			<CardFooter className="px-4">
				<a
					href="https://www.planned.com"
					target="_blank"
					rel="noreferrer"
					className={buttonVariants({
						size: "lg",
						className: "w-full",
					})}
				>
					<ForwardIcon />
					Book with Planned
				</a>
			</CardFooter>
		</Card>
	);
}
