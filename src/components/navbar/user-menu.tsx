"use client";
import { signOutAction } from "@/auth/actions";
import { useTRPC } from "@/trpc/client/react";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";

export function UserMenu() {
	const trpc = useTRPC();
	const { data: user, isLoading } = useQuery(trpc.users.getUser.queryOptions());

	if (isLoading) {
		return <Skeleton className="size-8 rounded-full" />;
	}

	if (!user) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="size-8">
					<AvatarImage src={user.user_metadata.avatar_url} />
					<AvatarFallback className="text-xs">
						{user.email?.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" alignOffset={10}>
				<DropdownMenuLabel>
					<p>{user.email}</p>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={signOutAction}>
					<LogOut className="w-4 h-4" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
