/** @format */

// components/wallet/SolanaWalletConnectButton.tsx
"use client";

import {
	Wallet,
	ChevronDown,
	Copy,
	LogOut,
	Check,
	ExternalLink,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PublicKey } from "@solana/web3.js";

interface SolanaWalletConnectButtonProps {
	variant?: "default" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
	showBalance?: boolean;
	showDisconnect?: boolean;
	className?: string;
}

interface SolanaWalletConnectedDisplayProps {
	compact?: boolean;
	onDisconnect?: () => void;
}

export function SolanaWalletConnectedDisplay({
	compact = false,
	onDisconnect,
}: SolanaWalletConnectedDisplayProps) {
	const { publicKey, disconnect } = useWallet();
	const [copied, setCopied] = useState(false);
	const [balance, setBalance] = useState<number | null>(null);

	const truncateAddress = (address: string, length: number = 4) => {
		if (address.length <= length * 2 + 2) return address;
		return `${address.slice(0, length)}...${address.slice(-length)}`;
	};

	const copyAddress = async () => {
		if (!publicKey) return;
		await navigator.clipboard.writeText(publicKey.toString());
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const openExplorer = () => {
		if (!publicKey) return;
		window.open(
			`https://explorer.solana.com/address/${publicKey.toString()}`,
			"_blank",
			"noopener,noreferrer",
		);
	};

	const handleDisconnect = async () => {
		try {
			await disconnect();
			onDisconnect?.();
		} catch (error) {
			console.error("Failed to disconnect wallet:", error);
		}
	};

	if (!publicKey) return null;

	if (compact) {
		return (
			<div className="flex items-center gap-2 rounded-lg bg-accent/30 px-3 py-2">
				<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
				<div className="text-xs font-medium">
					{truncateAddress(publicKey.toString())}
				</div>
			</div>
		);
	}

	return (
		<div className="w-full space-y-4">
			<div className="rounded-xl border border-border bg-card p-4 shadow-sm">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
							<Wallet className="h-5 w-5 text-primary" />
						</div>
						<div>
							<h3 className="text-sm font-semibold text-card-foreground">
								Wallet Connected
							</h3>
							<p className="text-xs text-muted-foreground">
								Ready to trade on Solana
							</p>
						</div>
					</div>
					<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
				</div>

				{/* Address */}
				<div className="mt-4 space-y-2">
					<label className="text-xs font-medium text-muted-foreground">
						Wallet Address
					</label>
					<div className="flex items-center justify-between rounded-lg bg-accent/30 px-3 py-2">
						<code className="text-sm font-mono text-card-foreground">
							{truncateAddress(publicKey.toString(), 8)}
						</code>
						<div className="flex items-center gap-1">
							<button
								onClick={copyAddress}
								className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-accent hover:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
								aria-label="Copy wallet address">
								{copied ? (
									<Check className="h-3.5 w-3.5 text-green-500" />
								) : (
									<Copy className="h-3.5 w-3.5" />
								)}
							</button>
							<button
								onClick={openExplorer}
								className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-accent hover:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
								aria-label="View on explorer">
								<ExternalLink className="h-3.5 w-3.5" />
							</button>
						</div>
					</div>
				</div>

				{/* Balance (if available) */}
				{balance !== null && (
					<div className="mt-4 space-y-2">
						<label className="text-xs font-medium text-muted-foreground">
							Balance
						</label>
						<div className="rounded-lg bg-accent/30 px-3 py-2">
							<div className="text-sm font-semibold text-card-foreground">
								{balance.toFixed(4)} SOL
							</div>
						</div>
					</div>
				)}

				{/* Disconnect Button */}
				<button
					onClick={handleDisconnect}
					className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive/50">
					<LogOut className="h-3.5 w-3.5" />
					Disconnect Wallet
				</button>
			</div>
		</div>
	);
}

export function SolanaWalletConnectButton({
	variant = "default",
	size = "md",
	fullWidth = false,
	showBalance = true,
	showDisconnect = true,
	className,
}: SolanaWalletConnectButtonProps) {
	const { connected, publicKey, disconnect, connect, wallet, connecting } =
		useWallet();
	const { setVisible } = useWalletModal();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const getVariantStyles = () => {
		switch (variant) {
			case "outline":
				return "border border-input bg-transparent text-card-foreground hover:bg-accent hover:text-card-foreground";
			case "ghost":
				return "bg-transparent text-card-foreground hover:bg-accent";
			default:
				return "bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5";
		}
	};

	const getSizeStyles = () => {
		switch (size) {
			case "sm":
				return "px-3 py-1.5 text-sm";
			case "lg":
				return "px-6 py-3.5 text-base";
			default:
				return "px-4 py-2.5 text-sm";
		}
	};

	const truncateAddress = (address: string, length: number = 4) => {
		if (address.length <= length * 2 + 2) return address;
		return `${address.slice(0, length)}...${address.slice(-length)}`;
	};

	const handleConnectClick = () => {
		if (connected) {
			setIsDropdownOpen(!isDropdownOpen);
		} else {
			setVisible(true);
		}
	};

	const handleDisconnect = async () => {
		try {
			await disconnect();
			setIsDropdownOpen(false);
		} catch (error) {
			console.error("Failed to disconnect wallet:", error);
		}
	};

	const copyAddress = async () => {
		if (!publicKey) return;
		await navigator.clipboard.writeText(publicKey.toString());
		setIsDropdownOpen(false);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = () => {
			if (isDropdownOpen) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [isDropdownOpen]);

	if (connected && publicKey) {
		return (
			<div className={cn("relative", fullWidth && "w-full", className)}>
				<button
					onClick={handleConnectClick}
					className={cn(
						"inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50",
						getSizeStyles(),
						fullWidth && "w-full",
						"border border-input bg-accent/30 text-card-foreground hover:bg-accent",
						className,
					)}
					aria-label="Connected wallet menu">
					<Wallet className="h-4 w-4" />
					<span className="font-mono">
						{truncateAddress(publicKey.toString())}
					</span>
					<ChevronDown
						className={cn(
							"h-4 w-4 transition-transform",
							isDropdownOpen && "rotate-180",
						)}
					/>
				</button>

				{/* Dropdown Menu */}
				{isDropdownOpen && (
					<div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-border bg-card p-2 shadow-lg animate-scale-in z-50">
						<div className="space-y-2">
							{/* Wallet Info */}
							<div className="rounded-lg bg-accent/30 p-3">
								<div className="flex items-center gap-3">
									<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
									<div>
										<p className="text-xs font-medium text-muted-foreground">
											Connected
										</p>
										<p className="text-sm font-semibold text-card-foreground">
											{truncateAddress(publicKey.toString(), 8)}
										</p>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="space-y-1">
								<button
									onClick={copyAddress}
									className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-card-foreground transition-all hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50">
									<Copy className="h-4 w-4" />
									Copy Address
								</button>
								<a
									href={`https://explorer.solana.com/address/${publicKey.toString()}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-card-foreground transition-all hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50">
									<ExternalLink className="h-4 w-4" />
									View on Explorer
								</a>
								{showDisconnect && (
									<button
										onClick={handleDisconnect}
										className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-all hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-destructive/50">
										<LogOut className="h-4 w-4" />
										Disconnect
									</button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<button
			onClick={handleConnectClick}
			disabled={connecting}
			className={cn(
				"inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50",
				getVariantStyles(),
				getSizeStyles(),
				fullWidth && "w-full",
				connecting && "opacity-50 cursor-not-allowed",
				className,
			)}
			aria-label="Connect Solana wallet">
			{connecting ? (
				<>
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
					Connecting...
				</>
			) : (
				<>
					<Wallet className="h-4 w-4" />
					Connect Solana Wallet
				</>
			)}
		</button>
	);
}

// Export default for backward compatibility
export default function SolanaWalletConnectButtonWrapper(
	props: SolanaWalletConnectButtonProps,
) {
	return <SolanaWalletConnectButton {...props} />;
}
