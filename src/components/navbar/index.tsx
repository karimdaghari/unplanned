import { Logo } from "@/components/logo";
import { createClient } from "@/db/supabase/server";
import { Edit } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "../theme-switcher";
import { buttonVariants } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { SignInButton } from "./sign-in-button";
import { SignUpButton } from "./sign-up-button";
import { UserMenu } from "./user-menu";

export async function Navbar() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<nav className="flex items-center justify-between">
			<div className="flex items-center gap-1">
				<Logo />
				{user ? (
					<>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<SidebarTrigger />
								</TooltipTrigger>
								<TooltipContent side="bottom">Toggle sidebar</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Link
										href="/"
										className={buttonVariants({
											variant: "ghost",
											size: "sm",
											className: "rounded-full",
										})}
									>
										<Edit />
									</Link>
								</TooltipTrigger>
								<TooltipContent side="right">Start planning</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</>
				) : null}
			</div>

			<div className="flex items-center gap-2 pr-4">
				<ThemeSwitcher />
				{user ? (
					<UserMenu />
				) : (
					<>
						<SignUpButton />
						<SignInButton />
					</>
				)}
			</div>
		</nav>
	);
}
