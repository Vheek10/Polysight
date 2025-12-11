/** @format */

// components/MarketCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Market } from "@/types/market";

export default function MarketCard({ market }: { market: Market }) {
	const router = useRouter();

	const [selectedSide, setSelectedSide] = useState<"yes" | "no" | null>(null);
	const [amount, setAmount] = useState("");
	const [isTradeMode, setIsTradeMode] = useState(false);

	const yesOutcome = market.outcomes[0];
	const noOutcome = market.outcomes[1];

	const yesPercentage = Math.round((yesOutcome?.probability ?? 0) * 100);
	const noPercentage = Math.round((noOutcome?.probability ?? 0) * 100);

	const formatVolume = (volume: number) => {
		if (volume >= 1000000) return `$${(volume / 1_000_000).toFixed(1)}M`;
		if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
		return `$${volume}`;
	};

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

		// Placeholder trade logic
		console.log(
			`Trade: ${selectedSide.toUpperCase()} $${amount} on market ${market.id}`,
		);

		// Reset
		setIsTradeMode(false);
		setSelectedSide(null);
		setAmount("");

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

	const selectedPrice =
		selectedSide === "yes" ? yesOutcome?.probability : noOutcome?.probability;

	return (
		<div
			onClick={handleCardClick}
			className="group cursor-pointer bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors">
			<div className="p-5">
				{/* Header */}
				<div className="flex items-center justify-between mb-3">
					<span className="text-xs font-medium text-muted-foreground">
						{market.category}
					</span>

					<span className="text-xs font-medium text-blue-500">
						{market.resolved ? "Resolved" : "Active"}
					</span>
				</div>

				{/* Question */}
				<h3 className="font-medium text-base mb-4 line-clamp-2 text-card-foreground">
					{market.question}
				</h3>

				{/* Probability Bars */}
				<div className="mb-4">
					<div className="flex justify-between text-xs mb-1">
						<span className="text-green-600 dark:text-green-400 font-medium">
							YES {yesPercentage}%
						</span>
						<span className="text-red-600 dark:text-red-400 font-medium">
							NO {noPercentage}%
						</span>
					</div>

					<div className="h-1.5 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-green-500"
							style={{ width: `${yesPercentage}%` }}
						/>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 gap-4 text-xs mb-4">
					<div>
						<p className="text-muted-foreground">Volume</p>
						<p className="font-medium text-card-foreground">
							{formatVolume(market.volume)}
						</p>
					</div>
					<div>
						<p className="text-muted-foreground">Trades</p>
						<p className="font-medium text-card-foreground">
							{market.totalTrades.toLocaleString()}
						</p>
					</div>
				</div>

				{/* Trade Mode */}
				{isTradeMode ? (
					<div
						onClick={(e) => e.stopPropagation()}
						className="space-y-3">
						{/* Side badge */}
						<div
							className={`p-2 rounded-md text-center text-sm font-medium ${
								selectedSide === "yes"
									? "bg-green-500/10 text-green-600 dark:text-green-400"
									: "bg-red-500/10 text-red-600 dark:text-red-400"
							}`}>
							You're buying {selectedSide?.toUpperCase()} shares
						</div>

						{/* Amount input */}
						<div className="space-y-2">
							<label className="text-xs text-muted-foreground block">
								Amount (USDC)
							</label>

							<div className="relative">
								<input
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder="0.00"
									className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
									min="0"
									step="0.01"
								/>
								<div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
									USDC
								</div>
							</div>
						</div>

						{/* Cost */}
						{amount && parseFloat(amount) > 0 && (
							<div className="text-xs text-muted-foreground">
								Cost: ${(parseFloat(amount) * (selectedPrice ?? 0)).toFixed(2)}
							</div>
						)}

						{/* Buttons */}
						<div className="flex gap-2">
							<button
								onClick={handleCancelTrade}
								className="flex-1 py-2 text-xs font-medium rounded-md border border-input hover:bg-accent transition-colors">
								Cancel
							</button>

							<button
								onClick={handleTradeSubmit}
								disabled={!amount || parseFloat(amount) <= 0}
								className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
									!amount || parseFloat(amount) <= 0
										? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
										: selectedSide === "yes"
										? "bg-green-500 hover:bg-green-600 text-white"
										: "bg-red-500 hover:bg-red-600 text-white"
								}`}>
								Buy {selectedSide?.toUpperCase()}
							</button>
						</div>
					</div>
				) : (
					/* Normal Yes/No buttons */
					<div className="flex gap-2">
						<button
							onClick={handleYesClick}
							className="flex-1 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium rounded-md transition-colors">
							<div className="flex flex-col items-center">
								<span className="font-bold">{yesPercentage}%</span>
								<span className="text-xs opacity-90">YES</span>
							</div>
						</button>

						<button
							onClick={handleNoClick}
							className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-md transition-colors">
							<div className="flex flex-col items-center">
								<span className="font-bold">{noPercentage}%</span>
								<span className="text-xs opacity-90">NO</span>
							</div>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
