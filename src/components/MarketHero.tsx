/** @format */

// components/MarketHero.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CategoryNavigation from "./CategoryNavigation";
import MarketCard from "./MarketCard";

// Mock market data for 2025
const mockMarkets = [
	{
		id: "1",
		title: "Will ETH reach $10,000 by Q2 2025?",
		category: "Crypto",
		volume: 285000,
		participants: 4450,
		yesPrice: 0.72,
		noPrice: 0.28,
		endDate: "2025-06-30",
		liquidity: 120000,
		tags: ["Trending", "Crypto"],
		change: "+12.5%",
	},
	{
		id: "2",
		title: "2025 US Presidential Election: Democratic Nominee",
		category: "Elections",
		volume: 450000,
		participants: 6820,
		yesPrice: 0.42,
		noPrice: 0.58,
		endDate: "2025-08-31",
		liquidity: 185000,
		tags: ["Breaking", "Elections"],
		change: "+8.3%",
	},
	{
		id: "3",
		title: "Will AGI be achieved before 2026?",
		category: "Tech",
		volume: 320000,
		participants: 5250,
		yesPrice: 0.38,
		noPrice: 0.62,
		endDate: "2025-12-31",
		liquidity: 95000,
		tags: ["New", "Tech"],
		change: "+15.2%",
	},
	{
		id: "4",
		title: "Bitcoin dominance above 55% by March 2025?",
		category: "Finance",
		volume: 185000,
		participants: 3420,
		yesPrice: 0.65,
		noPrice: 0.35,
		endDate: "2025-03-31",
		liquidity: 75000,
		tags: ["Trending", "Finance"],
		change: "+5.7%",
	},
	{
		id: "5",
		title: "2026 World Cup: Will host country win?",
		category: "Sports",
		volume: 125000,
		participants: 2180,
		yesPrice: 0.25,
		noPrice: 0.75,
		endDate: "2026-07-19",
		liquidity: 45000,
		tags: ["Sports"],
		change: "+3.2%",
	},
	{
		id: "6",
		title: "Russia-Ukraine peace deal before 2026?",
		category: "Geopolitics",
		volume: 275000,
		participants: 4320,
		yesPrice: 0.28,
		noPrice: 0.72,
		endDate: "2026-01-01",
		liquidity: 88000,
		tags: ["Breaking", "Geopolitics"],
		change: "-2.1%",
	},
	{
		id: "7",
		title: "Apple stock above $250 by Q4 2025?",
		category: "Earnings",
		volume: 195000,
		participants: 3250,
		yesPrice: 0.68,
		noPrice: 0.32,
		endDate: "2025-10-31",
		liquidity: 68000,
		tags: ["Earnings"],
		change: "+7.8%",
	},
	{
		id: "8",
		title: "AI-generated movie wins Oscar 2025?",
		category: "Culture",
		volume: 85000,
		participants: 1650,
		yesPrice: 0.45,
		noPrice: 0.55,
		endDate: "2025-03-02",
		liquidity: 32000,
		tags: ["New", "Culture"],
		change: "+18.4%",
	},
];

export default function MarketHero() {
	const router = useRouter();
	const [activeCategory, setActiveCategory] = useState("Trending");
	const [filteredMarkets, setFilteredMarkets] = useState(mockMarkets);

	// Filter markets based on active category
	useEffect(() => {
		let filtered = [...mockMarkets];

		if (activeCategory === "Trending") {
			filtered = filtered.filter((market) => market.tags?.includes("Trending"));
		} else if (activeCategory === "Breaking") {
			filtered = filtered.filter((market) => market.tags?.includes("Breaking"));
		} else if (activeCategory === "New") {
			filtered = filtered.filter((market) => market.tags?.includes("New"));
		} else if (activeCategory !== "All Markets") {
			filtered = filtered.filter(
				(market) => market.category === activeCategory,
			);
		}

		setFilteredMarkets(filtered);
	}, [activeCategory]);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<CategoryNavigation
				activeCategory={activeCategory}
				setActiveCategory={setActiveCategory}
			/>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-6">
				{/* Markets Grid */}
				<div>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-lg font-medium">
							{activeCategory}
							<span className="text-muted-foreground text-sm ml-2">
								({filteredMarkets.length})
							</span>
						</h2>
						<button
							onClick={() => router.push("/create")}
							className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors">
							Create Market
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredMarkets.map((market) => (
							<MarketCard
								key={market.id}
								market={market}
							/>
						))}
					</div>

					{filteredMarkets.length === 0 && (
						<div className="text-center py-12">
							<h3 className="text-base font-medium mb-2">No markets found</h3>
							<p className="text-muted-foreground text-sm mb-4">
								Try selecting a different category
							</p>
							<button
								onClick={() => {
									setActiveCategory("All Markets");
								}}
								className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors">
								View All Markets
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
