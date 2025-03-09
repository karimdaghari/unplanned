"use client";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client/react";
import { useChat } from "@ai-sdk/react";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, LightbulbIcon, MapPinIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ChatBox } from "./box";
import { ChatFooter } from "./footer";
import { ChatHeader } from "./header";
import { ChatMessage } from "./message";
import { SuggestionCard } from "./suggestion-card";

export function Chat() {
	const trpc = useTRPC();
	const saveConversation = useMutation(
		trpc.conversations.saveConversation.mutationOptions(),
	);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const {
		messages,
		handleSubmit,
		handleInputChange,
		input,
		status,
		stop,
		append,
	} = useChat({
		onFinish({ content, parts, id, role, createdAt }) {
			saveConversation.mutate({
				message: {
					content,
					id,
					createdAt,
					role,
					parts,
				},
			});
		},
	});

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	// Scroll to bottom when messages change or when streaming
	// biome-ignore lint/correctness/useExhaustiveDependencies: We want to scroll to bottom when messages change or when streaming
	useEffect(() => {
		scrollToBottom();
	}, [scrollToBottom, messages.length, status]);

	return (
		<div
			className={`flex flex-col h-[90dvh] w-full ${messages.length ? "justify-end" : "justify-center"}`}
		>
			{!messages.length && (
				<div className="flex flex-col gap-4 max-w-3xl w-full mx-auto">
					<ChatHeader />
					<aside className="grid grid-cols-3 gap-2">
						<SuggestionCard
							icon={<LightbulbIcon />}
							title="Inspiration"
							description="Give me some ideas"
							onClick={() => {
								append({
									role: "user",
									content: "I'm looking for ideas! Got some?",
								});
							}}
						/>
						<SuggestionCard
							icon={<MapPinIcon />}
							title="Plan a trip"
							description="Plan a trip for my team"
							onClick={() => {
								append({
									role: "user",
									content:
										"I'm looking for a team-related trip. Got some ideas?",
								});
							}}
						/>
						<SuggestionCard
							icon={<CalendarIcon />}
							title="Plan an event"
							description="Plan an event for my team"
							onClick={() => {
								append({
									role: "user",
									content:
										"I'm looking for a team-related event. Got some ideas?",
								});
							}}
						/>
					</aside>
				</div>
			)}

			<ScrollArea
				className={cn(
					"flex-grow overflow-auto p-3 pl-0 rounded-lg",
					messages.length === 0 && "hidden",
				)}
			>
				<div className="flex flex-col gap-4 max-w-3xl w-full mx-auto">
					{messages.map(({ id, content, role }) => (
						<ChatMessage key={id} message={content} role={role} />
					))}
					<div
						ref={messagesEndRef}
						className={cn(
							"shrink-0 min-w-7 min-h-7",
							messages.length === 0 && "hidden",
						)}
					/>
				</div>
			</ScrollArea>
			<div className="sticky bottom-4 space-y-2 pt-4 bg-background w-full max-w-3xl mx-auto">
				<ChatBox
					onSubmit={handleSubmit}
					onChange={handleInputChange}
					value={input}
					isLoading={status === "streaming" || status === "submitted"}
					stop={stop}
				/>
				<ChatFooter />
			</div>
		</div>
	);
}
