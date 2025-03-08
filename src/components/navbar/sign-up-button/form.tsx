"use client";

import { signUpAction } from "@/auth/actions";
import { signUpSchema } from "@/auth/schemas";
import { useAppForm } from "@/hooks/forms";
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
					toast.success("You're (almost) in!", { description: message });
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
				className="flex flex-col w-full"
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
					<form.SubmitButton>Sign up</form.SubmitButton>
				</div>
			</form>
		</form.AppForm>
	);
}
