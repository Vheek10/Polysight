/** @format */

// components/ThemeToggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<button className="relative h-9 w-9 rounded-lg border border-input bg-transparent p-1.5">
				<div className="h-full w-full animate-pulse rounded bg-muted" />
			</button>
		);
	}

	return (
		<button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className={cn(
				"relative h-9 w-9 rounded-lg border border-input bg-transparent p-1.5",
				"transition-all duration-200 hover:scale-105 hover:border-primary",
				"focus:outline-none focus:ring-2 focus:ring-ring",
			)}
			aria-label="Toggle theme">
			<Sun className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		</button>
	);
}
