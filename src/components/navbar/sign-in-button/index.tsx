"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { UserCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInForm } from "./form";
export function SignInButton() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const [loading, setLoading] = useState(false);

	const [open, setOpen] = useState(false);

	const handleOpenChange = (open: boolean) => {
		if (loading) return;
		setOpen(open);
	};

	const openSearchParam = searchParams.get("open");

	useEffect(() => {
		if (openSearchParam === "sign-in") {
			setOpen(true);
			router.replace(pathname);
		}

		if (openSearchParam === "sign-up") {
			setOpen(false);
		}
	}, [openSearchParam, pathname, router]);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<UserCircle2 />
					Sign in
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Sign in</DialogTitle>
					<DialogDescription>
						Don't have an account?{" "}
						<Link
							href={`${pathname}?open=sign-up`}
							className="text-primary font-medium underline"
						>
							Sign up
						</Link>
					</DialogDescription>
				</DialogHeader>

				<SignInForm setLoading={setLoading} />
			</DialogContent>
		</Dialog>
	);
}
