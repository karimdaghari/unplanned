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

		const title = await generateChatTitle(firstMessage);

		const newChat = await api.chats.create({
			title,
			id,
		});

		chatId = newChat.id;
	}

	if (!chatId) {
		return new Response("Chat not found", { status: 404 });
	}

	await api.chats.saveMessage({
		chatId,
		messages: messages.map((message) => ({
			...message,
			createdAt: message.createdAt as string | undefined,
		})),
	});

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
						messages,
					});
				},
			});

			result.consumeStream();

			result.mergeIntoDataStream(dataStream);
		},
	});
}
