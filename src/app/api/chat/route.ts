import { createClient } from "@/db/supabase/server";
import { generateChatTitle, systemPrompt } from "@/lib/ai";
import { api } from "@/trpc/client/server";
import { openai } from "@ai-sdk/openai";
import { type Message, createDataStreamResponse, smoothStream } from "ai";
import { streamText } from "ai";
import { nanoid } from "nanoid";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface RequestBody {
	id: string;
	messages: Message[];
}

export async function POST(req: Request) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const { id, messages } = (await req.json()) as RequestBody;

	const chat = await api.chats.getById({
		id,
	});

	let chatId = chat?.id;

	if (!chatId) {
		const firstMessage = messages[0];

		if (!firstMessage) {
			return new Response("No messages", { status: 400 });
		}

		try {
			const title = await generateChatTitle(firstMessage);

			try {
				const newChat = await api.chats.create({
					title,
					id,
				});

				chatId = newChat.id;
			} catch (error) {
				console.error("Failed to create new chat:", error);
				return new Response("Failed to create new chat", { status: 500 });
			}
		} catch (error) {
			console.error("Failed to generate chat title:", error);
			// Fall back to a default title if title generation fails
			try {
				const newChat = await api.chats.create({
					title: "New Conversation",
					id,
				});

				chatId = newChat.id;
			} catch (createError) {
				console.error(
					"Failed to create new chat with default title:",
					createError,
				);
				return new Response("Failed to create new chat", { status: 500 });
			}
		}
	}

	if (!chatId) {
		return new Response("Chat not found", { status: 404 });
	}

	try {
		await api.chats.saveMessage({
			chatId,
			messages: messages.map((message) => ({
				...message,
				createdAt: message.createdAt as string | undefined,
			})),
		});
	} catch (error) {
		console.error("Failed to save messages:", error);
		return new Response("Failed to save messages", { status: 500 });
	}

	return createDataStreamResponse({
		execute(dataStream) {
			const result = streamText({
				model: openai("gpt-4o-mini"),
				messages,
				system: systemPrompt,
				experimental_transform: smoothStream({ chunking: "word" }),
				experimental_generateMessageId: nanoid,
				onFinish: async ({ response }) => {
					const messages = response.messages;

					await api.chats.saveMessage({
						chatId,
						messages: messages as never,
					});
				},
			});

			result.consumeStream();

			result.mergeIntoDataStream(dataStream);
		},
	});
}
