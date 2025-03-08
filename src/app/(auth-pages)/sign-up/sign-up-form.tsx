"use client";

import { signUpAction } from "@/auth/actions";
import { signUpSchema } from "@/auth/schemas";
import { useAppForm } from "@/hooks/forms";
import Link from "next/link";
import { toast } from "sonner";

export function SignUpForm() {
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: signUpSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const { success, message } = await signUpAction(value);

				if (success) {
					toast.success("You're in!", { description: message });
				} else {
					toast.error("Oops!", {
						description: message,
					});
				}
			} catch {
				toast.error("Something went seriously wrong", {
					description: "If the issues persists contact Karim!",
				});
			}
		},
	});

	return (
		<form.AppForm>
			<form
				className="flex flex-col min-w-64 max-w-64 mx-auto"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<h1 className="text-2xl font-medium">Sign up</h1>
				<p className="text-sm text text-foreground">
					Already have an account?
					<Link className="text-primary font-medium underline" href="/sign-in">
						Sign in
					</Link>
				</p>
				<div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
					<form.AppField
						name="email"
						children={(field) => (
							<field.TextField label="Email" placeholder="you@example.com" />
						)}
					/>
					<form.AppField
						name="password"
						children={(field) => (
							<field.TextField label="Password" placeholder="Your password" />
						)}
					/>
					<form.SubmitButton>Sign up</form.SubmitButton>
				</div>
			</form>
		</form.AppForm>
	);
}
