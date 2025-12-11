/** @format */

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
	Trophy,
	Gift,
	FileText,
	Info,
	User,
	Settings,
	LogOut,
	Copy,
	Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useWallet } from "@solana/wallet-adapter-react";

interface NavDropdownProps {
	isSignedIn: boolean;
	onSignOut: () => void;
	onCopyWallet: () => void;
	walletCopied: boolean;
}

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

function NavDropdown({
	isSignedIn,
	onSignOut,
	onCopyWallet,
	walletCopied,
}: NavDropdownProps) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { connected, publicKey, disconnect } = useWallet();

	const truncateAddress = (address: string): string => {
		if (!address) return "";
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

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

	const handleLogOut = async () => {
		try {
			// Disconnect wallet if connected
			if (connected && disconnect) {
				try {
					await disconnect();
					console.log("Wallet disconnected successfully");
				} catch (walletError) {
					console.error("Error disconnecting wallet:", walletError);
				}
			}

			// Clear all localStorage/sessionStorage data
			localStorage.removeItem("polysight_isSignedIn");
			localStorage.removeItem("polysight_authToken");
			localStorage.removeItem("polysight_walletConnected");
			localStorage.removeItem("polysight_googleAuth");
			localStorage.removeItem("polysight_emailAuth");
			sessionStorage.removeItem("polysight_auth");

			// Call the parent onSignOut callback
			onSignOut();

			// Close the dropdown
			setDropdownOpen(false);

			// Force a page refresh to reset all states
			setTimeout(() => {
				window.location.reload();
			}, 100);
		} catch (error) {
			console.error("Error during logout:", error);
			// Still try to clear local data
			localStorage.removeItem("polysight_isSignedIn");
			onSignOut();
			setDropdownOpen(false);
			window.location.reload();
		}
	};

	return (
		<div
			className="relative"
			ref={dropdownRef}>
			{/* Button - Always use 3 dash icon for consistent styling */}
			<button
				onClick={() => setDropdownOpen(!dropdownOpen)}
				className={cn(
					"flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer",
					"active:scale-95 border-input/50 bg-card hover:bg-accent/50 hover:border-input",
					dropdownOpen && "bg-accent/50",
				)}>
				{/* Always show 3 dash hamburger icon for consistency */}
				<div className="flex flex-col gap-1">
					<div
						className={cn(
							"h-0.5 w-4 bg-current rounded-full transition-all duration-300",
							dropdownOpen && "rotate-45 translate-y-1.5",
						)}
					/>
					<div
						className={cn(
							"h-0.5 w-4 bg-current rounded-full transition-all duration-300",
							dropdownOpen && "opacity-0",
						)}
					/>
					<div
						className={cn(
							"h-0.5 w-4 bg-current rounded-full transition-all duration-300",
							dropdownOpen && "-rotate-45 -translate-y-1.5",
						)}
					/>
				</div>
			</button>

			{dropdownOpen && (
				<div className="absolute right-0 mt-2 w-80 animate-fade-in rounded-lg border border-border bg-card shadow-xl z-50 overflow-hidden">
					<div className="p-4">
						{/* Theme Toggle - ALWAYS AT THE TOP */}
						<div className="mb-4">
							<div className="flex items-center justify-between">
								<ThemeToggle />
							</div>
						</div>

						{/* Separator after theme toggle */}
						<div className="h-px w-full bg-border my-4" />

						{/* Wallet Address Section - Only show when signed in and connected */}
						{isSignedIn && connected && publicKey && (
							<>
								<div className="mb-4">
									{/* Address Display */}
									<div className="flex items-center justify-between px-3 py-3 bg-accent/10 rounded-lg mb-3">
										<div className="flex items-center gap-3">
											<div className="relative">
												<div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
												<div className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
											</div>
											<div className="font-mono text-base font-bold">
												{truncateAddress(publicKey.toString())}
											</div>
										</div>
										<button
											onClick={onCopyWallet}
											className="p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
											title={walletCopied ? "Copied!" : "Copy address"}>
											{walletCopied ? (
												<Check className="h-5 w-5 text-green-500" />
											) : (
												<Copy className="h-5 w-5 text-muted-foreground hover:text-foreground" />
											)}
										</button>
									</div>

									{/* Profile Links */}
									<div className="space-y-2 mb-4">
										{profileItems.map((item) => (
											<Link
												key={item.name}
												href={item.href || "#"}
												onClick={() => setDropdownOpen(false)}
												className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent/30 transition-colors cursor-pointer">
												<item.icon className="h-4 w-4" />
												<span className="font-medium">{item.name}</span>
											</Link>
										))}
									</div>

									{/* Separator after profile */}
									<div className="h-px w-full bg-border mb-4" />
								</div>
							</>
						)}

						{/* Navigation Items - Show always */}
						<div className="space-y-2">
							{navItems.map((item) => (
								<Link
									key={item.name}
									href={item.href || "#"}
									onClick={() => setDropdownOpen(false)}
									className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent/30 transition-colors cursor-pointer">
									<item.icon className="h-4 w-4" />
									<div className="flex-1">
										<span className="font-medium">{item.name}</span>
									</div>
								</Link>
							))}
						</div>

						{/* Log Out Button - Only show when signed in */}
						{isSignedIn && (
							<>
								{/* Separator before logout */}
								<div className="h-px w-full bg-border my-4" />
								<button
									onClick={handleLogOut}
									className="flex items-center justify-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 cursor-pointer">
									<LogOut className="h-4 w-4" />
									Log Out
								</button>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default NavDropdown;
