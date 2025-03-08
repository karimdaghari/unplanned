"use client";
import { CalendarIcon, LightbulbIcon, MapPinIcon } from "lucide-react";
import { ChatBox } from "./box";
import { ChatMessage } from "./message";
import { SuggestionCard } from "./suggestion-card";

export function Chat() {
	return (
		<div className="flex flex-col gap-4 w-full">
			<aside className="grid grid-cols-3 gap-2">
				<SuggestionCard
					icon={<LightbulbIcon />}
					title="Inspiration"
					description="Give me some ideas"
					onClick={() => {}}
				/>
				<SuggestionCard
					icon={<MapPinIcon />}
					title="Plan a trip"
					description="Plan a trip for my team"
					onClick={() => {}}
				/>
				<SuggestionCard
					icon={<CalendarIcon />}
					title="Plan an event"
					description="Plan an event for my team"
					onClick={() => {}}
				/>
			</aside>

			<ChatMessage message="Hello, how are you?" />
			<ChatBox onSubmit={() => {}} />
		</div>
	);
}
