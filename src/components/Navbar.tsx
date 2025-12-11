/** @format */

"use client";

import { Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import { PortfolioDisplay } from "./navbar/PortfolioDisplay";
import NavDropdown from "./navbar/NavDropdown";

export default function Navbar() {
	const [signInModalOpen, setSignInModalOpen] = useState(false);
	const [signUpModalOpen, setSignUpModalOpen] = useState(false);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [walletCopied, setWalletCopied] = useState(false);

	// Check localStorage on component mount to persist auth state
	useEffect(() => {
		const savedAuthState = localStorage.getItem("polysight_isSignedIn");
		if (savedAuthState === "true") {
			setIsSignedIn(true);
		}
	}, []);

	// Save auth state to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("polysight_isSignedIn", isSignedIn.toString());
	}, [isSignedIn]);

	const handleCopyWallet = () => {
		setWalletCopied(true);
		setTimeout(() => setWalletCopied(false), 2000);
	};

	const handleSignIn = () => {
		setIsSignedIn(true);
		setSignInModalOpen(false);
		localStorage.setItem("polysight_isSignedIn", "true");
	};

	const handleSignUp = () => {
		setIsSignedIn(true);
		setSignUpModalOpen(false);
		localStorage.setItem("polysight_isSignedIn", "true");
	};

	const handleSignOut = () => {
		setIsSignedIn(false);
		localStorage.removeItem("polysight_isSignedIn");
	};

	const handleDeposit = () => {
		console.log("Deposit clicked");
	};

	const handleWalletConnected = () => {
		setIsSignedIn(true);
		localStorage.setItem("polysight_isSignedIn", "true");
	};

	return (
		<>
			<nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						{/* Logo on Left */}
						<div className="flex items-center flex-shrink-0">
							<Link
								href="/"
								className="flex items-center gap-2 sm:gap-3 group relative cursor-pointer">
								<div className="relative overflow-hidden">
									<div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-primary/80 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/30">
										<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
									</div>
								</div>
								<div className="flex flex-col transition-all duration-500 group-hover:translate-x-1">
									<span className="text-lg sm:text-xl font-medium tracking-tight text-foreground">
										Polysight
									</span>
									<span className="hidden xs:inline text-[10px] font-normal text-muted-foreground/80 transition-all duration-500 group-hover:opacity-100 group-hover:text-primary/80 mt-0.5">
										Predict • Trade • Win
									</span>
								</div>
							</Link>
						</div>

						{/* Search Bar - Show only on large screens and up */}
						<div className="hidden lg:flex flex-1 max-w-md mx-8">
							<div className="relative w-full group">
								<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-all duration-500 group-hover:text-primary group-hover:scale-110" />
								<input
									type="search"
									placeholder="Search Polysight"
									className="w-full rounded-lg border border-input/50 bg-card py-2.5 pl-11 pr-5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 font-medium cursor-text"
								/>
							</div>
						</div>

						{/* Portfolio Display container with auto margin to push to right */}
						<div className="hidden md:block ml-auto">
							{isSignedIn && <PortfolioDisplay onDeposit={handleDeposit} />}
						</div>

						{/* Right Section */}
						<div className="flex items-center gap-2 sm:gap-3">
							{/* Auth Buttons - Only show when not signed in on medium+ screens */}
							{!isSignedIn && (
								<div className="hidden md:flex items-center gap-2 lg:gap-3">
									<button
										onClick={() => setSignInModalOpen(true)}
										className="rounded-lg border border-input bg-transparent px-3 lg:px-4 py-2 text-sm font-medium text-card-foreground transition-all duration-500 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
										Login
									</button>
									<button
										onClick={() => setSignUpModalOpen(true)}
										className="rounded-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-3 lg:px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-500 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 cursor-pointer">
										Sign Up
									</button>
								</div>
							)}

							{/* Portfolio Display for small screens - Show only when signed in */}
							{isSignedIn && (
								<div className="md:hidden">
									<PortfolioDisplay onDeposit={handleDeposit} />
								</div>
							)}

							{/* Navigation Dropdown */}
							<NavDropdown
								isSignedIn={isSignedIn}
								onSignOut={handleSignOut}
								onCopyWallet={handleCopyWallet}
								walletCopied={walletCopied}
							/>
						</div>
					</div>
				</div>
			</nav>

			{/* Modals */}
			<SignInModal
				isOpen={signInModalOpen}
				onClose={() => setSignInModalOpen(false)}
				onSignIn={handleWalletConnected}
			/>

			<SignUpModal
				isOpen={signUpModalOpen}
				onClose={() => setSignUpModalOpen(false)}
				onSwitchToSignIn={() => {
					setSignUpModalOpen(false);
					setSignInModalOpen(true);
				}}
				onSignUp={handleWalletConnected}
			/>
		</>
	);
}
