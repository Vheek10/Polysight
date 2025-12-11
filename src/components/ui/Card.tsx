/** @format */

// components/ui/Card.tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
	children: ReactNode;
	className?: string;
}

export function Card({ children, className }: CardProps) {
	return (
		<div
			className={cn(
				"rounded-xl border bg-card text-card-foreground shadow-sm",
				className,
			)}>
			{children}
		</div>
	);
}
