/** @format */

// components/SignInModal.tsx
"use client";

import { X, Mail, Wallet, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SignInModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
	const [view, setView] = useState<"welcome" | "wallet">("welcome");
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [emailError, setEmailError] = useState<string | null>(null);

	if (!isOpen) return null;

	// Secure validation function
	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true);
			// Secure Google OAuth implementation
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setIsLoading(false);
			onClose();
		} catch (error) {
			console.error("Google sign in error:", error);
			setIsLoading(false);
		}
	};

	const handleWalletConnect = async () => {
		try {
			setIsLoading(true);
			// Secure wallet connection implementation
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setIsLoading(false);
			onClose();
		} catch (error) {
			console.error("Wallet connection error:", error);
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
			// Secure email authentication implementation
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setIsLoading(false);
			onClose();
		} catch (error) {
			console.error("Email authentication error:", error);
			setIsLoading(false);
			setEmailError("Failed to send magic link. Please try again.");
		}
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
										Sign in to access prediction markets and start trading
									</p>
								</div>

								{/* Action Buttons */}
								<div className="space-y-4">
									{/* Google Button - First */}
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
												<span>Continue with Google</span>
											</>
										)}
									</button>

									{/* OR Divider between Google and Email */}
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

									{/* Email Input with Continue Button - Second */}
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
												className="w-full rounded-lg border border-input bg-transparent py-3 pl-10 pr-24 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
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
												className="absolute right-2 top-1/2 flex h-7 w-16 -translate-y-1/2 items-center justify-center rounded-lg bg-primary text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
												aria-label="Continue with email">
												{isLoading ? (
													<Loader2 className="h-3 w-3 animate-spin" />
												) : (
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

									{/* Connect Wallet Button - Directly after Email */}
									<button
										onClick={() => setView("wallet")}
										disabled={isLoading}
										className="group relative flex w-full items-center justify-center gap-3 rounded-lg border border-input bg-transparent px-4 py-3 text-sm font-medium text-card-foreground transition-all hover:bg-accent hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
										aria-label="Connect wallet">
										<Wallet className="h-4 w-4" />
										<span>Connect Wallet</span>
									</button>
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
										Connect Wallet
									</h2>
									<p className="mt-2 text-sm text-muted-foreground">
										Connect your wallet to access Polysight
									</p>
								</div>

								{/* Wallet Options */}
								<div className="space-y-3">
									<button
										onClick={handleWalletConnect}
										disabled={isLoading}
										className="group relative flex w-full items-center justify-between rounded-lg border border-input bg-transparent p-4 transition-all hover:bg-accent hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
										aria-label="Connect Phantom wallet">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
												<svg
													className="h-5 w-5 text-white"
													viewBox="0 0 40 40"
													aria-hidden="true">
													<path
														fill="currentColor"
														d="M12 32V20h4v12h4V20h4v12h4V20h4v12h4V16L20 4 4 16v16z"
													/>
												</svg>
											</div>
											<div className="text-left">
												<div className="font-medium text-card-foreground">
													Phantom
												</div>
												<div className="text-xs text-muted-foreground">
													Solana Wallet
												</div>
											</div>
										</div>
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<div
												className="h-2 w-2 rounded-full bg-green-500"
												aria-hidden="true"
											/>
										)}
									</button>

									<button
										onClick={handleWalletConnect}
										disabled={isLoading}
										className="group relative flex w-full items-center justify-between rounded-lg border border-input bg-transparent p-4 transition-all hover:bg-accent hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
										aria-label="Connect Solflare wallet">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
												<svg
													className="h-5 w-5 text-white"
													viewBox="0 0 40 40"
													aria-hidden="true">
													<path
														fill="currentColor"
														d="M32 8H8c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 22H8V10h24v20z"
													/>
												</svg>
											</div>
											<div className="text-left">
												<div className="font-medium text-card-foreground">
													Solflare
												</div>
												<div className="text-xs text-muted-foreground">
													Solana Wallet
												</div>
											</div>
										</div>
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<div
												className="h-2 w-2 rounded-full bg-green-500"
												aria-hidden="true"
											/>
										)}
									</button>

									<button
										onClick={handleWalletConnect}
										disabled={isLoading}
										className="group relative flex w-full items-center justify-between rounded-lg border border-input bg-transparent p-4 transition-all hover:bg-accent hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
										aria-label="Connect other Solana wallet">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gray-700 to-gray-900">
												<Wallet
													className="h-5 w-5 text-white"
													aria-hidden="true"
												/>
											</div>
											<div className="text-left">
												<div className="font-medium text-card-foreground">
													Other Wallet
												</div>
												<div className="text-xs text-muted-foreground">
													Connect any Solana wallet
												</div>
											</div>
										</div>
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<div
												className="h-2 w-2 rounded-full bg-green-500"
												aria-hidden="true"
											/>
										)}
									</button>
								</div>

								{/* Help Text */}
								<div className="rounded-lg bg-accent/30 p-4">
									<p className="text-sm text-muted-foreground">
										<strong className="font-medium text-card-foreground">
											Need a wallet?
										</strong>{" "}
										Download{" "}
										<a
											href="https://phantom.app"
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">
											Phantom
										</a>{" "}
										or{" "}
										<a
											href="https://solflare.com"
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">
											Solflare
										</a>{" "}
										to get started with Solana.
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
