"use client";
import { signOutAction } from "@/auth/actions";
import { SettingsDialog } from "@/components/settings-dialog";
import { useTRPC } from "@/trpc/client/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
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
	const queryClient = useQueryClient();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const { data: user, isLoading } = useQuery(trpc.users.getUser.queryOptions());

	const handleSignOut = async () => {
		await signOutAction();
		await queryClient.invalidateQueries({
			type: "all",
		});
	};

	if (isLoading) return <Skeleton className="size-8 rounded-full" />;

	if (!user) return null;

	return (
		<>
			<SettingsDialog
				isOpen={isSettingsOpen}
				onOpenChange={setIsSettingsOpen}
				initialName={user.name || ""}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="p-0 rounded-full">
						<Avatar className="size-8">
							<AvatarImage src={user.avatar ?? undefined} />
							<AvatarFallback className="text-xs">
								{user.name?.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" alignOffset={10}>
					<DropdownMenuLabel>
						<p>{user.name}</p>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
						<Settings className="w-4 h-4 mr-2" />
						Settings
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleSignOut}>
						<LogOut className="w-4 h-4 mr-2" />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
