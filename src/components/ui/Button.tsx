/** @format */

// components/ui/Button.tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "default" | "outline" | "ghost";
	size?: "sm" | "default" | "lg" | "icon";
	className?: string;
}

export function Button({
	children,
	variant = "default",
	size = "default",
	className,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(
				"inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				"disabled:pointer-events-none disabled:opacity-50",
				{
					"bg-primary text-primary-foreground hover:bg-primary/90":
						variant === "default",
					"border border-input bg-transparent hover:bg-accent hover:text-accent-foreground":
						variant === "outline",
					"hover:bg-accent hover:text-accent-foreground": variant === "ghost",
					"h-9 px-3 text-sm": size === "sm",
					"h-10 px-4 py-2": size === "default",
					"h-11 px-8 text-base": size === "lg",
					"h-9 w-9": size === "icon",
				},
				className,
			)}
			{...props}>
			{children}
		</button>
	);
}
