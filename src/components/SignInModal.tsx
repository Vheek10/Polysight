/** @format */

// components/SignInModal.tsx
"use client";

import { X, Mail, Loader2, Wallet, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

interface SignInModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSignIn: () => void;
}

export default function SignInModal({
	isOpen,
	onClose,
	onSignIn,
}: SignInModalProps) {
	const [view, setView] = useState<"welcome" | "wallet">("welcome");
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [emailError, setEmailError] = useState<string | null>(null);

	const { connected, publicKey, disconnect, connecting } = useWallet();
	const { setVisible } = useWalletModal();

	if (!isOpen) return null;

	// Secure validation function
	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setIsLoading(false);
			onSignIn();
			onClose();
		} catch (error) {
			console.error("Google sign in error:", error);
			setIsLoading(false);
		}
	};

	const handleEmailSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setEmailError(null);

		if (!validateEmail(email)) {
			setEmailError("Please enter a valid email address");
			return;
		}

		try {
			setIsLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setIsLoading(false);
			onSignIn();
			onClose();
		} catch (error) {
			console.error("Email authentication error:", error);
			setIsLoading(false);
			setEmailError("Failed to send magic link. Please try again.");
		}
	};

	const handleWalletSignIn = () => {
		if (connected) {
			onSignIn();
			onClose();
		}
	};

	const truncateAddress = (address: string, length: number = 4) => {
		if (address.length <= length * 2 + 2) return address;
		return `${address.slice(0, length)}...${address.slice(-length)}`;
	};

	const renderWalletConnectButton = () => {
		if (connected && publicKey) {
			return (
				<div className="space-y-3">
					<div className="rounded-lg border border-green-200 bg-green-50 p-4">
						<div className="flex items-center gap-3">
							<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
							<div>
								<p className="text-sm font-medium text-green-900">
									Wallet Connected
								</p>
								<p className="text-xs text-green-700">
									{truncateAddress(publicKey.toString())}
								</p>
							</div>
						</div>
						<button
							onClick={handleWalletSignIn}
							className="mt-3 w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
							Continue to Polysight
						</button>
					</div>

					{/* Disconnect Button */}
					<button
						onClick={async () => {
							try {
								await disconnect();
							} catch (error) {
								console.error("Failed to disconnect:", error);
							}
						}}
						className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
						aria-label="Disconnect wallet">
						<LogOut className="h-4 w-4" />
						Disconnect Wallet
					</button>
				</div>
			);
		}

		return (
			<button
				onClick={() => setView("wallet")}
				className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-transparent px-4 py-2.5 text-sm font-medium text-card-foreground transition-all hover:bg-accent hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
				aria-label="Connect Solana wallet">
				<Wallet className="h-4 w-4" />
				Continue with Wallet
			</button>
		);
	};

	const renderWalletConnectingAnimation = () => {
		return (
			<div className="relative">
				{/* Background container with subtle pulse */}
				<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse" />

				{/* Main container */}
				<div className="relative rounded-xl border border-primary/20 bg-card/50 p-6 backdrop-blur-sm">
					<div className="flex flex-col items-center justify-center space-y-4">
						{/* Wallet icon with multiple animations */}
						<div className="relative">
							{/* Outer ring - spinning */}
							<div className="absolute -inset-3 rounded-full">
								<div className="absolute inset-0 rounded-full border-2 border-primary/20" />
								<div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
							</div>

							{/* Middle ring - pulsing */}
							<div className="absolute -inset-2 rounded-full bg-primary/10 animate-ping" />

							{/* Wallet icon */}
							<div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
								<Wallet className="h-6 w-6 text-primary" />
							</div>
						</div>

						{/* Text content */}
						<div className="text-center">
							<h3 className="text-lg font-semibold text-card-foreground">
								Awaiting Wallet Connection
							</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								Please confirm the connection in your wallet
							</p>
						</div>

						{/* Loading indicators */}
						<div className="flex items-center gap-1">
							<div
								className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
								style={{ animationDelay: "0ms" }}
							/>
							<div
								className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
								style={{ animationDelay: "150ms" }}
							/>
							<div
								className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
								style={{ animationDelay: "300ms" }}
							/>
						</div>
					</div>
				</div>

				{/* Cancel button */}
				<button
					onClick={() => setVisible(false)}
					className="mt-4 w-full rounded-lg border border-input bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
					aria-label="Cancel wallet connection">
					Cancel
				</button>
			</div>
		);
	};

	const renderWalletConnectView = () => {
		if (connecting) {
			return renderWalletConnectingAnimation();
		}

		return (
			<>
				<button
					onClick={() => setVisible(true)}
					disabled={connecting}
					className="group relative flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-4 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
					aria-label="Connect Solana wallet">
					<Wallet className="h-5 w-5" />
					Continue with Wallet
				</button>
			

				{/* Already have wallet connected? */}
				{connected && (
					<div className="space-y-3">
						<div className="rounded-lg border border-green-200 bg-green-50 p-4">
							<div className="flex items-center gap-3">
								<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
								<div>
									<p className="text-sm font-medium text-green-900">
										Wallet Connected
									</p>
									<p className="text-xs text-green-700">
										{truncateAddress(publicKey?.toString() || "", 8)}
									</p>
								</div>
							</div>
							<button
								onClick={handleWalletSignIn}
								className="mt-3 w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
								Continue to Polysight
							</button>
						</div>
					</div>
				)}
			</>
		);
	};

	return (
		<div className="fixed inset-0 z-[100] overflow-y-auto">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Modal Container */}
			<div className="flex min-h-full items-center justify-center p-4">
				<div
					className={cn(
						"relative w-full max-w-md transform overflow-hidden rounded-xl border bg-card shadow-2xl transition-all duration-300",
						"animate-scale-in",
					)}>
					{/* Close Button */}
					<button
						onClick={onClose}
						className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/50 text-muted-foreground transition-all hover:bg-accent hover:text-foreground hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
						aria-label="Close sign in modal">
						<X className="h-4 w-4" />
					</button>

					{/* Modal Content */}
					<div className="p-6 sm:p-8">
						{/* Welcome View */}
						{view === "welcome" && (
							<div className="space-y-6">
								{/* Header */}
								<div className="text-center">
									<h1 className="text-2xl font-bold tracking-tight text-card-foreground">
										Welcome to Polysight
									</h1>
									<p className="mt-2 text-sm text-muted-foreground">
										Sign in to access prediction markets and start trading on
										Solana
									</p>
								</div>

								{/* Action Buttons */}
								<div className="space-y-4">
									{/* Google Button - CHANGED TEXT */}
									<button
										onClick={handleGoogleSignIn}
										disabled={isLoading}
										className="group relative flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-white to-white/90 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
										aria-label="Continue with Google">
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<>
												<svg
													className="h-4 w-4"
													viewBox="0 0 24 24"
													aria-hidden="true">
													<path
														fill="currentColor"
														d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
													/>
													<path
														fill="currentColor"
														d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
													/>
													<path
														fill="currentColor"
														d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
													/>
													<path
														fill="currentColor"
														d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
													/>
												</svg>
												{/* CHANGED TEXT */}
												<span>Continue with Google</span>
											</>
										)}
									</button>

									{/* OR Divider */}
									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<div className="w-full border-t border-border" />
										</div>
										<div className="relative flex justify-center text-xs">
											<span className="bg-card px-2 text-muted-foreground">
												OR
											</span>
										</div>
									</div>

									{/* Email Input - CHANGED BUTTON TEXT */}
									<form
										onSubmit={handleEmailSubmit}
										className="space-y-2">
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
											<input
												type="email"
												value={email}
												onChange={(e) => {
													setEmail(e.target.value);
													setEmailError(null);
												}}
												placeholder="Email address"
												className="w-full rounded-lg border border-input bg-transparent py-3 pl-10 pr-28 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
												required
												aria-label="Email address"
												aria-invalid={emailError ? "true" : "false"}
												aria-describedby={
													emailError ? "email-error" : undefined
												}
												disabled={isLoading}
											/>
											<button
												type="submit"
												disabled={isLoading || !email.trim()}
												className="absolute right-2 top-1/2 flex h-7 w-20 -translate-y-1/2 items-center justify-center rounded-lg bg-primary text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
												aria-label="Continue with email">
												{isLoading ? (
													<Loader2 className="h-3 w-3 animate-spin" />
												) : (
													// CHANGED TEXT
													<span>Continue</span>
												)}
											</button>
										</div>
										{emailError && (
											<p
												id="email-error"
												className="text-xs text-destructive"
												role="alert">
												{emailError}
											</p>
										)}
									</form>

									{/* OR Divider */}
									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<div className="w-full border-t border-border" />
										</div>
										<div className="relative flex justify-center text-xs">
											<span className="bg-card px-2 text-muted-foreground">
												OR
											</span>
										</div>
									</div>

									{/* Connect Wallet Button - CHANGED TEXT */}
									{renderWalletConnectButton()}
								</div>

								{/* Terms */}
								<p className="text-center text-xs text-muted-foreground">
									By continuing, you agree to our{" "}
									<a
										href="/terms"
										className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
										target="_blank"
										rel="noopener noreferrer">
										Terms
									</a>{" "}
									and{" "}
									<a
										href="/privacy"
										className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
										target="_blank"
										rel="noopener noreferrer">
										Privacy Policy
									</a>
								</p>
							</div>
						)}

						{/* Wallet Connect View */}
						{view === "wallet" && (
							<div className="space-y-6">
								{/* Header */}
								<div className="text-center">
									<button
										onClick={() => setView("welcome")}
										className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
										aria-label="Back to sign in options">
										← Back
									</button>
									<h2 className="text-2xl font-bold tracking-tight text-card-foreground">
										Connect Solana Wallet
									</h2>
									<p className="mt-2 text-sm text-muted-foreground">
										Connect your Solana wallet to access Polysight
									</p>
								</div>

								{/* Wallet Options */}
								<div className="space-y-3">{renderWalletConnectView()}</div>

								{/* Switch to other methods */}
								{!connecting && (
									<p className="text-center text-sm text-muted-foreground">
										Prefer email or Google sign in?{" "}
										<button
											onClick={() => setView("welcome")}
											className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">
											Back to all options
										</button>
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
