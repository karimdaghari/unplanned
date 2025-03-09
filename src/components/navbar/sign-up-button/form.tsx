"use client";

import { signUpAction } from "@/auth/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppForm } from "@/hooks/forms";
import { cn } from "@/lib/utils";
import { signUpSchema } from "@/shared/schemas";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
	/**
	 * This is used to prevent the modal from being accidentally closed
	 * while the action is loading.
	 */
	setLoading: (loading: boolean) => void;
}

export function SignUpForm({ setLoading }: Props) {
	const [status, setStatus] = useState<"success" | "error" | "idle">("idle");
	const [message, setMessage] = useState<string | null>(null);

	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		validators: {
			onSubmit: signUpSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				setLoading(true);
				const { success, message } = await signUpAction(value);

				if (success) {
					setStatus("success");
					setMessage(message);
				} else {
					setStatus("error");
					setMessage(message);
				}
			} catch {
				toast.error("Something went seriously wrong", {
					description: "If the issues persists contact Karim!",
				});
			} finally {
				setLoading(false);
			}
		},
	});

	return (
		<div className="flex flex-col gap-2">
			<div
				className={cn(
					"transition-all duration-300 overflow-hidden mb-0",
					status === "success" ? "opacity-100 h-auto mb-4" : "opacity-0 h-0",
				)}
			>
				<Alert className="bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800 text-green-400 dark:text-green-400">
					<AlertTitle>You're (almost) in!</AlertTitle>
					<AlertDescription className="text-inherit">
						{message ?? "Please check your email for a verification link."}
					</AlertDescription>
				</Alert>
			</div>

			<div
				className={cn(
					"transition-all duration-300 overflow-hidden mb-0",
					status === "error" ? "opacity-100 h-auto mb-4" : "opacity-0 h-0",
				)}
			>
				<Alert className="bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-800 text-red-400 dark:text-red-400">
					<AlertTitle>Oops!</AlertTitle>
					<AlertDescription className="text-inherit">
						{message ?? "Something went wrong."}
					</AlertDescription>
				</Alert>
			</div>

			<div
				className={cn(
					"transition-all duration-300",
					status === "success"
						? "opacity-0 h-0 overflow-hidden"
						: "opacity-100 h-auto",
				)}
			>
				<form.AppForm>
					<form
						className="flex flex-col w-full"
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<div className="flex flex-col gap-2">
							<form.AppField
								name="name"
								children={(field) => (
									<field.TextField label="Name" placeholder="Your name" />
								)}
							/>
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
			</div>
		</div>
	);
}
