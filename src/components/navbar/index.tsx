import { auth } from "@/auth/auth";
import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "../theme-switcher";
import { SignInButton } from "./sign-in-button";
import { SignUpButton } from "./sign-up-button";
import { UserMenu } from "./user-menu";

export async function Navbar() {
	const user = await auth();

	return (
		<nav className="flex items-center justify-between">
			<Logo />

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
