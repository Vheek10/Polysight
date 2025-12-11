/** @format */

// components/MarketHero.tsx - Updated
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CategoryNavigation from "./CategoryNavigation";
import MarketCard from "./MarketCard";
import { fetchMarkets } from "@/lib/marketData";
import { Market } from "@/types/market"; // Import Market type

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

// Function to transform LightweightMarket to Market
function transformToMarket(lightMarket: LightweightMarket): Market {
	return {
		id: lightMarket.id,
		slug: `market-${lightMarket.id}`, // Generate a slug
		question: lightMarket.title,
		description: `Market about ${lightMarket.title}`,
		volume: lightMarket.volume,
		liquidity: lightMarket.liquidity,
		active: true,
		outcomePrices: [lightMarket.yesPrice, lightMarket.noPrice],
		endsAt: lightMarket.endDate,
		marketType: "binary",
		outcomes: [
			{ name: "Yes", price: lightMarket.yesPrice },
			{ name: "No", price: lightMarket.noPrice },
		],
		resolved: false,
		category: lightMarket.category,
		totalTrades: lightMarket.particants,
		// Add any other required properties from Market type
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		tags: lightMarket.tags,
		creator: "0x0000000000000000000000000000000000000000",
		resolutionSource: "",
		resolutionValue: null,
		fee: 0.02,
		volume24h: lightMarket.volume * 0.1, // Estimate 10% of total volume
	};
}

export default function MarketHero() {
	const router = useRouter();
	const [activeCategory, setActiveCategory] = useState("All Markets");
	const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]); // Change to Market[]
	const [loading, setLoading] = useState(true);

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

				const lightweightMarkets = await fetchMarkets(options);

				// Transform to Market type
				const markets: Market[] = lightweightMarkets.map(transformToMarket);

				setFilteredMarkets(markets);
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
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-xl font-semibold">
							{activeCategory === "All Markets"
								? "All Markets"
								: activeCategory}
							<span className="text-muted-foreground text-sm ml-2">
								({loading ? "..." : filteredMarkets.length} markets)
							</span>
						</h2>
						{!loading && filteredMarkets.length > 0 && (
							<p className="text-sm text-muted-foreground mt-1">
								Trade on real-world events with ultra-low fees
							</p>
						)}
					</div>
					<button
						onClick={() => router.push("/create")}
						className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors">
						Create Market
					</button>
				</div>

				{/* Markets Grid - 4 columns */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
					{loading ? (
						// Loading skeletons for 8 cards
						Array.from({ length: 8 }).map((_, i) => (
							<div
								key={i}
								className="bg-card border border-border rounded-lg animate-pulse">
								<div className="p-5">
									<div className="flex items-center justify-between mb-4">
										<div className="h-4 bg-muted rounded w-1/3" />
										<div className="h-4 bg-muted rounded w-1/4" />
									</div>
									<div className="h-5 bg-muted rounded mb-4" />
									<div className="h-5 bg-muted rounded mb-4" />
									<div className="h-8 bg-muted rounded mb-4" />
									<div className="h-9 bg-muted rounded" />
								</div>
							</div>
						))
					) : filteredMarkets.length === 0 ? (
						<div className="col-span-full text-center py-16">
							<h3 className="text-lg font-medium mb-3">No markets found</h3>
							<p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
								{activeCategory === "All Markets"
									? "No markets available at the moment."
									: `No markets found in "${activeCategory}". Try selecting a different category.`}
							</p>
							<button
								onClick={() => setActiveCategory("All Markets")}
								className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors">
								View All Markets
							</button>
						</div>
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
