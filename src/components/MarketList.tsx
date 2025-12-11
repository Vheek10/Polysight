/** @format */

// components/MarketCard.tsx
"use client";

import { useRouter } from "next/navigation";

interface MarketCardProps {
	market: {
		id: string;
		title: string;
		category: string;
		volume: number;
		participants: number;
		yesPrice: number;
		noPrice: number;
		endDate: string;
		liquidity: number;
		tags: string[];
		change: string;
	};
}

export default function MarketCard({ market }: MarketCardProps) {
	const router = useRouter();

	// Safety check for market data
	if (!market) return null;

	const formatVolume = (volume: number) => {
		if (!volume) return "$0";
		if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
		if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
		return `$${volume}`;
	};

	// Safely get change value
	const changeValue = market.change || "0%";
	const isPositive = changeValue.startsWith("+");

	return (
		<div
			onClick={() => router.push(`/market/${market.id}`)}
			className="group cursor-pointer bg-card border border-border rounded-lg hover:bg-accent transition-colors">
			{/* Market Content */}
			<div className="p-5">
				<div className="flex items-center justify-between mb-3">
					<span className="text-xs font-medium text-muted-foreground">
						{market.category || "Uncategorized"}
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

				<h3 className="font-medium text-base mb-4 line-clamp-2 text-card-foreground">
					{market.title || "Untitled Market"}
				</h3>

				{/* Probability Bars */}
				<div className="mb-4">
					<div className="flex justify-between text-xs mb-1">
						<span className="text-green-600 dark:text-green-400">
							YES {Math.round((market.yesPrice || 0) * 100)}%
						</span>
						<span className="text-red-600 dark:text-red-400">
							NO {Math.round((market.noPrice || 0) * 100)}%
						</span>
					</div>
					<div className="h-1.5 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-green-500"
							style={{ width: `${(market.yesPrice || 0) * 100}%` }}
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
						<p className="text-muted-foreground">Traders</p>
						<p className="font-medium text-card-foreground">
							{(market.participants || 0).toLocaleString()}
						</p>
					</div>
				</div>

				{/* Action Button */}
				<button
					onClick={(e) => {
						e.stopPropagation();
						router.push(`/market/${market.id}`);
					}}
					className="w-full px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors">
					Trade Now
				</button>
			</div>
		</div>
	);
}
