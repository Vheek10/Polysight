/** @format */

// components/Navbar.tsx
"use client";

import {
	Search,
	Menu,
	X,
	Sun,
	Moon,
	Trophy,
	Gift,
	FileText,
	Info,
	ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { theme, setTheme } = useTheme();

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const navItems = [
		{
			name: "Dark Mode",
			icon: theme === "dark" ? Sun : Moon,
			action: () => setTheme(theme === "dark" ? "light" : "dark"),
		},
		{ name: "Leaderboard", icon: Trophy, href: "/leaderboard" },
		{ name: "Rewards", icon: Gift, href: "/rewards" },
		{ name: "Terms of Use", icon: FileText, href: "/terms" },
		{ name: "About", icon: Info, href: "/about" },
	];

	return (
		<nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo on Left */}
					<div className="flex items-center">
						<Link
							href="/"
							className="flex items-center gap-2 group">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 group-hover:scale-105 transition-transform">
								<div className="h-5 w-5 bg-white rounded-sm rotate-45" />
							</div>
							<span className="text-xl font-bold tracking-tight text-foreground">
								Polysight
							</span>
						</Link>
					</div>

					{/* Search Bar in Center (Large Screens Only) */}
					<div className="hidden lg:flex flex-1 max-w-2xl mx-8">
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<input
								type="search"
								placeholder="Search markets, topics, or events..."
								className="w-full rounded-full border border-input bg-transparent py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
							/>
						</div>
					</div>

					{/* Right Section */}
					<div className="flex items-center gap-3">
						{/* Login & Sign Up Buttons */}
						<div className="hidden sm:flex items-center gap-2">
							<button className="rounded-full border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
								Login
							</button>
							<button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
								Sign Up
							</button>
						</div>

						{/* Mobile Login/Signup */}
						<div className="sm:hidden flex items-center gap-2">
							<button className="rounded-full border border-input p-2 text-foreground hover:bg-accent transition-colors">
								<span className="sr-only">Login</span>
								<span className="text-xs">Log in</span>
							</button>
						</div>

						{/* Navigation Dropdown */}
						<div
							className="relative"
							ref={dropdownRef}>
							<button
								onClick={() => setDropdownOpen(!dropdownOpen)}
								className={cn(
									"flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-transparent transition-colors",
									dropdownOpen
										? "bg-accent text-foreground"
										: "text-muted-foreground hover:text-foreground hover:bg-accent",
								)}
								aria-label="Navigation menu">
								{dropdownOpen ? (
									<X className="h-5 w-5" />
								) : (
									<ChevronDown className="h-5 w-5" />
								)}
							</button>

							{/* Dropdown Menu */}
							{dropdownOpen && (
								<div className="absolute right-0 mt-2 w-56 origin-top-right animate-fade-in rounded-lg border bg-popover shadow-lg">
									<div className="p-2">
										{navItems.map((item) => (
											<div key={item.name}>
												{item.action ? (
													<button
														onClick={() => {
															item.action();
															setDropdownOpen(false);
														}}
														className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors">
														<item.icon className="h-4 w-4" />
														<span>{item.name}</span>
													</button>
												) : (
													<Link
														href={item.href || "#"}
														onClick={() => setDropdownOpen(false)}
														className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors">
														<item.icon className="h-4 w-4" />
														<span>{item.name}</span>
													</Link>
												)}
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-transparent md:hidden">
							{mobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="animate-fade-in border-t md:hidden">
						<div className="space-y-1 px-2 pb-3 pt-2">
							{/* Mobile Search */}
							<div className="mb-4 px-3">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<input
										type="search"
										placeholder="Search..."
										className="w-full rounded-full border border-input bg-transparent py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
									/>
								</div>
							</div>

							{/* Mobile Sign Up Button */}
							<div className="px-3 mb-2">
								<button className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
									Sign Up Free
								</button>
							</div>

							{/* Mobile Navigation Items */}
							{navItems.map((item) => (
								<div
									key={item.name}
									className="px-1">
									{item.action ? (
										<button
											onClick={() => {
												item.action();
												setMobileMenuOpen(false);
											}}
											className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
											<item.icon className="h-5 w-5" />
											<span>{item.name}</span>
										</button>
									) : (
										<Link
											href={item.href || "#"}
											onClick={() => setMobileMenuOpen(false)}
											className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
											<item.icon className="h-5 w-5" />
											<span>{item.name}</span>
										</Link>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
