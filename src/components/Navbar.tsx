/** @format */

// components/Navbar.tsx (Updated with real wallet data and SignUpModal)
"use client";

import {
	Search,
	Menu,
	X,
	Trophy,
	Gift,
	FileText,
	Info,
	Sun,
	Moon,
	TrendingUp,
	User,
	Wallet,
	Settings,
	Copy,
	Check,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";

// Mock wallet data - Replace with actual wallet connection
const mockWalletData = {
	address: "0x742d35Cc6634C0532925a3bBcBc2388F35b1FAbc",
	portfolioValue: 1254.75,
	cashBalance: 450.25,
	isConnected: false, // Change this based on actual wallet connection
};

export default function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [signInModalOpen, setSignInModalOpen] = useState(false);
	const [signUpModalOpen, setSignUpModalOpen] = useState(false);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [walletCopied, setWalletCopied] = useState(false);
	const [walletData, setWalletData] = useState(mockWalletData);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

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

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	};

	const truncateAddress = (address: string) => {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	const handleCopyWallet = () => {
		navigator.clipboard.writeText(walletData.address);
		setWalletCopied(true);
		setTimeout(() => setWalletCopied(false), 2000);
	};

	const handleSignIn = () => {
		setIsSignedIn(true);
		setSignInModalOpen(false);
		// Here you would typically connect to wallet and update wallet data
		setWalletData({
			...walletData,
			isConnected: true,
		});
	};

	const handleSignUp = () => {
		setIsSignedIn(true);
		setSignUpModalOpen(false);
		// Here you would typically connect to wallet and update wallet data
		setWalletData({
			...walletData,
			isConnected: true,
		});
	};

	const handleSignOut = () => {
		setIsSignedIn(false);
		setWalletData({
			...mockWalletData,
			isConnected: false,
		});
	};

	const handleDeposit = () => {
		// Implement deposit functionality
		console.log("Deposit clicked");
	};

	const navItems = [
		{ name: "Leaderboard", icon: Trophy, href: "/leaderboard" },
		{ name: "Rewards", icon: Gift, href: "/rewards" },
		{ name: "Terms of Use", icon: FileText, href: "/terms" },
		{ name: "About", icon: Info, href: "/about" },
	];

	const profileItems = [
		{ name: "My Profile", icon: User, href: "/profile" },
		{ name: "Settings", icon: Settings, href: "/settings" },
	];

	const ThemeToggle = () => {
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
					{/* Sun/Moon indicators */}
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
								theme === "dark"
									? "text-background"
									: "text-muted-foreground/30",
							)}
						/>
					</div>
				</button>
			</div>
		);
	};

	return (
		<>
			<nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						{/* Logo on Left */}
						<div className="flex items-center">
							<Link
								href="/"
								className="flex items-center gap-3 group relative cursor-pointer">
								<div className="relative overflow-hidden">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-primary/80 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/30">
										<TrendingUp className="h-5 w-5 text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
									</div>
									{/* Glow effect */}
									<div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
									{/* Pulse ring on hover */}
									<div className="absolute inset-0 rounded-lg border-2 border-primary/0 group-hover:border-primary/40 transition-all duration-700 scale-0 group-hover:scale-100" />
								</div>
								<div className="flex flex-col transition-all duration-500 group-hover:translate-x-1">
									<span className="text-xl font-medium tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text transition-all duration-500 group-hover:tracking-wider group-hover:bg-gradient-to-r group-hover:from-primary group-hover:via-primary/90 group-hover:to-primary/80">
										Polysight
									</span>
									<span className="text-[10px] font-normal text-muted-foreground/80 transition-all duration-500 group-hover:opacity-100 group-hover:text-primary/80 group-hover:font-medium mt-0.5">
										Predict • Trade • Win
									</span>
								</div>
							</Link>

							{/* Portfolio Display (Only when signed in) */}
							{isSignedIn && walletData.isConnected && (
								<div className="ml-8 hidden md:flex items-center gap-6">
									<div className="flex flex-col items-start">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium text-muted-foreground">
												Portfolio
											</span>
											<div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
										</div>
										<span className="text-xl font-bold text-foreground">
											{formatCurrency(walletData.portfolioValue)}
										</span>
									</div>
									<div className="h-8 w-px bg-border/50" />
									<div className="flex flex-col items-start">
										<span className="text-sm font-medium text-muted-foreground">
											Cash
										</span>
										<span className="text-xl font-bold text-foreground">
											{formatCurrency(walletData.cashBalance)}
										</span>
									</div>
									<button
										onClick={handleDeposit}
										className="rounded-lg bg-gradient-to-r from-green-500 via-green-500/90 to-green-500/80 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-green-600 hover:to-green-500/90 hover:shadow-xl hover:shadow-green-500/30 hover:translate-y-[-1px] active:translate-y-0 relative overflow-hidden group cursor-pointer">
										<span className="relative z-10 transition-all duration-300 group-hover:scale-105">
											Deposit
										</span>
										<div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]" />
									</button>
								</div>
							)}
						</div>

						{/* Search Bar in Center (Large Screens Only) */}
						<div className="hidden lg:flex flex-1 max-w-md mx-8">
							<div className="relative w-full group">
								<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-all duration-500 group-hover:text-primary group-hover:scale-110 group-hover:-translate-y-[55%]" />
								<input
									type="search"
									placeholder="Search Polysight"
									className="w-full rounded-lg border border-input/50 bg-card py-2.5 pl-11 pr-5 text-sm transition-all duration-500 placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 focus:bg-card/90 hover:border-primary/40 hover:bg-card/90 hover:shadow-md hover:translate-y-[-1px] font-medium cursor-text"
								/>
								{/* Search pulse effect */}
								<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]" />
							</div>
						</div>

						{/* Right Section */}
						<div className="flex items-center gap-3">
							{/* Login & Sign Up Buttons (when not signed in) */}
							{!isSignedIn && (
								<div className="hidden sm:flex items-center gap-4">
									<button
										onClick={() => setSignInModalOpen(true)}
										className="rounded-lg bg-transparent px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:text-foreground hover:shadow-md hover:translate-y-[-1px] active:translate-y-0 cursor-pointer border border-input/30 hover:border-primary/30 group/btn">
										<span className="transition-all duration-300 group-hover/btn:translate-x-0.5">
											Login
										</span>
									</button>
									<button
										onClick={() => setSignUpModalOpen(true)}
										className="rounded-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:from-primary hover:to-primary/90 hover:shadow-xl hover:shadow-primary/40 hover:translate-y-[-2px] active:translate-y-0 active:shadow-md relative overflow-hidden group cursor-pointer">
										<span className="relative z-10 transition-all duration-300 group-hover:scale-105">
											Sign Up
										</span>
										{/* Gradient overlay on hover */}
										<div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]" />
										{/* Sparkle effect */}
										<div className="absolute inset-0 opacity-0 group-hover:opacity-30">
											<div className="absolute top-1 left-1/4 h-1 w-1 bg-white rounded-full animate-ping" />
											<div className="absolute bottom-1 right-1/4 h-1 w-1 bg-white rounded-full animate-ping delay-150" />
										</div>
									</button>
								</div>
							)}

							{/* Connect Wallet Button (when signed in but wallet not connected) */}
							{isSignedIn && !walletData.isConnected && (
								<div className="hidden sm:flex items-center gap-4">
									<button
										onClick={() => {
											// Implement wallet connection
											setWalletData({
												...walletData,
												isConnected: true,
											});
										}}
										className="rounded-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:from-primary hover:to-primary/90 hover:shadow-xl hover:shadow-primary/40 hover:translate-y-[-2px] active:translate-y-0 active:shadow-md relative overflow-hidden group cursor-pointer">
										<span className="relative z-10 transition-all duration-300 group-hover:scale-105">
											Connect Wallet
										</span>
										<div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]" />
									</button>
								</div>
							)}

							{/* Profile & Navigation Dropdown */}
							<div
								className="relative"
								ref={dropdownRef}>
								<button
									onClick={() => setDropdownOpen(!dropdownOpen)}
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-lg border border-input/50 bg-card transition-all duration-500 relative overflow-hidden group hover:shadow-lg hover:border-input cursor-pointer",
										dropdownOpen
											? "bg-gradient-to-br from-accent to-accent/80 text-foreground border-accent shadow-xl"
											: "text-muted-foreground hover:text-foreground hover:bg-gradient-to-br hover:from-accent/50 hover:to-accent/30 hover:scale-105",
										isSignedIn &&
											"bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30",
									)}
									aria-label="Navigation menu">
									{/* Triple dash icon */}
									<div className="flex flex-col gap-1 items-center justify-center">
										<div
											className={cn(
												"h-0.5 w-4 bg-current rounded-full transition-all duration-500",
												dropdownOpen
													? "rotate-45 translate-y-1.5 group-hover:w-5"
													: "group-hover:w-5 group-hover:bg-primary",
												isSignedIn && "bg-primary/80",
											)}
										/>
										<div
											className={cn(
												"h-0.5 w-4 bg-current rounded-full transition-all duration-500",
												dropdownOpen
													? "opacity-0"
													: "group-hover:w-5 group-hover:bg-primary",
												isSignedIn && "bg-primary/80",
											)}
										/>
										<div
											className={cn(
												"h-0.5 w-4 bg-current rounded-full transition-all duration-500",
												dropdownOpen
													? "-rotate-45 -translate-y-1.5 group-hover:w-5"
													: "group-hover:w-5 group-hover:bg-primary",
												isSignedIn && "bg-primary/80",
											)}
										/>
									</div>

									{/* Button hover effect */}
									<div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								</button>

								{/* Dropdown Menu */}
								{dropdownOpen && (
									<div className="absolute right-0 mt-2 w-80 origin-top-right animate-fade-in rounded-lg border border-border/50 bg-card/95 backdrop-blur-sm shadow-2xl">
										<div className="p-4">
											{/* Theme Toggle */}
											<div className="group">
												<ThemeToggle />
											</div>
											<div className="border-t border-border/30 my-3 transition-all duration-300 group-hover:border-primary/30" />

											{/* Wallet Address Section (when signed in and connected) */}
											{isSignedIn && walletData.isConnected && (
												<>
													<div className="mb-4 p-3 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 group/wallet">
														<div className="flex items-center justify-between mb-2">
															<div className="flex items-center gap-2">
																<Wallet className="h-4 w-4 text-primary" />
																<span className="text-sm font-medium text-foreground">
																	Wallet Address
																</span>
															</div>
															<button
																onClick={handleCopyWallet}
																className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer group/copy">
																{walletCopied ? (
																	<>
																		<Check className="h-3 w-3 text-green-500" />
																		<span className="text-green-500">
																			Copied!
																		</span>
																	</>
																) : (
																	<>
																		<Copy className="h-3 w-3 group-hover/copy:scale-110 transition-transform" />
																		Copy
																	</>
																)}
															</button>
														</div>
														<div className="flex items-center justify-between">
															<code className="text-xs font-mono bg-background/50 px-3 py-1.5 rounded border border-border/50">
																{truncateAddress(walletData.address)}
															</code>
															<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
														</div>
														{/* Balance Info */}
														<div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border/30">
															<div className="flex flex-col">
																<span className="text-xs text-muted-foreground">
																	Portfolio
																</span>
																<span className="text-sm font-semibold text-foreground">
																	{formatCurrency(walletData.portfolioValue)}
																</span>
															</div>
															<div className="flex flex-col">
																<span className="text-xs text-muted-foreground">
																	Cash
																</span>
																<span className="text-sm font-semibold text-foreground">
																	{formatCurrency(walletData.cashBalance)}
																</span>
															</div>
														</div>
													</div>

													{/* Profile Section */}
													<div className="mb-4 space-y-2">
														{profileItems.map((item) => (
															<Link
																key={item.name}
																href={item.href || "#"}
																onClick={() => setDropdownOpen(false)}
																className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:pl-4 active:scale-[0.98] group/item cursor-pointer border border-transparent hover:border-input/30">
																<div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent/50 to-accent/30 transition-all duration-500 group-hover/item:from-primary/20 group-hover/item:to-primary/10 group-hover/item:shadow-sm group-hover/item:scale-105">
																	<item.icon className="h-3.5 w-3.5 text-muted-foreground transition-all duration-500 group-hover/item:text-primary group-hover/item:scale-110 group-hover/item:rotate-6" />
																</div>
																<span className="font-medium text-foreground group-hover/item:text-primary group-hover/item:font-semibold">
																	{item.name}
																</span>
															</Link>
														))}
													</div>
													<div className="border-t border-border/30 my-3 transition-all duration-300 group-hover:border-primary/30" />
												</>
											)}

											{/* Navigation Items */}
											<div className="space-y-2">
												{navItems.map((item) => (
													<Link
														key={item.name}
														href={item.href || "#"}
														onClick={() => setDropdownOpen(false)}
														className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-foreground transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:pl-4 active:scale-[0.98] group/item cursor-pointer border border-transparent hover:border-input/30">
														<div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-accent/50 to-accent/30 transition-all duration-500 group-hover/item:from-primary/20 group-hover/item:to-primary/10 group-hover/item:shadow-sm group-hover/item:scale-105">
															<item.icon className="h-4 w-4 text-muted-foreground transition-all duration-500 group-hover/item:text-primary group-hover/item:scale-110 group-hover/item:rotate-6" />
														</div>
														<div className="flex flex-col flex-1 transition-all duration-300 group-hover/item:translate-x-1">
															<span className="font-medium text-foreground group-hover/item:text-primary group-hover/item:font-semibold">
																{item.name}
															</span>
															<span className="text-xs text-muted-foreground/80 mt-0.5 group-hover/item:text-primary/80">
																{item.name === "Leaderboard"
																	? "Top traders & predictions"
																	: item.name === "Rewards"
																	? "Earn points & rewards"
																	: item.name === "Terms of Use"
																	? "Legal & policies"
																	: "About Polysight platform"}
															</span>
														</div>
														<div className="opacity-0 group-hover/item:opacity-100 transition-all duration-500 group-hover/item:translate-x-1">
															<div className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-primary to-primary/80 animate-pulse" />
														</div>
													</Link>
												))}
											</div>

											{/* Sign Out Button (when signed in) */}
											{isSignedIn && (
												<>
													<div className="border-t border-border/30 my-4" />
													<button
														onClick={handleSignOut}
														className="w-full rounded-lg bg-gradient-to-r from-red-500/10 to-red-500/5 px-4 py-2.5 text-sm font-medium text-red-600 transition-all duration-300 hover:from-red-500/20 hover:to-red-500/10 hover:shadow-sm active:scale-95 cursor-pointer border border-red-500/20 hover:border-red-500/30 group/signout">
														<span className="transition-all duration-300 group-hover/signout:translate-x-0.5">
															Sign Out
														</span>
													</button>
												</>
											)}
										</div>
									</div>
								)}
							</div>

							{/* Mobile Menu Button */}
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="flex h-10 w-10 items-center justify-center rounded-lg border border-input/50 bg-card transition-all duration-500 hover:bg-gradient-to-br hover:from-accent/50 hover:to-accent/30 hover:shadow-lg md:hidden group cursor-pointer">
								{mobileMenuOpen ? (
									<X className="h-5 w-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-90" />
								) : (
									<Menu className="h-5 w-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-180" />
								)}
							</button>
						</div>
					</div>

					{/* Mobile Menu */}
					{mobileMenuOpen && (
						<div className="animate-fade-in border-t border-border/50 md:hidden bg-card/95 backdrop-blur-sm">
							<div className="space-y-1 p-4">
								{/* Portfolio Display Mobile (when signed in and connected) */}
								{isSignedIn && walletData.isConnected && (
									<div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
										<div className="grid grid-cols-2 gap-4 mb-4">
											<div className="flex flex-col items-start">
												<span className="text-sm font-medium text-muted-foreground">
													Portfolio
												</span>
												<span className="text-xl font-bold text-foreground">
													{formatCurrency(walletData.portfolioValue)}
												</span>
											</div>
											<div className="flex flex-col items-start">
												<span className="text-sm font-medium text-muted-foreground">
													Cash
												</span>
												<span className="text-xl font-bold text-foreground">
													{formatCurrency(walletData.cashBalance)}
												</span>
											</div>
										</div>
										<button
											onClick={handleDeposit}
											className="w-full rounded-lg bg-gradient-to-r from-green-500 via-green-500/90 to-green-500/80 py-3 text-sm font-medium text-white transition-all duration-300 hover:from-green-600 hover:to-green-500/90 hover:shadow-xl hover:shadow-green-500/30 active:scale-95 cursor-pointer">
											Deposit
										</button>

										{/* Wallet Address Mobile */}
										<div className="mt-4 pt-4 border-t border-border/30">
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-2">
													<Wallet className="h-4 w-4 text-primary" />
													<span className="text-sm font-medium text-foreground">
														Wallet
													</span>
												</div>
												<button
													onClick={handleCopyWallet}
													className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer">
													{walletCopied ? "Copied!" : "Copy"}
												</button>
											</div>
											<code className="text-xs font-mono bg-background/50 px-3 py-2 rounded border border-border/50 w-full block text-center">
												{truncateAddress(walletData.address)}
											</code>
										</div>
									</div>
								)}

								{/* Connect Wallet Mobile (when signed in but not connected) */}
								{isSignedIn && !walletData.isConnected && (
									<div className="mb-6">
										<button
											onClick={() => {
												setWalletData({
													...walletData,
													isConnected: true,
												});
											}}
											className="w-full rounded-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:from-primary hover:to-primary/90 hover:shadow-xl hover:shadow-primary/40 active:scale-95 cursor-pointer">
											Connect Wallet
										</button>
									</div>
								)}

								{/* Mobile Search */}
								<div className="mb-4">
									<div className="relative group">
										<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-all duration-500 group-hover:text-primary group-hover:scale-110" />
										<input
											type="search"
											placeholder="Search Polysight"
											className="w-full rounded-lg border border-input bg-card py-3 pl-11 pr-5 text-sm transition-all duration-500 placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 hover:border-primary/40 hover:bg-card/90 font-medium cursor-text"
										/>
									</div>
								</div>

								{/* Theme Toggle Mobile */}
								{mounted && (
									<div className="mb-4 p-4 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg border border-border/30 group">
										<ThemeToggle />
									</div>
								)}

								{/* Mobile Login/Signup (when not signed in) */}
								{!isSignedIn && (
									<div className="grid grid-cols-2 gap-3 mb-6">
										<button
											onClick={() => {
												setMobileMenuOpen(false);
												setSignInModalOpen(true);
											}}
											className="rounded-lg bg-transparent py-3 text-sm font-medium text-foreground transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:shadow-sm active:scale-95 border border-input/30 hover:border-primary/30 cursor-pointer group/btn">
											<span className="transition-all duration-300 group-hover/btn:translate-x-0.5">
												Login
											</span>
										</button>
										<button
											onClick={() => {
												setMobileMenuOpen(false);
												setSignUpModalOpen(true);
											}}
											className="rounded-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:from-primary hover:to-primary/90 hover:shadow-xl hover:shadow-primary/40 active:scale-95 relative overflow-hidden group cursor-pointer">
											<span className="relative z-10 transition-all duration-300 group-hover:scale-105">
												Sign Up Free
											</span>
											<div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]" />
										</button>
									</div>
								)}

								{/* Profile Items Mobile (when signed in) */}
								{isSignedIn && (
									<div className="mb-4 space-y-2">
										{profileItems.map((item) => (
											<Link
												key={item.name}
												href={item.href || "#"}
												onClick={() => setMobileMenuOpen(false)}
												className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 active:scale-95 cursor-pointer border border-transparent hover:border-input/30">
												<div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-accent/50 to-accent/30 transition-all duration-500 hover:from-primary/20 hover:to-primary/10 hover:scale-105">
													<item.icon className="h-5 w-5 text-muted-foreground transition-all duration-500 hover:text-primary hover:scale-110 hover:rotate-6" />
												</div>
												<span className="hover:text-primary hover:font-semibold">
													{item.name}
												</span>
											</Link>
										))}
									</div>
								)}

								{/* Mobile Navigation Items */}
								<div className="space-y-2">
									{navItems.map((item) => (
										<div
											key={item.name}
											className="px-1">
											<Link
												href={item.href || "#"}
												onClick={() => setMobileMenuOpen(false)}
												className="flex items-center gap-3 rounded-md px-4 py-3.5 text-base font-medium text-foreground transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 active:scale-95 group/item cursor-pointer border border-transparent hover:border-input/30">
												<div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-accent/50 to-accent/30 transition-all duration-500 group-hover/item:from-primary/20 group-hover/item:to-primary/10 group-hover/item:scale-105">
													<item.icon className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover/item:text-primary group-hover/item:scale-110 group-hover/item:rotate-6" />
												</div>
												<div className="flex flex-col flex-1 transition-all duration-300 group-hover/item:translate-x-1">
													<span className="group-hover/item:text-primary group-hover/item:font-semibold">
														{item.name}
													</span>
													<span className="text-xs font-normal text-muted-foreground/80 mt-0.5 group-hover/item:text-primary/80">
														{item.name === "Leaderboard"
															? "Top traders & predictions"
															: item.name === "Rewards"
															? "Earn points & rewards"
															: item.name === "Terms of Use"
															? "Legal & policies"
															: "About Polysight platform"}
													</span>
												</div>
											</Link>
										</div>
									))}
								</div>

								{/* Sign Out Mobile (when signed in) */}
								{isSignedIn && (
									<div className="mt-6 pt-4 border-t border-border/30">
										<button
											onClick={handleSignOut}
											className="w-full rounded-lg bg-gradient-to-r from-red-500/10 to-red-500/5 py-3 text-sm font-medium text-red-600 transition-all duration-300 hover:from-red-500/20 hover:to-red-500/10 hover:shadow-sm active:scale-95 cursor-pointer border border-red-500/20 hover:border-red-500/30">
											Sign Out
										</button>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</nav>

			{/* Sign In Modal */}
			<SignInModal
				isOpen={signInModalOpen}
				onClose={() => setSignInModalOpen(false)}
				onSignIn={handleSignIn}
			/>

			{/* Sign Up Modal */}
			<SignUpModal
				isOpen={signUpModalOpen}
				onClose={() => setSignUpModalOpen(false)}
				onSignUp={handleSignUp}
			/>
		</>
	);
}
