"use client";

import {
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuSkeleton,
} from "../ui/sidebar";

import { SidebarMenu } from "../ui/sidebar";

import { useTRPC } from "@/trpc/client/react";
import type { RouterOutputs } from "@/trpc/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuItem } from "../ui/sidebar";

export function ChatList() {
	const trpc = useTRPC();

	const { data: chats, isLoading } = useQuery(trpc.chats.getAll.queryOptions());

	if (isLoading) return <ChatListSkeleton />;

	return (
		<SidebarMenu>
			{chats?.length ? (
				chats?.map((chat) => <ChatListItem key={chat.id} chat={chat} />)
			) : (
				<SidebarMenuItem>
					<SidebarMenuButton disabled>
						<span>No chats yet</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			)}
		</SidebarMenu>
	);
}

function ChatListSkeleton() {
	return (
		<SidebarMenu>
			{Array.from({ length: 10 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: it's fine here
				<SidebarMenuItem key={index}>
					<SidebarMenuSkeleton />
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
}

interface ChatListItemProps {
	chat: RouterOutputs["chats"]["getAll"][number];
}

function ChatListItem({ chat }: ChatListItemProps) {
	const trpc = useTRPC();

	const deleteChat = useMutation(
		trpc.chats.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Chat deleted");
			},
		}),
	);

	return (
		<SidebarMenuItem key={chat.id}>
			<SidebarMenuButton asChild className="truncate w-5/6">
				<Link href={`/chats/${chat.id}`} prefetch>
					{chat.title}
				</Link>
			</SidebarMenuButton>
			<AlertDialog>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							You're about to delete {chat.title}
						</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this chat? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => deleteChat.mutate({ id: chat.id })}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuAction className="rounded">
							<MoreHorizontal />
						</SidebarMenuAction>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="right" align="start">
						<AlertDialogTrigger asChild>
							<DropdownMenuItem>
								<Trash2Icon />
								<span>Delete chat</span>
							</DropdownMenuItem>
						</AlertDialogTrigger>
					</DropdownMenuContent>
				</DropdownMenu>
			</AlertDialog>
		</SidebarMenuItem>
	);
}
