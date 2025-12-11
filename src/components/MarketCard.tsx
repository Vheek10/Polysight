/** @format */

// src/components/MarketCard.tsx - Updated to match new types
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Market } from "@/types/market";

interface MarketCardProps {
	market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
	const router = useRouter();
	const [selectedSide, setSelectedSide] = useState<"yes" | "no" | null>(null);
	const [amount, setAmount] = useState<string>("");
	const [isTradeMode, setIsTradeMode] = useState(false);

	// Safety checks for market data
	if (!market) return null;

	// Get YES and NO outcomes
	const yesOutcome = market.outcomes.find((o) => o.name === "YES");
	const noOutcome = market.outcomes.find((o) => o.name === "NO");

	const yesPrice = yesOutcome?.currentPrice || 0.5;
	const noPrice = noOutcome?.currentPrice || 0.5;
	const yesPercentage = Math.round((yesOutcome?.probability || 0.5) * 100);
	const noPercentage = Math.round((noOutcome?.probability || 0.5) * 100);
	const participants = market.totalTrades || 0;
	const change = "+5.2%"; // Mock change for now

	const formatVolume = (volume: number): string => {
		if (!volume && volume !== 0) return "$0";
		if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
		if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
		return `$${volume}`;
	};

	// Safely get change value
	const changeValue = change || "0%";
	const isPositive = changeValue.startsWith("+");

	const handleYesClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedSide("yes");
		setIsTradeMode(true);
	};

	const handleNoClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedSide("no");
		setIsTradeMode(true);
	};

	const handleTradeSubmit = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!selectedSide || !amount || parseFloat(amount) <= 0) return;

		// Submit trade logic here
		console.log(
			`Trade: ${selectedSide.toUpperCase()} $${amount} on market ${market.id}`,
		);

		// Reset trade mode
		setIsTradeMode(false);
		setSelectedSide(null);
		setAmount("");

		// Navigate to market page or show success message
		router.push(`/market/${market.id}?side=${selectedSide}&amount=${amount}`);
	};

	const handleCancelTrade = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsTradeMode(false);
		setSelectedSide(null);
		setAmount("");
	};

	const handleCardClick = () => {
		if (!isTradeMode) {
			router.push(`/market/${market.id}`);
		}
	};

	return (
		<div
			onClick={handleCardClick}
			className="cursor-pointer bg-card border border-border rounded-lg hover:bg-accent/30 transition-colors">
			{/* Market Content - Compact */}
			<div className="p-4">
				<div className="flex items-center justify-between mb-2">
					<span className="text-xs font-medium text-muted-foreground">
						{market.category || "all"}
					</span>
					<span
						className={`text-xs font-medium ${
							isPositive
								? "text-green-600 dark:text-green-400"
								: "text-red-600 dark:text-red-400"
						}`}>
						{changeValue}
					</span>
				</div>

				<h3 className="font-medium text-sm mb-3 line-clamp-2 text-card-foreground leading-tight">
					{market.question}
				</h3>

				{/* Probability Bars - Compact */}
				<div className="mb-3">
					<div className="flex justify-between text-xs mb-1">
						<span className="text-green-600 dark:text-green-400 font-medium">
							YES {yesPercentage}%
						</span>
						<span className="text-red-600 dark:text-red-400 font-medium">
							NO {noPercentage}%
						</span>
					</div>
					<div className="h-1 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-green-500"
							style={{ width: `${yesPercentage}%` }}
						/>
					</div>
				</div>

				{/* Stats - Compact */}
				<div className="grid grid-cols-2 gap-3 text-xs mb-3">
					<div>
						<p className="text-muted-foreground">Volume</p>
						<p className="font-medium text-card-foreground">
							{formatVolume(market.volume || 0)}
						</p>
					</div>
					<div>
						<p className="text-muted-foreground">Traders</p>
						<p className="font-medium text-card-foreground">
							{participants.toLocaleString()}
						</p>
					</div>
				</div>

				{/* Trade Mode UI */}
				{isTradeMode ? (
					<div
						className="space-y-2"
						onClick={(e) => e.stopPropagation()}>
						{/* Selected Side Display */}
						<div
							className={`p-1.5 rounded text-center text-xs font-medium ${
								selectedSide === "yes"
									? "bg-green-500/10 text-green-600 dark:text-green-400"
									: "bg-red-500/10 text-red-600 dark:text-red-400"
							}`}>
							Buy {selectedSide?.toUpperCase()}
						</div>

						{/* Amount Input */}
						<div className="space-y-1">
							<div className="relative">
								<input
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder="Amount"
									className="w-full bg-background border border-input rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
									min="0"
									step="0.01"
								/>
								<div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
									USDC
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-1.5">
							<button
								onClick={handleCancelTrade}
								className="flex-1 py-1.5 text-xs font-medium rounded border border-input hover:bg-accent transition-colors">
								Cancel
							</button>
							<button
								onClick={handleTradeSubmit}
								disabled={!amount || parseFloat(amount) <= 0}
								className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
									!amount || parseFloat(amount) <= 0
										? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
										: selectedSide === "yes"
										? "bg-green-500 hover:bg-green-600 text-white"
										: "bg-red-500 hover:bg-red-600 text-white"
								}`}>
								Buy
							</button>
						</div>
					</div>
				) : (
					/* Normal Yes/No Buttons - Compact */
					<div className="flex gap-1.5">
						{/* YES Button */}
						<button
							onClick={handleYesClick}
							className="flex-1 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium rounded transition-colors">
							<div className="flex flex-col items-center">
								<span className="font-bold text-sm">{yesPercentage}%</span>
								<span className="text-[10px] opacity-90">YES</span>
							</div>
						</button>

						{/* NO Button */}
						<button
							onClick={handleNoClick}
							className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium rounded transition-colors">
							<div className="flex flex-col items-center">
								<span className="font-bold text-sm">{noPercentage}%</span>
								<span className="text-[10px] opacity-90">NO</span>
							</div>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
