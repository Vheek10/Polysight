/** @format */

// components/navbar/ThemeToggle.tsx
"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	return (
		<div className="flex items-center justify-between w-full px-2 py-4 group">
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-accent/60 to-accent/40 transition-all duration-300 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:shadow-sm">
					{theme === "dark" ? (
						<Moon className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-primary" />
					) : (
						<Sun className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-primary" />
					)}
				</div>
				<div className="flex flex-col">
					<span className="text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-primary">
						Theme
					</span>
					<span className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-primary/80">
						{theme === "dark" ? "Dark" : "Light"} mode
					</span>
				</div>
			</div>
			<button
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				className={cn(
					"relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer",
					theme === "dark"
						? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
						: "bg-gradient-to-r from-muted to-muted/80 hover:from-muted/90 hover:to-muted/70",
				)}
				aria-label="Toggle theme">
				<span
					className={cn(
						"inline-block h-5 w-5 transform rounded-full bg-background shadow-lg transition-all duration-300 hover:shadow-xl",
						theme === "dark" ? "translate-x-8" : "translate-x-1",
					)}
				/>
				<div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
					<Sun
						className={cn(
							"h-3 w-3 transition-all duration-300",
							theme === "light"
								? "text-background"
								: "text-muted-foreground/30",
						)}
					/>
					<Moon
						className={cn(
							"h-3 w-3 transition-all duration-300",
							theme === "dark" ? "text-background" : "text-muted-foreground/30",
						)}
					/>
				</div>
			</button>
		</div>
	);
}
