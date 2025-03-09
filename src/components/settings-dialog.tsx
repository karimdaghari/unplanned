"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/forms";
import {
	type UpdateUserSchema,
	updateUserSchema,
} from "@/shared/schemas/update-user";
import { useTRPC } from "@/trpc/client/react";

interface SettingsDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	input: UpdateUserSchema;
}

export function SettingsDialog({
	isOpen,
	onOpenChange,
	input,
}: SettingsDialogProps) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const updateUserMutation = useMutation(
		trpc.users.updateUser.mutationOptions(),
	);

	const form = useAppForm({
		defaultValues: input,
		validators: {
			onSubmit: updateUserSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const { success, message } = await updateUserMutation.mutateAsync({
					name: value.name,
				});

				if (success) {
					// Invalidate queries to refresh user data
					await queryClient.invalidateQueries({
						queryKey: trpc.users.getUser.queryKey(),
					});
					toast.success("Settings updated successfully", {
						description: message,
					});
				} else {
					toast.error("Failed to update settings", {
						description: message,
					});
				}
			} catch (_err) {
				toast.error("Something went wrong", {
					description: "Please try again later",
				});
			}
		},
	});

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-4">
					<form.AppForm>
						<form
							className="flex flex-col w-full gap-4"
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
						>
							<form.AppField
								name="name"
								children={(field) => (
									<field.TextField label="Name" placeholder="Your name" />
								)}
							/>
							<form.SubmitButton>Update Settings</form.SubmitButton>
						</form>
					</form.AppForm>
				</div>
			</DialogContent>
		</Dialog>
	);
}
