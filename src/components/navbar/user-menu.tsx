"use client";
import { signOutAction } from "@/auth/actions";
import { useTRPC } from "@/trpc/client/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Suspense } from "react";
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
	return (
		<Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
			<UserMenuLoader />
		</Suspense>
	);
}

function UserMenuLoader() {
	const trpc = useTRPC();
	const { data: user } = useSuspenseQuery(trpc.users.getUser.queryOptions());

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar>
					<AvatarImage src={user.user_metadata.avatar_url} />
					<AvatarFallback>
						{user.user_metadata.display_name?.slice(0, 2).toUpperCase()}
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
