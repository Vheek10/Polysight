/** @format */

// components/ui/Label.tsx
import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps) {
	return (
		<label
			className={cn(
				"text-sm font-medium leading-none text-card-foreground",
				className,
			)}
			{...props}
		/>
	);
}
