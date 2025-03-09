import { Logo } from "@/components/logo";
import { createClient } from "@/db/supabase/server";
import { ThemeSwitcher } from "../theme-switcher";
import { SidebarTrigger } from "../ui/sidebar";
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
				{user ? <SidebarTrigger /> : null}
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
