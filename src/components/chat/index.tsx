"use client";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client/react";
import { type Message, useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, LightbulbIcon, MapPinIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ChatBox } from "./box";
import { ChatFooter } from "./footer";
import { ChatHeader } from "./header";
import { ChatMessage } from "./message";
import { ThinkingBox } from "./message-thinking";
import { SuggestionCard } from "./suggestion-card";

interface ChatProps {
	id: string;
	initialMessages?: Message[];
}

export function Chat({ id: chatId, initialMessages }: ChatProps) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const { data: isLoggedIn } = useQuery(trpc.users.isLoggedIn.queryOptions());

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
		id: chatId,
		initialMessages,
		sendExtraMessageFields: true,
		generateId: nanoid,
		onFinish: async () => {
			await queryClient.invalidateQueries({
				queryKey: trpc.chats.getAll.queryKey(),
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

	const handleSuggestionClick = (content: string) => {
		if (!isLoggedIn) {
			toast.info("You need to sign in to use this feature");
			return;
		}

		append({
			role: "user",
			content,
		});
	};

	return (
		<div
			className={cn(
				"flex flex-col h-[90dvh] w-full",
				messages.length ? "justify-end" : "justify-center",
			)}
		>
			{!messages.length && (
				<div className="flex flex-col gap-4 max-w-3xl w-full mx-auto">
					<ChatHeader />
					<aside className="grid lg:grid-cols-3 gap-2">
						<SuggestionCard
							icon={<LightbulbIcon />}
							title="Inspiration"
							description="Give me some ideas"
							onClick={() =>
								handleSuggestionClick("I'm looking for ideas! Got some?")
							}
						/>
						<SuggestionCard
							icon={<MapPinIcon />}
							title="Plan a trip"
							description="Plan a trip for my team"
							onClick={() => {
								handleSuggestionClick(
									"I'm looking for a team-related trip. Got some ideas?",
								);
							}}
						/>
						<SuggestionCard
							icon={<CalendarIcon />}
							title="Plan an event"
							description="Plan an event for my team"
							onClick={() => {
								handleSuggestionClick(
									"I'm looking for a team-related event. Got some ideas?",
								);
							}}
						/>
					</aside>
				</div>
			)}

			<div
				className={cn(
					"flex-grow overflow-auto overscroll-contain p-3 pl-0 rounded-lg",
					messages.length === 0 && "hidden",
				)}
			>
				<div className="flex flex-col gap-4 max-w-3xl w-full mx-auto">
					{messages.map(({ id, content, role }) => (
						<ChatMessage key={id} message={content} role={role} />
					))}

					<ThinkingBox isThinking={status === "streaming"} message="Thinking" />

					<div
						ref={messagesEndRef}
						className={cn(
							"shrink-0 min-w-7 min-h-7",
							messages.length === 0 && "hidden",
						)}
					/>
				</div>
			</div>
			<div className="sticky bottom-8 space-y-2 pt-4 bg-background w-full max-w-3xl mx-auto">
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
