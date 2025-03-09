import { Chat } from "@/components/chat";
import { api } from "@/trpc/client/server";

interface ChatPageProps {
	params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
	const { id } = await params;

	const messages = await api.chats.getMessagesById({ id });

	return <Chat initialMessages={messages as never} id={id} />;
}
