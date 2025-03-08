"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
	required?: boolean;
}

function Label({ className, required, ...props }: LabelProps) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			className={cn(
				"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
				required && "after:content-['*']",
				className,
			)}
			{...props}
		/>
	);
}

export { Label };
