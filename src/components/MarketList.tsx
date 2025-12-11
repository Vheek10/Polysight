/** @format */

// components/markets/MarketList.tsx
"use client";

import MarketCard from "./MarketCard";
import { Market } from "@/types/market";

export default function MarketList({ markets }: { markets?: Market[] }) {
	const mockMarkets: Market[] = markets || [
		{
			id: "1",
			question: "Will BTC hit $100k by 2025?",
			description: "Prediction market example",
			category: "crypto",
			outcomes: [],
			volume: 0,
			liquidity: 0,
			endDate: new Date(),
			resolved: false,
			creator: "",
			createdAt: new Date(),
			totalTrades: 0,
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{mockMarkets.map((market) => (
				<MarketCard
					key={market.id}
					market={market}
				/>
			))}
		</div>
	);
}
