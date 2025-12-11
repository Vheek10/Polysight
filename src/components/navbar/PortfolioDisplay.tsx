/** @format */

// components/navbar/PortfolioDisplay.tsx
"use client";

import { Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

interface PortfolioDisplayProps {
	onDeposit: () => void;
}

export function PortfolioDisplay({ onDeposit }: PortfolioDisplayProps) {
	const { connected, publicKey } = useWallet();
	const { connection } = useConnection();

	const [portfolioValue, setPortfolioValue] = useState<number>(0);
	const [cashBalance, setCashBalance] = useState<number>(0);
	const [solBalance, setSolBalance] = useState<number>(0);
	const [solPrice, setSolPrice] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [hasNotifications, setHasNotifications] = useState<boolean>(true);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	};

	const fetchWalletData = async () => {
		if (!connected || !publicKey) {
			setPortfolioValue(0);
			setCashBalance(0);
			setSolBalance(0);
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);

			// Fetch SOL price from CoinGecko
			const priceResponse = await fetch(
				"https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
			);
			const priceData = await priceResponse.json();
			const currentSolPrice = priceData.solana?.usd || 100;
			setSolPrice(currentSolPrice);

			// Fetch wallet balance
			const balance = await connection.getBalance(publicKey);
			const currentSolBalance = balance / LAMPORTS_PER_SOL;
			setSolBalance(currentSolBalance);

			// Calculate USD values
			const solValue = currentSolBalance * currentSolPrice;

			// For this demo, portfolio = SOL value, cash = SOL value
			// In production, you'd fetch token balances and separate cash from investments
			setPortfolioValue(solValue);
			setCashBalance(solValue);
		} catch (error) {
			console.error("Error fetching wallet data:", error);
			setPortfolioValue(0);
			setCashBalance(0);
			setSolBalance(0);
			setSolPrice(100);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchWalletData();

		const intervalId = setInterval(fetchWalletData, 30000);

		return () => clearInterval(intervalId);
	}, [connected, publicKey, connection]);

	if (!connected) {
		return null;
	}

	return (
		<>
			{/* Small Screen (mobile) - Only notification bell */}
			<div className="flex md:hidden items-center mr-3">
				<button className="relative p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
					<Bell className="h-4 w-4 text-muted-foreground hover:text-foreground" />
					{hasNotifications && (
						<div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 animate-pulse ring-1 ring-background" />
					)}
				</button>
			</div>

			{/* Tablet & Desktop View */}
			<div className="hidden md:flex items-center gap-4 lg:gap-6 pr-4">
				{/* Notification Bell */}
				<div className="relative">
					<button className="relative p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
						<Bell className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground hover:text-foreground transition-colors" />
						{hasNotifications && (
							<div className="absolute -top-0.5 -right-0.5 h-2 w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-red-500 animate-pulse ring-1 lg:ring-2 ring-background" />
						)}
					</button>
				</div>

				{/* Portfolio Value */}
				<div className="text-right">
					<div className="text-xs font-normal text-muted-foreground mb-0.5">
						Portfolio
					</div>
					<div className="text-sm lg:text-base font-semibold text-foreground">
						{isLoading ? (
							<div className="h-4 lg:h-5 w-16 lg:w-24 bg-muted rounded animate-pulse" />
						) : portfolioValue === 0 ? (
							<span className="text-muted-foreground">$0.00</span>
						) : (
							formatCurrency(portfolioValue)
						)}
					</div>
				</div>

				{/* Divider - Show on tablet and desktop */}
				<div className="hidden lg:block h-8 w-px bg-border" />

				{/* Cash Balance - Show on desktop only */}
				<div className="hidden lg:block text-right">
					<div className="text-xs font-normal text-muted-foreground mb-0.5">
						Cash
					</div>
					<div className="text-base font-semibold text-foreground">
						{isLoading ? (
							<div className="h-5 w-24 bg-muted rounded animate-pulse" />
						) : cashBalance === 0 ? (
							<span className="text-muted-foreground">$0.00</span>
						) : (
							formatCurrency(cashBalance)
						)}
					</div>
				</div>

				{/* Divider - Show on desktop only */}
				<div className="hidden lg:block h-8 w-px bg-border" />

				{/* Deposit Button */}
				<button
					onClick={onDeposit}
					disabled={isLoading}
					className={cn(
						"rounded-lg px-3 lg:px-4 py-1.5 lg:py-2",
						"text-xs lg:text-sm font-medium text-primary-foreground",
						"transition-all duration-500",
						"hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5",
						"disabled:opacity-50 disabled:cursor-not-allowed",
						"bg-gradient-to-r from-primary via-primary/90 to-primary/80",
					)}>
					{isLoading ? (
						<>
							<Loader2 className="h-3 w-3 lg:h-4 lg:w-4 animate-spin inline mr-1 lg:mr-2" />
							<span className="hidden lg:inline">Loading...</span>
						</>
					) : (
						"Deposit"
					)}
				</button>
			</div>
		</>
	);
}
