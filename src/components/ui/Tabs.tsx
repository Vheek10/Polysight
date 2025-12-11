/** @format */

// components/ui/Tabs.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

const TabsContext = createContext<{
	value: string;
	onValueChange: (value: string) => void;
}>({
	value: "",
	onValueChange: () => {},
});

interface TabsProps {
	value: string;
	onValueChange: (value: string) => void;
	children: React.ReactNode;
	className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
	return (
		<TabsContext.Provider value={{ value, onValueChange }}>
			<div className={cn("w-full", className)}>{children}</div>
		</TabsContext.Provider>
	);
}

export function TabsList({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1",
				className,
			)}>
			{children}
		</div>
	);
}

interface TabsTriggerProps {
	value: string;
	children: React.ReactNode;
	className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
	const { value: selectedValue, onValueChange } = useContext(TabsContext);

	return (
		<button
			onClick={() => onValueChange(value)}
			className={cn(
				"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium",
				"transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				selectedValue === value
					? "bg-background text-foreground shadow-sm"
					: "text-muted-foreground hover:bg-background/50 hover:text-foreground",
				className,
			)}>
			{children}
		</button>
	);
}
