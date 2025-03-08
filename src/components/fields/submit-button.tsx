import { useFormContext } from "@/hooks/form-context";
import { Button, type ButtonProps } from "../ui/button";

export function SubmitButton(props: ButtonProps) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => <Button {...props} loading={isSubmitting} />}
		</form.Subscribe>
	);
}
