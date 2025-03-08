"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm">
					{theme === "light" ? (
						<Sun key="light" className="text-muted-foreground" />
					) : theme === "dark" ? (
						<Moon key="dark" className="text-muted-foreground" />
					) : (
						<Laptop key="system" className="text-muted-foreground" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-content" align="end">
				<DropdownMenuRadioGroup
					value={theme}
					onValueChange={(e) => setTheme(e)}
				>
					<DropdownMenuRadioItem className="flex gap-2" value="light">
						<Sun className="text-muted-foreground" /> <span>Light</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem className="flex gap-2" value="dark">
						<Moon className="text-muted-foreground" /> <span>Dark</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem className="flex gap-2" value="system">
						<Laptop className="text-muted-foreground" /> <span>System</span>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export { ThemeSwitcher };
