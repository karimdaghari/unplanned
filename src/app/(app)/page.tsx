import { Chat } from "@/components/chat";

export default function App() {
	const id = crypto.randomUUID();

	return <Chat id={id} />;
}
