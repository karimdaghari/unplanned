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
	const requestId = nanoid();
	console.log({
		type: "chat_request_start",
		requestId,
		timestamp: new Date().toISOString(),
	});

	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		console.warn({
			type: "chat_unauthorized",
			requestId,
			timestamp: new Date().toISOString(),
		});
		return new Response("Unauthorized", { status: 401 });
	}

	const { id, messages } = (await req.json()) as RequestBody;

	console.log({
		type: "chat_request_parsed",
		requestId,
		chatId: id,
		messageCount: messages.length,
		userId: user.id,
		timestamp: new Date().toISOString(),
	});

	const chat = await api.chats.getById({
		id,
	});

	let chatId = chat?.id;

	if (!chatId) {
		const firstMessage = messages[0];

		if (!firstMessage) {
			console.error({
				type: "chat_error_no_messages",
				requestId,
				chatId: id,
				userId: user.id,
				timestamp: new Date().toISOString(),
			});
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
				console.log({
					type: "chat_created",
					requestId,
					chatId: newChat.id,
					userId: user.id,
					title,
					timestamp: new Date().toISOString(),
				});
			} catch (error) {
				console.error({
					type: "chat_creation_error",
					requestId,
					error: error instanceof Error ? error.message : String(error),
					userId: user.id,
					timestamp: new Date().toISOString(),
				});
				return new Response("Failed to create new chat", { status: 500 });
			}
		} catch (error) {
			console.error({
				type: "chat_title_generation_error",
				requestId,
				error: error instanceof Error ? error.message : String(error),
				userId: user.id,
				timestamp: new Date().toISOString(),
			});

			try {
				const newChat = await api.chats.create({
					title: "New Conversation",
					id,
				});

				chatId = newChat.id;
				console.log({
					type: "chat_created_fallback",
					requestId,
					chatId: newChat.id,
					userId: user.id,
					timestamp: new Date().toISOString(),
				});
			} catch (createError) {
				console.error({
					type: "chat_creation_fallback_error",
					requestId,
					error:
						createError instanceof Error
							? createError.message
							: String(createError),
					userId: user.id,
					timestamp: new Date().toISOString(),
				});
				return new Response("Failed to create new chat", { status: 500 });
			}
		}
	}

	if (!chatId) {
		console.error({
			type: "chat_not_found",
			requestId,
			originalChatId: id,
			userId: user.id,
			timestamp: new Date().toISOString(),
		});
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

		console.log({
			type: "chat_messages_saved",
			requestId,
			chatId,
			messageCount: messages.length,
			userId: user.id,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error({
			type: "chat_message_save_error",
			requestId,
			chatId,
			error: error instanceof Error ? error.message : String(error),
			userId: user.id,
			timestamp: new Date().toISOString(),
		});
		return new Response("Failed to save messages", { status: 500 });
	}

	return createDataStreamResponse({
		execute(dataStream) {
			console.log({
				type: "chat_stream_start",
				requestId,
				chatId,
				userId: user.id,
				timestamp: new Date().toISOString(),
			});

			const result = streamText({
				model: openai("gpt-4o-mini"),
				messages,
				system: systemPrompt,
				experimental_transform: smoothStream({ chunking: "word" }),
				experimental_generateMessageId: nanoid,
				onFinish: async ({ response }) => {
					const messages = response.messages;
					try {
						await api.chats.saveMessage({
							chatId,
							messages: messages as never,
						});
						console.log({
							type: "chat_stream_complete",
							requestId,
							chatId,
							userId: user.id,
							timestamp: new Date().toISOString(),
						});
					} catch (error) {
						console.error({
							type: "chat_stream_save_error",
							requestId,
							chatId,
							error: error instanceof Error ? error.message : String(error),
							userId: user.id,
							timestamp: new Date().toISOString(),
						});
					}
				},
				onError: (error) => {
					console.error({
						type: "chat_stream_error",
						requestId,
						error: error instanceof Error ? error.message : String(error),
					});
				},
			});

			result.consumeStream();
			result.mergeIntoDataStream(dataStream);
		},
	});
}
