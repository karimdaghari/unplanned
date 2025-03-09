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
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SignUpForm } from "./form";

export function SignUpButton() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [loading, setLoading] = useState(false);

	const [open, setOpen] = useState(false);

	const openParam = searchParams.get("open");

	useEffect(() => {
		if (openParam === "sign-in") {
			setOpen(false);
		}

		if (openParam === "sign-up") {
			setOpen(true);
			router.replace(pathname);
		}
	}, [openParam, pathname, router]);

	const signInHref = `${pathname}?open=sign-in`;

	const handleOpenChange = (open: boolean) => {
		if (loading) return;
		setOpen(open);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size="sm">
					<UserIcon />
					Sign up
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Sign up</DialogTitle>
					<DialogDescription>
						Already have an account?{" "}
						<Link
							className="text-primary font-medium underline"
							href={signInHref.toString()}
						>
							Sign in
						</Link>
					</DialogDescription>
				</DialogHeader>

				<SignUpForm setLoading={setLoading} />
			</DialogContent>
		</Dialog>
	);
}
