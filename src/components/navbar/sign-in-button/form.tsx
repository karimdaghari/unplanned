"use client";

import { signInAction } from "@/auth/actions";
import { signInSchema } from "@/auth/schemas";
import { useAppForm } from "@/hooks/forms";
import { toast } from "sonner";

export function SignInForm() {
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: signInSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await signInAction(value);
				// If we get here, it means there was no redirect, which is unexpected
				// Let's show a generic success message
				toast.success("Signed in successfully");
			} catch (error) {
				// Handle different types of errors
				if (typeof error === "object" && error !== null && "message" in error) {
					toast.error("Sign in failed", {
						description: error.message as string,
					});
				} else {
					toast.error("Something went seriously wrong", {
						description: "If the issue persists contact Karim!",
					});
				}
			}
		},
	});

	return (
		<form.AppForm>
			<form
				className="flex-1 flex flex-col"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
					<form.AppField
						name="email"
						children={(field) => (
							<field.TextField
								label="Email"
								placeholder="you@example.com"
								type="email"
							/>
						)}
					/>
					<form.AppField
						name="password"
						children={(field) => (
							<field.TextField
								label="Password"
								placeholder="Your password"
								type="password"
							/>
						)}
					/>
					<form.SubmitButton>Sign in</form.SubmitButton>
				</div>
			</form>
		</form.AppForm>
	);
}
