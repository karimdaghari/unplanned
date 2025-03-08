import { useFieldContext } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { Input, type InputProps } from "../ui/input";
import { Label } from "../ui/label";

interface TextFieldProps extends InputProps {
	label?: string;
	description?: string;
}

export function TextField({ label, description, ...props }: TextFieldProps) {
	const field = useFieldContext<string>();

	const errors = useStore(field.store, (state) =>
		state.meta.errors.map(({ message }) => message),
	);

	return (
		<div className="space-y-2">
			{label && <Label>{label}</Label>}
			<Input
				{...props}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{description && <p>{description}</p>}
			{errors && <p>{errors.join(", ")}</p>}
		</div>
	);
}
