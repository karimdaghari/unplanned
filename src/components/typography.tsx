import { type VariantProps, cva } from "class-variance-authority";
import type { CSSProperties } from "react";

interface Props {
	children: React.ReactNode;
	className?: string;
	style?: CSSProperties;
}

export const typographyVariants = cva("", {
	variants: {
		variant: {
			h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
			h2: "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
			h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
			h4: "scroll-m-20 text-xl font-semibold tracking-tight",
			p: "leading-7",
			blockquote: "mt-6 border-l-2 pl-6 italic",
			ul: "my-6 ml-6 [&>li]:mt-2 list-disc",
			ol: "my-6 ml-6 [&>li]:mt-2 list-decimal",
			code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
			lead: "text-xl text-muted-foreground",
			large: "text-lg font-semibold",
			small: "text-sm font-medium leading-none",
			muted: "text-sm text-muted-foreground",
		},
	},
	defaultVariants: {
		variant: "p",
	},
});

type TypographyVariantsProps = VariantProps<typeof typographyVariants>;

interface TypographyProps extends Props, TypographyVariantsProps {}

export function Typography({
	children,
	variant = "p",
	style,
	className,
}: TypographyProps) {
	if (!variant) return null;

	if (variant === "lead" || variant === "muted" || variant === "large") {
		return (
			<div className={typographyVariants({ variant, className })} style={style}>
				{children}
			</div>
		);
	}

	const Comp = variant;

	return (
		<Comp className={typographyVariants({ variant, className })} style={style}>
			{children}
		</Comp>
	);
}
