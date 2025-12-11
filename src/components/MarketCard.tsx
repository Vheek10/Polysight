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

	const formatVolume = (volume: number): string => {
		if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
		if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
		return `$${volume}`;
	};

	const yesPercentage = Math.round(market.yesPrice * 100);
	const noPercentage = Math.round(market.noPrice * 100);

	const handleYesClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		// Navigate to trade page with "yes" option selected
		router.push(`/market/${market.id}?side=yes`);
	};

	const handleNoClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		// Navigate to trade page with "no" option selected
		router.push(`/market/${market.id}?side=no`);
	};

	return (
		<div
			onClick={() => router.push(`/market/${market.id}`)}
			className="group cursor-pointer bg-card border border-border rounded-lg hover:bg-accent transition-colors">
			{/* Market Content */}
			<div className="p-5">
				<div className="flex items-center justify-between mb-3">
					<span className="text-xs font-medium text-muted-foreground">
						{market.category}
					</span>
					<span
						className={`text-xs font-medium ${
							market.change.startsWith("+")
								? "text-green-600 dark:text-green-400"
								: "text-red-600 dark:text-red-400"
						}`}>
						{market.change}
					</span>
				</div>

				<h3 className="font-medium text-base mb-4 line-clamp-2 text-card-foreground">
					{market.title}
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
						<p className="text-muted-foreground">Traders</p>
						<p className="font-medium text-card-foreground">
							{market.participants.toLocaleString()}
						</p>
					</div>
				</div>

				{/* Yes/No Action Buttons */}
				<div className="grid grid-cols-2 gap-3">
					{/* YES Button */}
					<button
						onClick={handleYesClick}
						className="px-3 py-2.5 bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium rounded-md hover:bg-green-500/20 transition-colors border border-green-500/20">
						<div className="flex flex-col items-center">
							<span className="font-bold text-lg">{yesPercentage}%</span>
							<span className="text-xs mt-0.5">YES</span>
						</div>
					</button>

					{/* NO Button */}
					<button
						onClick={handleNoClick}
						className="px-3 py-2.5 bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium rounded-md hover:bg-red-500/20 transition-colors border border-red-500/20">
						<div className="flex flex-col items-center">
							<span className="font-bold text-lg">{noPercentage}%</span>
							<span className="text-xs mt-0.5">NO</span>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
}
