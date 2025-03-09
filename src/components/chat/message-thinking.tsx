"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
	isThinking?: boolean;
	className?: string;
	timeout?: number;
	message?: string;
	timeoutMessage?: string;
}

export function ThinkingBox({
	isThinking = false,
	className = "",
	timeout = 15000, // 15 seconds default timeout
	message = "Thinking...",
	timeoutMessage = "This is taking longer than expected. I'm still working on it.",
}: Props) {
	const [showTimeout, setShowTimeout] = useState(false);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		if (isThinking) {
			setShowTimeout(false);
			timeoutId = setTimeout(() => {
				setShowTimeout(true);
			}, timeout);
		}

		return () => {
			clearTimeout(timeoutId);
			setShowTimeout(false);
		};
	}, [isThinking, timeout]);

	if (!isThinking) return null;

	return (
		<div
			className={cn(
				"flex items-center gap-3 p-4 rounded-lg bg-muted/50 max-w-[80%] w-fit animate-in fade-in slide-in-from-left-5 duration-300",
				className,
			)}
		>
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
				<Loader2 className="size-4 text-primary animate-spin" />
			</div>
			<div className="flex flex-col">
				<p className="text-sm font-medium text-foreground">
					{message}
					<ThinkingDots />
				</p>
				{showTimeout && (
					<p className="text-xs text-muted-foreground animate-in fade-in duration-300">
						{timeoutMessage}
					</p>
				)}
			</div>
		</div>
	);
}

function ThinkingDots() {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => {
				if (prev.length >= 3) return "";
				return `${prev}.`;
			});
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return <span className="inline-block w-6">{dots}</span>;
}
