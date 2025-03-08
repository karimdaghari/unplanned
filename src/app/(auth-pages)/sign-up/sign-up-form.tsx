"use client";

import { signUpAction, signUpSchema } from "@/auth/actions";
import { FormMessage, type Message } from "@/components/form-message";
import { useAppForm } from "@/hooks/forms";
import Link from "next/link";

type SignUpFormProps = {
	message?: Message;
};

export function SignUpForm({ message }: SignUpFormProps) {
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChange: signUpSchema,
		},
	});

	return (
		<form className="flex flex-col min-w-64 max-w-64 mx-auto">
			<h1 className="text-2xl font-medium">Sign up</h1>
			<p className="text-sm text text-foreground">
				Already have an account?{" "}
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
				<form.SubmitButton formAction={signUpAction as never}>
					Sign up
				</form.SubmitButton>
				{message && <FormMessage message={message} />}
			</div>
		</form>
	);
}
