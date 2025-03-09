import { Chat } from "@/components/chat";
import { nanoid } from "nanoid";

export default function App() {
	const id = nanoid();

	return <Chat id={id} />;
}
