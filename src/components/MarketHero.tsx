/** @format */

// components/MarketHero.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CategoryNavigation from "./CategoryNavigation";
import MarketCard from "./MarketCard";
import { fetchMarkets } from "@/lib/marketData";

// Lightweight type for MVP UI cards
interface LightweightMarket {
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
}

export default function MarketHero() {
	const router = useRouter();
	const [activeCategory, setActiveCategory] = useState("All Markets");
	const [filteredMarkets, setFilteredMarkets] = useState<LightweightMarket[]>(
		[],
	);
	const [loading, setLoading] = useState(true);

	const [marketStats, setMarketStats] = useState({
		totalVolume: 0,
		activeMarkets: 0,
		totalParticipants: 0,
		totalMarkets: 0,
	});

	// Fetch markets based on active category
	useEffect(() => {
		const loadMarkets = async () => {
			setLoading(true);
			try {
				const options: any = {};

				if (activeCategory === "Trending") {
					options.trending = true;
				} else if (activeCategory === "Breaking") {
					options.breaking = true;
				} else if (activeCategory === "New") {
					options.new = true;
				} else if (activeCategory !== "All Markets") {
					options.category = activeCategory;
				}

				const markets = await fetchMarkets(options);
				setFilteredMarkets(markets);

				// Calculate stats
				const totalVolume = markets.reduce(
					(sum: number, m: LightweightMarket) => sum + m.volume,
					0,
				);

				const totalParticipants = markets.reduce(
					(sum: number, m: LightweightMarket) => sum + m.participants,
					0,
				);

				setMarketStats({
					totalVolume,
					activeMarkets: markets.length,
					totalParticipants,
					totalMarkets: markets.length,
				});
			} catch (error) {
				console.error("Error loading markets:", error);
			} finally {
				setLoading(false);
			}
		};

		loadMarkets();
	}, [activeCategory]);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<CategoryNavigation
				activeCategory={activeCategory}
				setActiveCategory={setActiveCategory}
			/>

			<div className="max-w-7xl mx-auto px-4 py-6">
				{/* Market Stats */}
				{!loading && (
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
						<div className="bg-card border border-border rounded-lg p-4">
							<p className="text-sm text-muted-foreground">Total Volume</p>
							<p className="text-2xl font-bold">
								${(marketStats.totalVolume / 1000).toFixed(1)}k
							</p>
						</div>

						<div className="bg-card border border-border rounded-lg p-4">
							<p className="text-sm text-muted-foreground">Active Markets</p>
							<p className="text-2xl font-bold">{marketStats.activeMarkets}</p>
						</div>

						<div className="bg-card border border-border rounded-lg p-4">
							<p className="text-sm text-muted-foreground">Participants</p>
							<p className="text-2xl font-bold">
								{marketStats.totalParticipants}
							</p>
						</div>

						<div className="bg-card border border-border rounded-lg p-4">
							<p className="text-sm text-muted-foreground">Total Markets</p>
							<p className="text-2xl font-bold">{marketStats.totalMarkets}</p>
						</div>
					</div>
				)}

				{/* Markets Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{loading ? (
						<p className="text-center text-muted-foreground col-span-full">
							Loading markets...
						</p>
					) : filteredMarkets.length === 0 ? (
						<p className="text-center text-muted-foreground col-span-full">
							No markets found.
						</p>
					) : (
						filteredMarkets.map((market) => (
							<MarketCard
								key={market.id}
								market={market}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}
