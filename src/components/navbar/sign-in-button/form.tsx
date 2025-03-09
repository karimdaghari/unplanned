"use client";

import { signInAction } from "@/auth/actions";
import { useAppForm } from "@/hooks/forms";
import { signInSchema } from "@/shared/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
	/**
	 * This is used to prevent the modal from being accidentally closed
	 * while the action is loading.
	 */
	setLoading: (loading: boolean) => void;
}

export function SignInForm({ setLoading }: Props) {
	const queryClient = useQueryClient();

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
				setLoading(true);
				const { success, message } = await signInAction(value);

				if (success) {
					toast.success("Signed in successfully");
					await queryClient.invalidateQueries();
				} else {
					toast.error("Sign in failed", {
						description: message,
					});
				}
			} catch {
				toast.error("Something went seriously wrong", {
					description: "If the issue persists contact Karim!",
				});
			} finally {
				setLoading(false);
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
