"use client";
import { TextField } from "@/components/fields/text";
import { Button, type ButtonProps } from "@/components/ui/button";
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext, useFormContext } from "./form-context";

function SubmitButton(props: ButtonProps) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => <Button {...props} disabled={isSubmitting} />}
		</form.Subscribe>
	);
}

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		TextField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
